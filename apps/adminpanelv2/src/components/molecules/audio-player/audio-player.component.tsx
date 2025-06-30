import { PauseIcon, PlayIcon, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function AudioPlayer(props: {
  src: string;
  name?: string;
  onDelete?: () => void;
}) {
  const { src, name, onDelete } = props;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const progress = useMemo(() => {
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  const onPlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      if (!audio) return;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      const handleEnded = () => {
        setIsPlaying(false);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  return (
    <div className="flex items-center justify-between   flex-col p-5 w-full bg-input/0 border border-input rounded-lg text-white">
      <div className="flex items-center justify-between w-full relative">
        <div className="flex items-center">
          <div className="flex space-x-3 p-2">
            <button
              title="Previous"
              className="focus:outline-none cursor-pointer hidden"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            <button
              title="Play"
              className="rounded-full w-10 h-10 flex items-center justify-center pl-0.5 ring-1 focus:outline-none cursor-pointer"
              onClick={onPlayPause}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              title="Play"
              className="focus:outline-none cursor-pointer hidden"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className="relative w-full ml-2">
          <div className="text-xs text-white/50 mb-1 absolute top-[-26px] left-0">
            {name}
          </div>
          <div className="bg-[rgba(255,255,255,.5)] h-2 w-full rounded-lg" />
          <div
            className="bg-[rgba(255,255,255,.8)] h-2  rounded-lg absolute top-0 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <div className="flex justify-end w-full sm:w-auto pt-1 sm:pt-0">
          <span className="text-xs  uppercase font-medium pl-2 w-[100px] text-end">
            {formatTime(currentTime)}/{formatTime(duration)}
          </span>
        </div>
        {onDelete && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute right-[-16px] top-[-16px] m-0">
                  <Button
                    variant="outline"
                    className="mb-2 text-destructive hover:text-destructive border-destructive border-none bg-none  m-0"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    size="sm"
                    onClick={onDelete}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove preview song</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <audio controls ref={audioRef} className="hidden">
        <source src={src} type="audio/mpeg" />
      </audio>
    </div>
  );
}
