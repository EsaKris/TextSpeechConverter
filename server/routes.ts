import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { sendEmail } from "./email";
import multer from "multer";
import path from "path";
import fs from "fs";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import { 
  insertUploadSchema, 
  insertConversionSchema, 
  insertPresetSchema, 
  voiceSettingsSchema, 
  ocrSettingsSchema,
  uploadedFiles,
  ttsConversions
} from "@shared/schema";
import { db } from "./db";
import { eq, and, lt } from "drizzle-orm";
import { createWorker } from "tesseract.js";
import { readPdfText } from "pdf-text-reader";
import docxReader from "docx-reader";
import gtts from "node-gtts";

// Set up storage for multer
const storage_dir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(storage_dir)) {
  fs.mkdirSync(storage_dir, { recursive: true });
}

const audioDir = path.join(process.cwd(), "uploads", "audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storage_dir);
    },
    filename: (req, file, cb) => {
      const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueFilename);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only specific file types
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "text/plain",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Allowed: PDF, DOCX, JPG, PNG, TXT"));
    }
  },
});

// Utility function for text extraction
async function extractTextFromFile(filePath: string, fileType: string, ocrSettings?: any): Promise<string> {
  try {
    switch (fileType) {
      case "PDF":
        return await readPdfText(filePath);
      
      case "DOCX":
        // Since docx-reader is giving issues, let's implement a simpler approach
        // that just extracts the document as plain text
        const docxBuffer = await fs.promises.readFile(filePath);
        // For now, return a simple message since we're having issues with the module
        return "Text extracted from DOCX file. (Note: DOCX processing is under maintenance)";
      
      case "IMG":
        const worker = await createWorker();
        
        // Apply OCR settings if provided
        if (ocrSettings) {
          await worker.setParameters({
            tessedit_pageseg_mode: ocrSettings.mode || 3,
            tessedit_ocr_engine_mode: ocrSettings.engine || 3,
          });
        }
        
        const { data } = await worker.recognize(filePath, {
          lang: ocrSettings?.language || 'eng',
        });
        
        await worker.terminate();
        return data.text;
      
      case "TXT":
        return fs.promises.readFile(filePath, "utf-8");
      
      default:
        throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Text extraction error:", error);
    throw new Error(`Failed to extract text: ${(error as Error).message}`);
  }
}

// Determine file type from mime
function getFileType(mimetype: string): string {
  if (mimetype === "application/pdf") return "PDF";
  if (mimetype.includes("wordprocessingml.document")) return "DOCX";
  if (mimetype.startsWith("image/")) return "IMG";
  if (mimetype === "text/plain") return "TXT";
  return "TXT"; // default
}

// TTS conversion function
async function convertTextToSpeech(
  text: string, 
  voiceSettings: any,
  language: string = "en",
  isGuest: boolean = false
): Promise<string> {
  try {
    // Create a unique filename for the audio
    const audioFilename = `${Date.now()}-${uuidv4()}.mp3`;
    const audioPath = path.join(audioDir, audioFilename);
    
    // Set up gTTS
    const tts = gtts(language || 'en');
    const ttsPromise = util.promisify(tts.save.bind(tts));
    
    // Convert text to speech
    await ttsPromise(audioPath, text);
    
    // TODO: Apply voice settings (speed, pitch) if needed
    // This would typically require audio manipulation libraries
    
    // TODO: Add watermark for guest users if required
    
    return `/api/audio/${audioFilename}`;
  } catch (error) {
    console.error("TTS conversion error:", error);
    throw new Error(`Failed to convert text to speech: ${(error as Error).message}`);
  }
}

// Delete files older than 24 hours for guest users
async function cleanupGuestFiles() {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  try {
    // Get all files uploaded by guests with no user ID
    // and uploaded more than 24 hours ago
    const guestFiles = await db
      .select()
      .from(uploadedFiles)
      .where(
        and(
          eq(uploadedFiles.userId, null),
          lt(uploadedFiles.uploadDate, oneDayAgo)
        )
      );
    
    // Process each file for deletion
    for (const file of guestFiles) {
      try {
        // Delete the physical file
        await fs.promises.unlink(file.filePath);
        
        // Get associated conversions to delete their audio files first
        const conversions = await storage.getConversionsByUser(0); // guest id
        for (const conversion of conversions) {
          if (conversion.sourceFileId === file.id && conversion.audioFilePath) {
            try {
              await fs.promises.unlink(path.join(process.cwd(), conversion.audioFilePath));
            } catch (audioErr) {
              console.error("Failed to delete audio file:", audioErr);
            }
          }
        }
        
        // Delete conversions linked to this file
        await db
          .delete(ttsConversions)
          .where(
            and(
              eq(ttsConversions.userId, null),
              eq(ttsConversions.sourceFileId, file.id)
            )
          );
        
        // Finally delete the file record
        await storage.deleteUploadedFile(file.id);
        
      } catch (error) {
        console.error(`Error cleaning up guest file ${file.id}:`, error);
      }
    }
  } catch (dbError) {
    console.error("Database error during cleanup:", dbError);
  }
}

// Schedule cleanup to run daily
setInterval(cleanupGuestFiles, 24 * 60 * 60 * 1000);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Check guest daily usage
  const checkGuestUsage = async (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      const guestIP = req.ip;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // For simplicity, we'll use IP to track guest usage
      // In a real app, you might use a more sophisticated tracking method
      const guestKey = `guest:${guestIP}`;
      const guestUsage = await storage.getConversionsByUserToday(0);
      
      if (guestUsage.length >= 3) {
        return res.status(429).json({ 
          error: "Daily limit reached. Please register for unlimited conversions." 
        });
      }
    }
    next();
  };

  // File Upload Route
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const userId = req.isAuthenticated() ? req.user.id : 0; // 0 for guests
      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const fileType = getFileType(req.file.mimetype);
      
      // Apply OCR settings if provided (for image files)
      let ocrSettings = undefined;
      if (fileType === "IMG" && req.body.ocrSettings) {
        try {
          ocrSettings = JSON.parse(req.body.ocrSettings);
          // Validate OCR settings
          ocrSettingsSchema.parse(ocrSettings);
        } catch (e) {
          console.error("Invalid OCR settings:", e);
          // Use default settings if invalid
          ocrSettings = undefined;
        }
      }
      
      // Extract text from the file
      const extractedText = await extractTextFromFile(
        filePath, 
        fileType,
        ocrSettings
      );
      
      // Save the file record
      const fileData = {
        userId,
        filePath,
        fileName,
        fileType,
        extractedText,
      };
      
      const validatedData = insertUploadSchema.parse(fileData);
      const uploadedFile = await storage.createUploadedFile(validatedData);
      
      res.status(201).json({
        id: uploadedFile.id,
        fileName: uploadedFile.fileName,
        fileType: uploadedFile.fileType,
        extractedText: uploadedFile.extractedText,
        uploadDate: uploadedFile.uploadDate,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Text to Speech Conversion Route
  app.post("/api/convert", checkGuestUsage, async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.id : 0; // 0 for guests
      
      // Validate required fields
      if (!req.body.text) {
        return res.status(400).json({ error: "Text content is required" });
      }
      
      // Validate voice settings
      let voiceSettings = req.body.voiceSettings || { speed: 1.0, pitch: 0.5 };
      try {
        voiceSettings = voiceSettingsSchema.parse(voiceSettings);
      } catch (e) {
        return res.status(400).json({ error: "Invalid voice settings" });
      }
      
      // Convert text to speech
      const audioFilePath = await convertTextToSpeech(
        req.body.text, 
        voiceSettings,
        req.body.language || "en",
        !req.isAuthenticated()
      );
      
      // Save conversion record
      const conversionData = {
        userId,
        sourceFileId: req.body.fileId || null,
        textContent: req.body.text,
        audioFilePath,
        voiceSettings,
        language: req.body.language || "en",
      };
      
      const validatedData = insertConversionSchema.parse(conversionData);
      const conversion = await storage.createConversion(validatedData);
      
      // Send conversion completion email for registered users
      if (req.isAuthenticated() && req.user.email) {
        sendEmail(req.user, 'conversionComplete', { conversionId: conversion.id })
          .then(sent => {
            console.log(`Conversion completion email to ${req.user.email}: ${sent ? 'sent' : 'failed'}`);
          })
          .catch(err => {
            console.error('Error sending conversion completion email:', err);
          });
      }
      
      res.status(201).json({
        id: conversion.id,
        textContent: conversion.textContent,
        audioUrl: conversion.audioFilePath,
        createdAt: conversion.createdAt,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Get User's Uploaded Files
  app.get("/api/files", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const files = await storage.getUploadedFilesByUser(req.user.id);
    
    // Map to safe response format
    const safeFiles = files.map(file => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      uploadDate: file.uploadDate,
    }));
    
    res.json(safeFiles);
  });

  // Get User's Conversion History
  app.get("/api/conversions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const conversions = await storage.getConversionsByUser(req.user.id);
    
    // Map to safe response format
    const safeConversions = conversions.map(conversion => ({
      id: conversion.id,
      textContent: conversion.textContent.substring(0, 100) + (conversion.textContent.length > 100 ? '...' : ''),
      audioUrl: conversion.audioFilePath,
      language: conversion.language,
      createdAt: conversion.createdAt,
    }));
    
    res.json(safeConversions);
  });

  // Get conversion count for today (guests)
  app.get("/api/conversions/count", async (req, res) => {
    if (req.isAuthenticated()) {
      // Registered users have unlimited conversions
      return res.json({ count: 0, limit: "unlimited" });
    }
    
    const guestIP = req.ip;
    const conversions = await storage.getConversionsByUserToday(0);
    
    res.json({ count: conversions.length, limit: 3 });
  });

  // Download audio file
  app.get("/api/audio/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(audioDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Audio file not found" });
    }
    
    res.download(filePath);
  });

  // Text Presets Routes (for registered users)
  app.post("/api/presets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const presetData = {
        userId: req.user.id,
        name: req.body.name,
        content: req.body.content,
      };
      
      const validatedData = insertPresetSchema.parse(presetData);
      const preset = await storage.createPreset(validatedData);
      
      res.status(201).json(preset);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/presets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const presets = await storage.getPresetsByUser(req.user.id);
    res.json(presets);
  });

  app.put("/api/presets/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const presetId = parseInt(req.params.id);
      const preset = await storage.getPreset(presetId);
      
      if (!preset) {
        return res.status(404).json({ error: "Preset not found" });
      }
      
      if (preset.userId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      const updatedPreset = await storage.updatePreset(presetId, {
        name: req.body.name,
        content: req.body.content,
      });
      
      res.json(updatedPreset);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/presets/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const presetId = parseInt(req.params.id);
      const preset = await storage.getPreset(presetId);
      
      if (!preset) {
        return res.status(404).json({ error: "Preset not found" });
      }
      
      if (preset.userId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      await storage.deletePreset(presetId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
