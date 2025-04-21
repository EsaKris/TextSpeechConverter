import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileDropzone } from '@/components/ui/file-dropzone';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { formatRelativeTime, formatFileSize } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadedFile } from '@shared/schema';

interface FileInputProps {
  onFileAccepted: (file: File) => void;
  selectedFile: File | null;
  extractedText: string;
  isRegistered: boolean;
}

export default function FileInput({
  onFileAccepted,
  selectedFile,
  extractedText,
  isRegistered,
}: FileInputProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Fetch user's files if registered
  const { data: files } = useQuery<UploadedFile[]>({
    queryKey: ['/api/files'],
    enabled: isRegistered,
  });

  return (
    <div>
      {/* File Upload Area */}
      <FileDropzone 
        onFileAccepted={onFileAccepted}
        maxSize={10 * 1024 * 1024} // 10MB
      />
      
      {/* File Type Tabs */}
      <div className="mt-6">
        <div className="hidden sm:block">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent">
              <TabsTrigger
                value="all"
                className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none py-3 px-3"
              >
                <i className="fas fa-th-list mr-2"></i>All Files
              </TabsTrigger>
              <TabsTrigger
                value="pdf"
                className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none py-3 px-3"
              >
                <i className="fas fa-file-pdf mr-2"></i>PDFs
              </TabsTrigger>
              <TabsTrigger
                value="docx"
                className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none py-3 px-3"
              >
                <i className="fas fa-file-word mr-2"></i>Word Docs
              </TabsTrigger>
              <TabsTrigger
                value="img"
                className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none py-3 px-3"
              >
                <i className="fas fa-file-image mr-2"></i>Images
              </TabsTrigger>
              <TabsTrigger
                value="txt"
                className="flex items-center data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none py-3 px-3"
              >
                <i className="fas fa-file-alt mr-2"></i>Text Files
              </TabsTrigger>
            </TabsList>
            
            {/* The tab content isn't used here since we're just filtering the list */}
          </Tabs>
        </div>
        
        {/* Mobile select for file types */}
        <div className="block sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="all">All Files</option>
            <option value="pdf">PDFs</option>
            <option value="docx">Word Documents</option>
            <option value="img">Images</option>
            <option value="txt">Text Files</option>
          </select>
        </div>
      </div>

      {/* Recently Uploaded Files (Registered Users) */}
      {isRegistered && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Files</h3>
          
          {!files || files.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              No recent files. Upload a file to get started.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {files
                .filter(file => activeTab === 'all' || file.fileType.toLowerCase() === activeTab)
                .slice(0, 6)
                .map((file) => (
                  <Card key={file.id} className="bg-gray-50 dark:bg-gray-800 overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
                          <i className={`fas fa-file-${
                            file.fileType === 'PDF' ? 'pdf' : 
                            file.fileType === 'DOCX' ? 'word' : 
                            file.fileType === 'IMG' ? 'image' : 'alt'
                          } text-primary-600 dark:text-primary-400`}></i>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              {file.fileName}
                            </dt>
                            <dd>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeTime(new Date(file.uploadDate))}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="secondary"
                          size="sm"
                          className="mr-2"
                        >
                          <i className="fas fa-redo-alt mr-1"></i> Process
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                        >
                          <i className="fas fa-trash-alt mr-1"></i> Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}
      
      {/* Display extracted text if available */}
      {extractedText && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md">
          <h4 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
            Extracted Text Preview:
          </h4>
          <div className="max-h-32 overflow-y-auto text-sm text-gray-600 dark:text-gray-400">
            {extractedText.length > 500 
              ? `${extractedText.substring(0, 500)}...` 
              : extractedText}
          </div>
        </div>
      )}
    </div>
  );
}
