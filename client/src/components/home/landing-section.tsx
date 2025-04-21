import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function LandingSection() {
  const { user } = useAuth();
  
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 rounded-xl mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                Transform Text to Speech
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-gray-900 dark:text-white">Convert Documents</span>
                <span className="block text-primary-600 dark:text-primary-400">to Natural Speech</span>
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              VoiceDoc transforms any text, document, or image into realistic speech in over 100 languages.
              Perfect for language learning, accessibility, content creation, or multitasking.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                {!user && (
                  <Button 
                    size="lg" 
                    className="px-8 py-3 text-base"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Create Free Account
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-base"
                  onClick={() => {
                    const convertSection = document.getElementById('convert-section');
                    if (convertSection) {
                      convertSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {user ? 'Start Converting' : 'Try for Free'}
                </Button>
              </div>
              {!user && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  No credit card required. Get 3 free conversions today.
                </p>
              )}
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="py-12 px-8 text-center">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mb-3">
                        <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Multiple Formats</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">PDF, DOCX, Images, Text</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mb-3">
                        <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">100+ Languages</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Global language support</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mb-3">
                        <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Natural Speech</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">High-quality voices</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mb-3">
                        <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced OCR</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Extract text from images</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}