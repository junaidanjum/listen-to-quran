import { cn } from "@/lib/cn";
import { MusicManager } from "@/lib/music-manager";
import { buttonVariants } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Dices, Pause, Play } from "lucide-react";

export interface TimeControlsProps {
  musicManager: MusicManager;
}

export function PlayerControls({ musicManager }: TimeControlsProps) {
  const randomize = () => {
    const randomChapterIndex = Math.floor(Math.random() * 114)
    musicManager.queueManager.setIndex(randomChapterIndex);
  };

  const playNext = () => {
    const nextSong = musicManager.queueManager.songs[musicManager.queueManager.currentIndex + 1]
    if (nextSong) {
      musicManager.queueManager.setIndex(nextSong.id);
    }
  };

  const playPrevious = () => {
    const previousSong = musicManager.queueManager.songs[musicManager.queueManager.currentIndex - 1]
    if (previousSong) {
      musicManager.queueManager.setIndex(previousSong.id);
    }
  };


  return (
    <div className="flex flex-row items-center gap-2 mt-2">
      {musicManager.isPaused() ? (
        <button
          aria-label="play"
          className={cn(buttonVariants({ variant: "secondary" }))}
          onClick={() => musicManager.play()}
        >
          <Play size={20} strokeWidth={0.7} />
        </button>
      ) : (
        <button
          aria-label="pause"
          className={cn(buttonVariants({ variant: "secondary" }))}
          onClick={() => musicManager.pause()}
        >
            <Pause size={20} strokeWidth={0.7} />
        </button>
      )}
      <button
        aria-label="Randomize Surah"
        className={cn(buttonVariants({ variant: "secondary" }))}
        onClick={randomize}
      >
        <Dices size={20} strokeWidth={0.7} />
      </button>
      {/* <button
        aria-label="Randomize queue"
        className={cn(buttonVariants({ variant: "secondary" }))}
      // onClick={randomize}
      >
        <BookOpen size={18} strokeWidth={0.7} />
      </button> */}
      <button
        aria-label="Replay Previous Chapter"
        className={cn(buttonVariants({ variant: "secondary" }))}
        onClick={playPrevious}
      >
        <ChevronLeft size={20} strokeWidth={0.7} />
      </button>
      <button
        aria-label="Play Next Chapter"
        className={cn(buttonVariants({ variant: "secondary" }))}
        onClick={playNext}
      >
        <ChevronRight size={20} strokeWidth={0.7} />
      </button>
      {/* <VolumeSlider musicManager={musicManager} /> */}
    </div>
  );
}

function VolumeSlider({ musicManager }: { musicManager: MusicManager }) {
  const [value, setValue] = useState(() => musicManager.getVolume());

  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {value > 0.2 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
        {value > 0.7 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
      </svg>
      <Slider
        className="flex-1 rounded-full"
        aria-valuetext="Volume"
        value={value}
        onValueChange={(v) => {
          setValue(v);
          musicManager.setVolume(v);
        }}
      />
    </>
  );
}
