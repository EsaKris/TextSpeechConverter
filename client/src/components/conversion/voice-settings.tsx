import { useState, useEffect } from 'react';
import { VoiceSettings as VoiceSettingsType } from '@shared/schema';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

interface VoiceSettingsProps {
  settings: VoiceSettingsType;
  onSettingsChange: (settings: VoiceSettingsType) => void;
  isRegistered: boolean;
}

export default function VoiceSettings({
  settings,
  onSettingsChange,
  isRegistered,
}: VoiceSettingsProps) {
  const [speed, setSpeed] = useState(settings.speed);
  const [pitch, setPitch] = useState(settings.pitch);
  const [voiceType, setVoiceType] = useState(settings.voiceType);

  // Update parent component when settings change
  useEffect(() => {
    onSettingsChange({
      speed,
      pitch,
      voiceType,
    });
  }, [speed, pitch, voiceType, onSettingsChange]);

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const handlePitchChange = (value: number[]) => {
    setPitch(value[0]);
  };

  const handleVoiceTypeChange = (value: string) => {
    setVoiceType(value as "male1" | "female1" | "male2" | "female2");
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Voice Settings</h3>
      
      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="speed" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Speed
          </Label>
          <div className="mt-1 flex items-center">
            <i className="fas fa-walking text-gray-500 dark:text-gray-400 w-5"></i>
            <Slider
              id="speed"
              min={0.5}
              max={1.5}
              step={0.1}
              value={[speed]}
              onValueChange={handleSpeedChange}
              className="mx-2 flex-1"
            />
            <i className="fas fa-running text-gray-500 dark:text-gray-400 w-5"></i>
            <span className="ml-2 w-10 text-sm text-gray-700 dark:text-gray-300">
              {speed.toFixed(1)}x
            </span>
          </div>
        </div>
        
        <div>
          <Label htmlFor="pitch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pitch
          </Label>
          <div className="mt-1 flex items-center">
            <i className="fas fa-arrow-down text-gray-500 dark:text-gray-400 w-5"></i>
            <Slider
              id="pitch"
              min={0.1}
              max={0.9}
              step={0.1}
              value={[pitch]}
              onValueChange={handlePitchChange}
              className="mx-2 flex-1"
            />
            <i className="fas fa-arrow-up text-gray-500 dark:text-gray-400 w-5"></i>
            <span className="ml-2 w-10 text-sm text-gray-700 dark:text-gray-300">
              {pitch.toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* Voice Type Selector (registered users only) */}
        {isRegistered && (
          <div className="sm:col-span-2">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Voice Type
            </Label>
            <RadioGroup
              value={voiceType}
              onValueChange={handleVoiceTypeChange}
              className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <div className="relative flex cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 shadow-sm focus:outline-none">
                <RadioGroupItem
                  value="male1"
                  id="voice-type-0"
                  className="sr-only"
                />
                <Label
                  htmlFor="voice-type-0"
                  className="flex flex-1 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      Male (Default)
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <i className="fas fa-mars mr-1.5 text-primary-500"></i>
                      Standard
                    </span>
                  </div>
                </Label>
                {voiceType === 'male1' && (
                  <i className="fas fa-check-circle text-primary-600 absolute top-3 right-3 h-5 w-5"></i>
                )}
              </div>
              
              <div className="relative flex cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 shadow-sm focus:outline-none">
                <RadioGroupItem
                  value="female1"
                  id="voice-type-1"
                  className="sr-only"
                />
                <Label
                  htmlFor="voice-type-1"
                  className="flex flex-1 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      Female
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <i className="fas fa-venus mr-1.5 text-pink-500"></i>
                      Standard
                    </span>
                  </div>
                </Label>
                {voiceType === 'female1' && (
                  <i className="fas fa-check-circle text-primary-600 absolute top-3 right-3 h-5 w-5"></i>
                )}
              </div>
              
              <div className="relative flex cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 shadow-sm focus:outline-none">
                <RadioGroupItem
                  value="male2"
                  id="voice-type-2"
                  className="sr-only"
                />
                <Label
                  htmlFor="voice-type-2"
                  className="flex flex-1 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      Male Alt
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <i className="fas fa-mars mr-1.5 text-primary-500"></i>
                      Premium
                    </span>
                  </div>
                </Label>
                {voiceType === 'male2' && (
                  <i className="fas fa-check-circle text-primary-600 absolute top-3 right-3 h-5 w-5"></i>
                )}
              </div>
              
              <div className="relative flex cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 shadow-sm focus:outline-none">
                <RadioGroupItem
                  value="female2"
                  id="voice-type-3"
                  className="sr-only"
                />
                <Label
                  htmlFor="voice-type-3"
                  className="flex flex-1 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      Female Alt
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <i className="fas fa-venus mr-1.5 text-pink-500"></i>
                      Premium
                    </span>
                  </div>
                </Label>
                {voiceType === 'female2' && (
                  <i className="fas fa-check-circle text-primary-600 absolute top-3 right-3 h-5 w-5"></i>
                )}
              </div>
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
}
