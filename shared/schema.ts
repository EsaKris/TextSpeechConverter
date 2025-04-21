import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  darkMode: boolean("dark_mode").default(false),
  ttsCredits: integer("tts_credits").default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// File types enum
export const FILE_TYPES = {
  PDF: "PDF",
  DOCX: "DOCX",
  IMG: "IMG",
  TXT: "TXT",
} as const;

// Upload model
export const uploadedFiles = pgTable("uploaded_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  filePath: text("file_path").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  extractedText: text("extracted_text"),
  processed: boolean("processed").default(false),
  uploadDate: timestamp("upload_date").defaultNow(),
});

export const insertUploadSchema = createInsertSchema(uploadedFiles).pick({
  userId: true,
  filePath: true,
  fileName: true,
  fileType: true,
  extractedText: true,
});

// TTS Conversion model
export const ttsConversions = pgTable("tts_conversions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  sourceFileId: integer("source_file_id").references(() => uploadedFiles.id),
  textContent: text("text_content").notNull(),
  audioFilePath: text("audio_file_path"),
  voiceSettings: json("voice_settings").notNull(),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConversionSchema = createInsertSchema(ttsConversions).pick({
  userId: true,
  sourceFileId: true,
  textContent: true,
  audioFilePath: true,
  voiceSettings: true,
  language: true,
});

// Voice Settings schema for validation
export const voiceSettingsSchema = z.object({
  speed: z.number().min(0.5).max(1.5).default(1.0),
  pitch: z.number().min(0.1).max(0.9).default(0.5),
  voiceType: z.enum(["male1", "female1", "male2", "female2"]).default("male1"),
});

// OCR Settings schema for validation
export const ocrSettingsSchema = z.object({
  mode: z.number().min(0).max(13).default(3),
  engine: z.number().min(0).max(3).default(3),
  language: z.string().default("eng"),
});

// Text Preset model for registered users
export const textPresets = pgTable("text_presets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPresetSchema = createInsertSchema(textPresets).pick({
  userId: true,
  name: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadSchema>;
export type TTSConversion = typeof ttsConversions.$inferSelect;
export type InsertTTSConversion = z.infer<typeof insertConversionSchema>;
export type TextPreset = typeof textPresets.$inferSelect;
export type InsertTextPreset = z.infer<typeof insertPresetSchema>;
export type VoiceSettings = z.infer<typeof voiceSettingsSchema>;
export type OCRSettings = z.infer<typeof ocrSettingsSchema>;
