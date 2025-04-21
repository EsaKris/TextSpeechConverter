import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SignupPromptProps {
  open: boolean;
  onClose: () => void;
}

export default function SignupPrompt({ open, onClose }: SignupPromptProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            You've reached your daily limit
          </AlertDialogTitle>
          <AlertDialogDescription className="py-4">
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Free accounts are limited to 3 conversions per day. Sign up for an account to enjoy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><span className="font-medium">Unlimited conversions</span> - Convert as many documents as you need</li>
                <li><span className="font-medium">Advanced OCR settings</span> - Fine-tune text extraction for better results</li>
                <li><span className="font-medium">Personal history</span> - Save and access all your previous conversions</li>
                <li><span className="font-medium">Custom voices</span> - Access more voice options and language settings</li>
                <li><span className="font-medium">Text presets</span> - Save frequently used text snippets</li>
              </ul>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg mt-4">
                <p className="text-primary-800 dark:text-primary-300 font-medium">
                  Create an account in less than a minute to continue using VoiceDoc today!
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction>
            <Link href="/auth" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium">
              Create Account
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}