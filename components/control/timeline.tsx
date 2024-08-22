import { MusicManager } from "@/lib/music-manager";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import Loader from "./loader";

export type DurationControl = (percent: number) => void;

export function Timeline({
  musicManager,
  durationRef,
  isPaused
}: {
  musicManager?: MusicManager;
  durationRef: MutableRefObject<DurationControl | undefined>;
    isPaused: boolean

}) {
  const [value, setValue] = useState(0);
  const isDrawingRef = useRef(false);
  useEffect(() => {
    durationRef.current = (percent) => {
      if (isDrawingRef.current) return;

      if (isFinite(percent)) {
        setValue(percent / 100);
      }
    };
  }, []);

  return (
    value === 0 && !isPaused ? <Loader /> : 
    <Slider
      value={value}
      aria-valuetext="Time"
      onSlideStart={() => {
        isDrawingRef.current = true;
      }}
      onValueChange={setValue}
      onSlideEnd={(v) => {
        isDrawingRef.current = false;
        setValue(v);
        if (musicManager) {
          musicManager.setTime(v * musicManager.getDuration());
        }
      }}
    />
  );
}
