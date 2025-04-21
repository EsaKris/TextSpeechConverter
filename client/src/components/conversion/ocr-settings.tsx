import { useState } from 'react';
import { OCRSettings } from '@shared/schema';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface OCRSettingsProps {
  settings: OCRSettings;
  onSettingsChange: (settings: OCRSettings) => void;
}

export default function OcrSettings({ settings, onSettingsChange }: OCRSettingsProps) {
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleModeChange = (value: string) => {
    onSettingsChange({
      ...settings,
      mode: parseInt(value, 10),
    });
  };

  const handleEngineChange = (value: string) => {
    onSettingsChange({
      ...settings,
      engine: parseInt(value, 10),
    });
  };

  const handleLanguageChange = (value: string) => {
    onSettingsChange({
      ...settings,
      language: value,
    });
  };

  const toggleAdvanced = () => {
    setIsAdvanced(!isAdvanced);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">OCR Settings</h3>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Basic</span>
          <Switch 
            checked={isAdvanced}
            onCheckedChange={toggleAdvanced}
            id="ocrAdvancedToggle"
          />
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Advanced</span>
        </div>
      </div>
      
      {isAdvanced && (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="ocrMode">OCR Mode</Label>
              <Select 
                value={settings.mode.toString()} 
                onValueChange={handleModeChange}
              >
                <SelectTrigger id="ocrMode" className="mt-1 w-full">
                  <SelectValue placeholder="Select OCR mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Auto (Default)</SelectItem>
                  <SelectItem value="6">Sparse Text</SelectItem>
                  <SelectItem value="11">Raw Line</SelectItem>
                  <SelectItem value="13">Raw Words</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="ocrEngine">OCR Engine</Label>
              <Select 
                value={settings.engine.toString()} 
                onValueChange={handleEngineChange}
              >
                <SelectTrigger id="ocrEngine" className="mt-1 w-full">
                  <SelectValue placeholder="Select OCR engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Default</SelectItem>
                  <SelectItem value="0">Legacy Engine</SelectItem>
                  <SelectItem value="1">Neural Net LSTM</SelectItem>
                  <SelectItem value="2">LSTM + Legacy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="ocrLanguage">OCR Language</Label>
            <Select 
              value={settings.language} 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger id="ocrLanguage" className="mt-1 w-full">
                <SelectValue placeholder="Select OCR language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eng">English</SelectItem>
                <SelectItem value="fra">French</SelectItem>
                <SelectItem value="deu">German</SelectItem>
                <SelectItem value="spa">Spanish</SelectItem>
                <SelectItem value="ita">Italian</SelectItem>
                <SelectItem value="jpn">Japanese</SelectItem>
                <SelectItem value="kor">Korean</SelectItem>
                <SelectItem value="chi_sim">Chinese (Simplified)</SelectItem>
                <SelectItem value="chi_tra">Chinese (Traditional)</SelectItem>
                <SelectItem value="rus">Russian</SelectItem>
                <SelectItem value="ara">Arabic</SelectItem>
                <SelectItem value="hin">Hindi</SelectItem>
                <SelectItem value="por">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
