import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioPlayer } from '@/components/ui/audio-player';

interface ResultPanelProps {
  extractedText: string;
  conversionResult: {
    id: number;
    textContent: string;
    audioUrl: string;
  } | null;
  isGuest: boolean;
}

export default function ResultPanel({
  extractedText,
  conversionResult,
  isGuest,
}: ResultPanelProps) {
  const [audioFileName, setAudioFileName] = useState('audio-output.mp3');
  
  // Generate a better file name based on text content
  useEffect(() => {
    if (conversionResult?.textContent) {
      // Create a file name from the first few words
      const words = conversionResult.textContent.split(' ').slice(0, 3).join('-');
      const sanitizedName = words.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
      setAudioFileName(`${sanitizedName}.mp3`);
    }
  }, [conversionResult]);

  return (
    <div className="mt-8 px-4 py-6 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Conversion Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Processing Result */}
          <div className="mt-2">
            <div className="p-5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md font-mono text-sm text-gray-700 dark:text-gray-300 h-48 overflow-y-auto">
              {!extractedText && !conversionResult ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    <i className="fas fa-file-audio text-4xl mb-3"></i><br />
                    Your processed text will appear here
                  </p>
                </div>
              ) : (
                <div>
                  {(extractedText || conversionResult?.textContent).split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Audio Player Section */}
          <div className="mt-6">
            {!conversionResult ? (
              <div className="flex items-center justify-center h-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  <i className="fas fa-headphones text-2xl mb-2"></i><br />
                  Audio will be available here after conversion
                </p>
              </div>
            ) : (
              <AudioPlayer 
                audioUrl={conversionResult.audioUrl} 
                audioName={audioFileName}
                isWatermarked={isGuest}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
