import { 
  users, type User, type InsertUser,
  uploadedFiles, type UploadedFile, type InsertUploadedFile,
  ttsConversions, type TTSConversion, type InsertTTSConversion,
  textPresets, type TextPreset, type InsertTextPreset
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  
  // File operations
  getUploadedFile(id: number): Promise<UploadedFile | undefined>;
  getUploadedFilesByUser(userId: number): Promise<UploadedFile[]>;
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  updateUploadedFile(id: number, data: Partial<UploadedFile>): Promise<UploadedFile>;
  deleteUploadedFile(id: number): Promise<void>;
  
  // TTS Conversion operations
  getConversion(id: number): Promise<TTSConversion | undefined>;
  getConversionsByUser(userId: number): Promise<TTSConversion[]>;
  getConversionsByUserToday(userId: number): Promise<TTSConversion[]>;
  createConversion(conversion: InsertTTSConversion): Promise<TTSConversion>;
  deleteConversion(id: number): Promise<void>;
  
  // Text Preset operations
  getPreset(id: number): Promise<TextPreset | undefined>;
  getPresetsByUser(userId: number): Promise<TextPreset[]>;
  createPreset(preset: InsertTextPreset): Promise<TextPreset>;
  updatePreset(id: number, data: Partial<TextPreset>): Promise<TextPreset>;
  deletePreset(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private uploadedFiles: Map<number, UploadedFile>;
  private ttsConversions: Map<number, TTSConversion>;
  private textPresets: Map<number, TextPreset>;
  sessionStore: session.SessionStore;
  private userIdCounter: number;
  private fileIdCounter: number;
  private conversionIdCounter: number;
  private presetIdCounter: number;

  constructor() {
    this.users = new Map();
    this.uploadedFiles = new Map();
    this.ttsConversions = new Map();
    this.textPresets = new Map();
    this.userIdCounter = 1;
    this.fileIdCounter = 1;
    this.conversionIdCounter = 1;
    this.presetIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      ...insertUser,
      darkMode: false,
      ttsCredits: 100,
      createdAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // File operations
  async getUploadedFile(id: number): Promise<UploadedFile | undefined> {
    return this.uploadedFiles.get(id);
  }

  async getUploadedFilesByUser(userId: number): Promise<UploadedFile[]> {
    return Array.from(this.uploadedFiles.values()).filter(
      (file) => file.userId === userId,
    );
  }

  async createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile> {
    const id = this.fileIdCounter++;
    const now = new Date();
    const newFile: UploadedFile = {
      id,
      ...file,
      processed: false,
      uploadDate: now,
    };
    this.uploadedFiles.set(id, newFile);
    return newFile;
  }

  async updateUploadedFile(id: number, data: Partial<UploadedFile>): Promise<UploadedFile> {
    const file = await this.getUploadedFile(id);
    if (!file) {
      throw new Error("File not found");
    }
    const updatedFile = { ...file, ...data };
    this.uploadedFiles.set(id, updatedFile);
    return updatedFile;
  }

  async deleteUploadedFile(id: number): Promise<void> {
    this.uploadedFiles.delete(id);
  }

  // TTS Conversion operations
  async getConversion(id: number): Promise<TTSConversion | undefined> {
    return this.ttsConversions.get(id);
  }

  async getConversionsByUser(userId: number): Promise<TTSConversion[]> {
    return Array.from(this.ttsConversions.values()).filter(
      (conversion) => conversion.userId === userId,
    );
  }

  async getConversionsByUserToday(userId: number): Promise<TTSConversion[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.ttsConversions.values()).filter(
      (conversion) => 
        conversion.userId === userId && 
        conversion.createdAt >= today
    );
  }

  async createConversion(conversion: InsertTTSConversion): Promise<TTSConversion> {
    const id = this.conversionIdCounter++;
    const now = new Date();
    const newConversion: TTSConversion = {
      id,
      ...conversion,
      createdAt: now,
    };
    this.ttsConversions.set(id, newConversion);
    return newConversion;
  }

  async deleteConversion(id: number): Promise<void> {
    this.ttsConversions.delete(id);
  }

  // Text Preset operations
  async getPreset(id: number): Promise<TextPreset | undefined> {
    return this.textPresets.get(id);
  }

  async getPresetsByUser(userId: number): Promise<TextPreset[]> {
    return Array.from(this.textPresets.values()).filter(
      (preset) => preset.userId === userId,
    );
  }

  async createPreset(preset: InsertTextPreset): Promise<TextPreset> {
    const id = this.presetIdCounter++;
    const now = new Date();
    const newPreset: TextPreset = {
      id,
      ...preset,
      createdAt: now,
    };
    this.textPresets.set(id, newPreset);
    return newPreset;
  }

  async updatePreset(id: number, data: Partial<TextPreset>): Promise<TextPreset> {
    const preset = await this.getPreset(id);
    if (!preset) {
      throw new Error("Preset not found");
    }
    const updatedPreset = { ...preset, ...data };
    this.textPresets.set(id, updatedPreset);
    return updatedPreset;
  }

  async deletePreset(id: number): Promise<void> {
    this.textPresets.delete(id);
  }
}

export const storage = new MemStorage();
