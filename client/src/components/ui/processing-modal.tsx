import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './dialog'
import { Button } from './button'
import { Progress } from './progress'

interface ProcessingStage {
  id: string
  title: string
  progress: number
  icon: string
}

interface ProcessingModalProps {
  open: boolean
  onCancel: () => void
  onComplete: () => void
}

export function ProcessingModal({ 
  open, 
  onCancel,
  onComplete
}: ProcessingModalProps) {
  const [stages, setStages] = useState<ProcessingStage[]>([
    { id: 'extract', title: 'Extracting Text', progress: 0, icon: 'fa-file-alt' },
    { id: 'prepare', title: 'Preparing Speech', progress: 0, icon: 'fa-language' },
    { id: 'generate', title: 'Generating Audio', progress: 0, icon: 'fa-volume-up' }
  ])
  
  const [currentStage, setCurrentStage] = useState(0)
  const [processing, setProcessing] = useState(true)
  
  // Simulate processing for demo purposes
  useEffect(() => {
    if (!open || !processing) return
    
    const updateProgress = (stageIndex: number, value: number) => {
      setStages(prev => {
        const newStages = [...prev]
        newStages[stageIndex] = { ...newStages[stageIndex], progress: value }
        return newStages
      })
    }
    
    // Stage 1: Extract text
    const timer1 = setTimeout(() => {
      const interval = setInterval(() => {
        updateProgress(0, prev => {
          const newValue = prev + 5
          if (newValue >= 100) {
            clearInterval(interval)
            setCurrentStage(1)
            return 100
          }
          return newValue
        })
      }, 100)
      
      return () => clearInterval(interval)
    }, 500)
    
    // Stage 2: Prepare speech
    const timer2 = setTimeout(() => {
      const interval = setInterval(() => {
        updateProgress(1, prev => {
          const newValue = prev + 8
          if (newValue >= 100) {
            clearInterval(interval)
            setCurrentStage(2)
            return 100
          }
          return newValue
        })
      }, 100)
      
      return () => clearInterval(interval)
    }, 2500)
    
    // Stage 3: Generate audio
    const timer3 = setTimeout(() => {
      const interval = setInterval(() => {
        updateProgress(2, prev => {
          const newValue = prev + 10
          if (newValue >= 100) {
            clearInterval(interval)
            setProcessing(false)
            setTimeout(onComplete, 500)
            return 100
          }
          return newValue
        })
      }, 100)
      
      return () => clearInterval(interval)
    }, 4000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [open, processing, onComplete])
  
  const resetState = () => {
    setStages(stages.map(stage => ({ ...stage, progress: 0 })))
    setCurrentStage(0)
    setProcessing(true)
  }
  
  const handleCancel = () => {
    onCancel()
    setTimeout(resetState, 300) // Reset after dialog closes
  }
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Processing Your File</DialogTitle>
          <DialogDescription>
            This may take a few moments depending on the file size and complexity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 mb-4 space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div className="mr-4 flex-shrink-0">
                <i className={`fas ${stage.icon} text-3xl ${
                  index < currentStage 
                    ? 'text-green-500 dark:text-green-400' 
                    : index === currentStage 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-400 dark:text-gray-500'
                }`}></i>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage.title}</div>
                <div className="mt-1 relative">
                  <Progress value={stage.progress} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={!processing}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
