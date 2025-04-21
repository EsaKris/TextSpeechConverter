import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import FileInput from "@/components/conversion/file-input";
import TextInput from "@/components/conversion/text-input";
import VoiceSettings from "@/components/conversion/voice-settings";
import ResultPanel from "@/components/conversion/result-panel";
import SignupPrompt from "@/components/conversion/signup-prompt";
import OcrSettings from "@/components/conversion/ocr-settings";

// Define OCR settings type
interface OCRSettings {
  mode: number;
  engine: number;
  language: string;
}

// Define voice settings type
interface VoiceSettingsType {
  speed: number;
  pitch: number;
  voiceType: string;
}

export default function ConvertPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  
  // Get conversion count for guests
  const { data: conversionData } = useQuery({
    queryKey: ["/api/conversions/count"],
    enabled: !user,
  });
  
  // Default OCR settings
  const [ocrSettings, setOcrSettings] = useState<OCRSettings>({
    mode: 3,
    engine: 3,
    language: "eng",
  });

  // Default voice settings
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>({
    speed: 1.0,
    pitch: 0.5,
    voiceType: "male1",
  });

  // Conversion result
  const [conversionResult, setConversionResult] = useState<{
    id: number;
    textContent: string;
    audioUrl: string;
  } | null>(null);

  const fileUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ocrSettings", JSON.stringify(ocrSettings));
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload file");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      setExtractedText(data.extractedText);
      toast({
        title: "File uploaded",
        description: "Text extracted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const convertToSpeechMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest("POST", "/api/convert", {
        text,
        voiceSettings,
        sourceFileId: selectedFile ? fileUploadMutation.data?.fileId : null,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to convert to speech");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      setConversionResult({
        id: data.id,
        textContent: data.textContent,
        audioUrl: data.audioUrl,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/conversions/count"] });
      
      toast({
        title: "Conversion complete",
        description: "Text has been converted to speech",
      });
    },
    onError: (error: Error) => {
      if (error.message === "Free conversion limit reached") {
        setShowSignupPrompt(true);
      } else {
        toast({
          title: "Conversion failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleFileAccepted = (file: File) => {
    setSelectedFile(file);
    setExtractedText("");
    setConversionResult(null);
    fileUploadMutation.mutate(file);
  };

  const handleTextChange = (text: string) => {
    setExtractedText(text);
  };

  const handleConvertClick = () => {
    if (!extractedText.trim()) {
      toast({
        title: "No text to convert",
        description: "Please upload a file or enter text",
        variant: "destructive",
      });
      return;
    }
    
    convertToSpeechMutation.mutate(extractedText);
  };

  const isLoading = fileUploadMutation.isPending || convertToSpeechMutation.isPending;
  const isConversionLimitReached = !user && conversionData && conversionData.count >= conversionData.limit;
  const canConvert = extractedText.trim().length > 0 && !isLoading && !isConversionLimitReached;

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Document to Speech Converter</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="file" className="mb-6">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger 
                      value="file" 
                      onClick={() => setIsTextInput(false)}
                    >
                      File Input
                    </TabsTrigger>
                    <TabsTrigger 
                      value="text" 
                      onClick={() => setIsTextInput(true)}
                    >
                      Text Input
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file" className="pt-4">
                    <FileInput 
                      onFileAccepted={handleFileAccepted}
                      selectedFile={selectedFile}
                      extractedText={extractedText}
                      isRegistered={!!user}
                    />
                    
                    {selectedFile && !extractedText && !isLoading && (
                      <div className="mt-4">
                        <OcrSettings 
                          settings={ocrSettings} 
                          onSettingsChange={setOcrSettings} 
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="text" className="pt-4">
                    <TextInput 
                      text={extractedText} 
                      onTextChange={handleTextChange}
                      isRegistered={!!user}
                    />
                  </TabsContent>
                </Tabs>
                
                {extractedText && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Customize Voice</h3>
                    <VoiceSettings 
                      settings={voiceSettings} 
                      onSettingsChange={setVoiceSettings}
                      isRegistered={!!user}
                    />
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={handleConvertClick} 
                        disabled={!canConvert}
                        size="lg"
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Convert to Speech
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <ResultPanel 
                  extractedText={extractedText}
                  conversionResult={conversionResult}
                  isGuest={!user}
                />
                
                {!user && conversionData && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Free account: <span className="font-bold">{conversionData.count}/{conversionData.limit}</span> conversions today
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => window.location.href = "/auth?register=true"}
                    >
                      Upgrade for unlimited access
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <SignupPrompt 
        open={showSignupPrompt} 
        onClose={() => setShowSignupPrompt(false)} 
      />
    </div>
  );
}