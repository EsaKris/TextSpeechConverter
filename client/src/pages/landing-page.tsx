import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  FileText, 
  Headphones, 
  Upload, 
  VolumeX, 
  Volume2, 
  ArrowRight, 
  LibraryBig,
  FastForward,
  Languages,
  Sparkles,
  Accessibility,
  GraduationCap,
  Check
} from "lucide-react";

export default function LandingPage() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  // If user is already logged in, redirect to convert page
  useEffect(() => {
    if (user) {
      setLocation("/convert");
    }
  }, [user, setLocation]);

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Multiple Format Support",
      description: "Upload PDF documents, DOCX files, images with text, or directly paste your content.",
    },
    {
      icon: <Languages className="h-8 w-8 text-primary" />,
      title: "Advanced OCR Technology",
      description: "Extract text from images and documents in multiple languages with high accuracy.",
    },
    {
      icon: <Volume2 className="h-8 w-8 text-primary" />,
      title: "Natural Sounding Voices",
      description: "Convert text to speech with realistic voice options and customizable settings.",
    },
    {
      icon: <FastForward className="h-8 w-8 text-primary" />,
      title: "Adjustable Speed & Pitch",
      description: "Customize playback speed and voice pitch to suit your personal preferences.",
    },
    {
      icon: <LibraryBig className="h-8 w-8 text-primary" />,
      title: "Conversion History",
      description: "Access your previous conversions and reuse them anytime (for registered users).",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Text Presets & Templates",
      description: "Save and manage frequently used text snippets for quick conversion.",
    },
  ];

  const useCases = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Education & Learning",
      description: "Perfect for students who prefer auditory learning or need assistance with reading difficulties.",
    },
    {
      icon: <Accessibility className="h-8 w-8 text-primary" />,
      title: "Accessibility",
      description: "Makes content accessible to those with visual impairments or reading disabilities.",
    },
    {
      icon: <Headphones className="h-8 w-8 text-primary" />,
      title: "Language Learning",
      description: "Practice pronunciation and listening skills by converting foreign language texts to speech.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header landingMode={true} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pattern-dots-lg dark:opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Transform <span className="text-primary">Text</span> into
                  <br /> Natural <span className="text-primary">Speech</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                  Convert documents, images, and text into high-quality audio with our powerful text-to-speech technology.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/convert">
                      Try for Free <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth">Sign Up</Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No credit card required. 3 free conversions for guests.
                </p>
              </div>
              
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="text-gray-400 text-xs ml-2">Document Converter</div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                      <Upload className="h-6 w-6 text-primary" />
                      <span className="text-gray-700 dark:text-gray-300">Upload your document or image</span>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-700 dark:text-gray-300 font-mono text-sm mb-2">Extracted Text:</p>
                      <div className="border-l-4 border-primary pl-3">
                        <p className="text-gray-700 dark:text-gray-300">
                          The quick brown fox jumps over the lazy dog. Voice conversion technology makes it possible to transform any text into natural sounding speech within seconds.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                      <div className="flex-grow">
                        <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-3/5 rounded-full"></div>
                        </div>
                      </div>
                      <VolumeX className="h-5 w-5 text-gray-500" />
                      <Volume2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 h-24 w-24 bg-primary opacity-20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-primary opacity-10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our text-to-speech converter provides everything you need to transform your documents into high-quality audio files.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Use Cases Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Use Cases
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover how our text-to-speech technology can benefit you in various scenarios.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Simple Pricing
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Choose the plan that works best for your needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Free
                  </h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">$0</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Try our basic features without an account
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">3 conversions per day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">Standard OCR capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">Basic voice customization</span>
                    </li>
                    <li className="flex items-start gap-2 opacity-50">
                      <Check className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-gray-500 dark:text-gray-500">No conversion history</span>
                    </li>
                    <li className="flex items-start gap-2 opacity-50">
                      <Check className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-gray-500 dark:text-gray-500">No text presets</span>
                    </li>
                  </ul>
                  <Button asChild className="mt-6 w-full" variant="outline">
                    <Link href="/convert">
                      Try for Free
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-primary shadow-lg relative">
                <div className="absolute -top-3 right-4 bg-primary text-white text-xs font-semibold py-1 px-3 rounded-full uppercase">
                  Recommended
                </div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Premium
                  </h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">$9.99</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Everything you need for regular usage
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">Unlimited conversions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">Advanced OCR with multiple languages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">Premium voice selection & settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">Conversion history & management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">Save & manage text presets</span>
                    </li>
                  </ul>
                  <Button asChild className="mt-6 w-full">
                    <Link href="/auth">
                      Sign Up Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Try our document-to-speech converter today and experience the difference.
              No credit card required for the free plan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/convert">
                  Try for Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth">Sign Up</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}