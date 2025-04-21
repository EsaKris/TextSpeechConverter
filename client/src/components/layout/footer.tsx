import { Link } from "wouter";
import { ChevronRight, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">SpeechifyDocs</h3>
            <p className="text-gray-300 mb-4">
              Transform text from any document into natural speech with our advanced conversion technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/convert" className="text-gray-300 hover:text-white flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Try Converter
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-300 hover:text-white flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 hover:text-white flex items-center">
                <ChevronRight size={16} className="mr-1" />
                Document to Speech
              </li>
              <li className="text-gray-300 hover:text-white flex items-center">
                <ChevronRight size={16} className="mr-1" />
                OCR Technology
              </li>
              <li className="text-gray-300 hover:text-white flex items-center">
                <ChevronRight size={16} className="mr-1" />
                Multiple Languages
              </li>
              <li className="text-gray-300 hover:text-white flex items-center">
                <ChevronRight size={16} className="mr-1" />
                Voice Customization
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 flex items-center">
                <Mail size={16} className="mr-2" />
                info@speechifydocs.com
              </li>
              <li className="text-gray-300 flex items-center">
                <Phone size={16} className="mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="text-gray-300 flex items-center">
                <MapPin size={16} className="mr-2" />
                123 Tech Avenue, San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SpeechifyDocs. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}