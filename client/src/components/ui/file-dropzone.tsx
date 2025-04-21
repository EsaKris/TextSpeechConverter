import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn, isValidFileType, formatFileSize } from '@/lib/utils'
import { Button } from './button'
import { Alert, AlertDescription } from './alert'
import { X } from 'lucide-react'

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void
  maxSize?: number // in bytes
}

export function FileDropzone({ 
  onFileAccepted, 
  maxSize = 10 * 1024 * 1024 // 10MB default
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Reset error state
      setError(null)
      
      // Check if any files were dropped
      if (acceptedFiles.length === 0) {
        return
      }
      
      const file = acceptedFiles[0]
      
      // Check file size
      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}.`)
        return
      }
      
      // Check file type
      if (!isValidFileType(file)) {
        setError('Unsupported file type. Please upload PDF, DOCX, JPG, PNG, or TXT.')
        return
      }
      
      // Set the selected file and call the callback
      setSelectedFile(file)
      onFileAccepted(file)
    },
    [onFileAccepted, maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt']
    }
  })

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md",
            "border-gray-300 dark:border-gray-700",
            isDragActive ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500",
            "cursor-pointer transition-colors"
          )}
        >
          <div className="space-y-1 text-center">
            <i className="fas fa-cloud-upload-alt mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 text-3xl flex items-center justify-center"></i>
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500">
                <span>Upload a file</span>
                <input {...getInputProps()} className="sr-only" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, DOCX, PNG, JPG or TXT up to {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-2">
              <i className={`fas ${getFileIcon(selectedFile)} text-primary-600 dark:text-primary-400`}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={removeFile}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function getFileIcon(file: File): string {
  const type = file.type
  if (type.includes('pdf')) return 'fa-file-pdf'
  if (type.includes('word')) return 'fa-file-word'
  if (type.includes('image')) return 'fa-file-image'
  if (type.includes('text')) return 'fa-file-alt'
  return 'fa-file'
}
