import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { countWords } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
  isRegistered: boolean;
}

interface TextPreset {
  id: number;
  name: string;
  content: string;
  createdAt: string;
}

export default function TextInput({
  text,
  onTextChange,
  isRegistered,
}: TextInputProps) {
  const { toast } = useToast();
  const [presetName, setPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Fetch presets if user is registered
  const { data: presets } = useQuery<TextPreset[]>({
    queryKey: ['/api/presets'],
    enabled: isRegistered,
  });

  // Save preset mutation
  const savePresetMutation = useMutation({
    mutationFn: async (data: { name: string; content: string }) => {
      const response = await apiRequest('POST', '/api/presets', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/presets'] });
      setPresetName('');
      setShowSaveForm(false);
      toast({
        title: 'Preset saved',
        description: 'Your text preset has been saved successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to save preset',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your preset',
        variant: 'destructive',
      });
      return;
    }

    if (!text.trim()) {
      toast({
        title: 'Text required',
        description: 'Please enter some text to save as a preset',
        variant: 'destructive',
      });
      return;
    }

    savePresetMutation.mutate({
      name: presetName,
      content: text,
    });
  };

  const handleLoadPreset = (preset: TextPreset) => {
    onTextChange(preset.content);
    toast({
      title: 'Preset loaded',
      description: `"${preset.name}" has been loaded`,
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter text to convert
        </label>
        <div className="mt-1">
          <Textarea
            id="text-input"
            name="text-input"
            rows={6}
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={handleTextChange}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span id="characterCount">{text.length}</span> characters (<span id="wordCount">{countWords(text)}</span> words)
        </p>
      </div>
      
      {/* Text Presets for Registered Users */}
      {isRegistered && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Presets</h3>
            
            {!showSaveForm ? (
              <Button 
                onClick={() => setShowSaveForm(true)}
                size="sm"
              >
                <i className="fas fa-plus mr-1"></i> Save Current
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button 
                  onClick={handleSavePreset}
                  size="sm"
                  disabled={savePresetMutation.isPending}
                >
                  Save
                </Button>
                <Button 
                  onClick={() => setShowSaveForm(false)}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          {!presets || presets.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              No saved presets. Save a text preset to quickly access it later.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {preset.content}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
