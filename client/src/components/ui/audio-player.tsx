import { useState, useRef, useEffect } from 'react'
import { formatDuration } from '@/lib/utils'
import { Slider } from './slider'
import { Button } from './button'
import { Volume2, Download, Save, Play, Pause } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface AudioPlayerProps {
  audioUrl: string
  audioName: string
  isWatermarked?: boolean
}

export function AudioPlayer({ 
  audioUrl, 
  audioName,
  isWatermarked = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { user } = useAuth()

  // Set up audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const setAudioEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    // Events
    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('ended', setAudioEnded)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('ended', setAudioEnded)
    }
  }, [audioUrl])

  // Play/pause
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Update time on slider change
  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  // Update volume
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    audio.volume = newVolume
    setVolume(newVolume)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center">
        <Button 
          onClick={togglePlay} 
          size="icon" 
          variant="default"
          className="bg-primary-600 text-white rounded-full p-3 shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 h-10 w-10"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="audio-wave mr-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block w-[3px] rounded-sm ${
                      isPlaying ? 'bg-primary-600 dark:bg-primary-400' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{
                      animation: isPlaying ? `wave 1s infinite ease-in-out ${i * 0.1}s` : 'none',
                      height: '15px'
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{audioName}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDuration(currentTime * 1000)} / {formatDuration(duration * 1000)}
            </span>
          </div>
          
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.01}
            onValueChange={handleTimeChange}
            className="my-2"
          />
        </div>
        
        <div className="ml-4 flex space-x-2">
          <div className="relative group">
            <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
              <Volume2 className="h-4 w-4" />
            </Button>
            <div className="absolute right-0 hidden group-hover:block bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg z-10">
              <Slider
                orientation="vertical"
                value={[volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="h-24"
              />
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            asChild
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <a href={audioUrl} download={audioName}>
              <Download className="h-4 w-4" />
            </a>
          </Button>
          
          {user && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {isWatermarked && (
        <div className="mt-4 flex items-center text-sm text-amber-600 dark:text-amber-500">
          <i className="fas fa-info-circle mr-2"></i>
          <span>
            This audio contains a watermark. <a href="/auth" className="font-medium underline">Create an account</a> to remove watermarks.
          </span>
        </div>
      )}
      
      <style jsx>{`
        @keyframes wave {
          0%, 100% { height: 5px; }
          50% { height: 15px; }
        }
      `}</style>
    </div>
  )
}
