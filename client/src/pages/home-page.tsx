import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import FileInput from "@/components/conversion/file-input";
import TextInput from "@/components/conversion/text-input";
import OcrSettings from "@/components/conversion/ocr-settings";
import VoiceSettings from "@/components/conversion/voice-settings";
import ResultPanel from "@/components/conversion/result-panel";
import SignupPrompt from "@/components/conversion/signup-prompt";
import { Button } from "@/components/ui/button";
import { ProcessingModal } from "@/components/ui/processing-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceSettings as VoiceSettingsType, OCRSettings } from "@shared/schema";
import { Link } from "wouter";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [language, setLanguage] = useState("en");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>({
    speed: 1.0,
    pitch: 0.5,
    voiceType: "male1"
  });
  const [ocrSettings, setOcrSettings] = useState<OCRSettings>({
    mode: 3,
    engine: 3,
    language: "eng"
  });
  const [conversionResult, setConversionResult] = useState<{
    id: number;
    textContent: string;
    audioUrl: string;
  } | null>(null);

  // Get conversion count for guests
  const { data: conversionData } = useQuery({
    queryKey: ["/api/conversions/count"],
    enabled: !user,
  });

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      // Add OCR settings for image files
      if (file.type.startsWith("image/")) {
        formData.append("ocrSettings", JSON.stringify(ocrSettings));
      }
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setFileId(data.id);
      setExtractedText(data.extractedText);
      toast({
        title: "File uploaded successfully",
        description: "The text has been extracted and is ready for conversion.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Text to speech conversion mutation
  const convertMutation = useMutation({
    mutationFn: async (data: {
      text: string;
      fileId?: number | null;
      voiceSettings: VoiceSettingsType;
      language: string;
    }) => {
      const response = await apiRequest("POST", "/api/convert", data);
      return response.json();
    },
    onSuccess: (data) => {
      setConversionResult(data);
      toast({
        title: "Conversion successful",
        description: "Your text has been converted to speech.",
      });
    },
    onError: (error) => {
      toast({
        title: "Conversion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileAccepted = (file: File) => {
    setSelectedFile(file);
    setConversionResult(null);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    setConversionResult(null);
  };

  const handleConvert = async () => {
    // Check if there's content to convert
    const textToConvert = activeTab === "file" ? extractedText : text;
    
    if (!textToConvert.trim()) {
      toast({
        title: "No content to convert",
        description: activeTab === "file" 
          ? "Please upload a file first" 
          : "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }
    
    // Check if guest user has reached their limit
    if (!user && conversionData && conversionData.count >= conversionData.limit) {
      setShowSignupPrompt(true);
      return;
    }
    
    // For file uploads, first process the file if needed
    if (activeTab === "file" && selectedFile && !extractedText) {
      setIsProcessing(true);
      await uploadMutation.mutateAsync(selectedFile);
      return; // Will continue after upload completes
    }
    
    // Convert text to speech
    setIsProcessing(true);
    await convertMutation.mutateAsync({
      text: textToConvert,
      fileId: activeTab === "file" ? fileId : null,
      voiceSettings,
      language,
    });
    setIsProcessing(false);
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Conversion Panel */}
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="md:flex md:items-start md:justify-between p-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Text to Speech Conversion
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Upload a file or enter text to convert to speech
              </p>
            </div>
            
            {/* Language Selection */}
            <div className="mt-4 md:mt-0 md:ml-6">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Output Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
                <option value="ru">Russian</option>
                <option value="ar">Arabic</option>
                <option value="hi">Hindi</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
          </div>

          {/* Input Method Tabs */}
          <Tabs 
            defaultValue="file" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "file" | "text")}
            className="w-full"
          >
            <TabsList className="w-full rounded-none border-b border-gray-200 dark:border-gray-700">
              <TabsTrigger value="file" className="flex-1 py-3">
                <i className="fas fa-file-upload mr-2"></i>Upload File
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1 py-3">
                <i className="fas fa-keyboard mr-2"></i>Enter Text
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="p-6">
              <FileInput 
                onFileAccepted={handleFileAccepted} 
                selectedFile={selectedFile}
                extractedText={extractedText}
                isRegistered={!!user}
              />
            </TabsContent>
            
            <TabsContent value="text" className="p-6">
              <TextInput 
                text={text} 
                onTextChange={handleTextChange}
                isRegistered={!!user}
              />
            </TabsContent>
          </Tabs>

          {/* OCR Settings Section (registered users only) */}
          {user && activeTab === "file" && (
            <OcrSettings 
              settings={ocrSettings}
              onSettingsChange={setOcrSettings}
            />
          )}

          {/* Voice Settings Section */}
          <VoiceSettings 
            settings={voiceSettings}
            onSettingsChange={setVoiceSettings}
            isRegistered={!!user}
          />

          {/* Action Buttons */}
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 flex justify-between rounded-b-lg">
            {user ? (
              <Button variant="outline">
                <i className="fas fa-cog mr-2"></i> Save Settings
              </Button>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">
                  {conversionData ? `${conversionData.count}/${conversionData.limit}` : "0/3"}
                </span> conversions today
              </div>
            )}
            
            <Button 
              onClick={handleConvert} 
              disabled={isProcessing || (activeTab === "file" && !selectedFile && !extractedText) || (activeTab === "text" && !text.trim())}
            >
              <i className="fas fa-microphone-alt mr-2"></i> Convert to Speech
            </Button>
          </div>
        </div>
      </div>

      {/* Result Panel */}
      <ResultPanel 
        extractedText={activeTab === "file" ? extractedText : text}
        conversionResult={conversionResult}
        isGuest={!user}
      />

      {/* Processing Modal */}
      <ProcessingModal 
        open={isProcessing} 
        onCancel={() => setIsProcessing(false)}
        onComplete={() => setIsProcessing(false)}
      />

      {/* Signup Prompt Modal */}
      <SignupPrompt
        open={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
      />
    </main>
  );
}
