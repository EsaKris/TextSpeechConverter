import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, updateUserSettings } = useAuth();
  const [darkMode, setDarkMode] = useState(user?.darkMode || false);

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateUserSettings.mutate({ darkMode: newDarkMode });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Account Settings
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Account Information */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-3xl">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Account ID: #{user.id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="darkMode" className="text-base">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable dark theme for the application
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      TTS Credits
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your remaining conversion credits
                    </p>
                  </div>
                  <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {user.ttsCredits}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences and Settings */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Conversion Preferences</CardTitle>
              <CardDescription>
                Default settings for all your text-to-speech conversions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default Language */}
              <div>
                <Label htmlFor="defaultLanguage" className="text-base">
                  Default Language
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Select your preferred output language
                </p>
                <select
                  id="defaultLanguage"
                  className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>

              {/* Default Voice Settings */}
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Default Voice Settings
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="defaultSpeed" className="text-sm">
                      Speech Speed
                    </Label>
                    <div className="mt-1 flex items-center">
                      <i className="fas fa-walking text-gray-500 dark:text-gray-400 w-5"></i>
                      <input
                        type="range"
                        id="defaultSpeed"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        defaultValue="1.0"
                        className="mx-2 flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <i className="fas fa-running text-gray-500 dark:text-gray-400 w-5"></i>
                      <span className="ml-2 w-10 text-sm text-gray-700 dark:text-gray-300">
                        1.0x
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="defaultPitch" className="text-sm">
                      Voice Pitch
                    </Label>
                    <div className="mt-1 flex items-center">
                      <i className="fas fa-arrow-down text-gray-500 dark:text-gray-400 w-5"></i>
                      <input
                        type="range"
                        id="defaultPitch"
                        min="0.1"
                        max="0.9"
                        step="0.1"
                        defaultValue="0.5"
                        className="mx-2 flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <i className="fas fa-arrow-up text-gray-500 dark:text-gray-400 w-5"></i>
                      <span className="ml-2 w-10 text-sm text-gray-700 dark:text-gray-300">
                        0.5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OCR Default Settings */}
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  OCR Default Settings
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="ocrMode" className="text-sm">
                      OCR Mode
                    </Label>
                    <select
                      id="ocrMode"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="3">Auto (Default)</option>
                      <option value="6">Sparse Text</option>
                      <option value="11">Raw Line</option>
                      <option value="13">Raw Words</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="ocrEngine" className="text-sm">
                      OCR Engine
                    </Label>
                    <select
                      id="ocrEngine"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="3">Default</option>
                      <option value="0">Legacy Engine</option>
                      <option value="1">Neural Net LSTM</option>
                      <option value="2">LSTM + Legacy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Security and Privacy</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <input
                        type="password"
                        id="newPassword"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                    Data Management
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Save Conversion History
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Keep a record of all your conversions
                        </p>
                      </div>
                      <Switch defaultChecked id="save-history" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Auto-Delete Files
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Remove uploaded files after 30 days
                        </p>
                      </div>
                      <Switch id="auto-delete" />
                    </div>

                    <div className="pt-2">
                      <Button variant="destructive">
                        <i className="fas fa-trash-alt mr-2"></i> Delete All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
