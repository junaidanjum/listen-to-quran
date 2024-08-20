import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SongList } from "@/components/control/song-list";
import { MusicManager } from "@/lib/music-manager";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { Github, Search } from "lucide-react";

export function Menu({ musicManager }: { musicManager: MusicManager }) {
  return (
    <div className="flex">
      <Popover>
      <PopoverTrigger
        id="menu-trigger"
        aria-label="Menu"
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "max-md:absolute max-md:top-8 max-md:right-8",
          }),
        )}
        >
          <Search size={20} strokeWidth={0.7} />
      </PopoverTrigger>
      <PopoverContent>
        <SongList musicManager={musicManager} />
        {/* <PlayerControls musicManager={musicManager} /> */}
      </PopoverContent>
    </Popover>
      <a
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "max-md:absolute max-md:top-8 max-md:right-20 cursor-pointer",
          }),
        )}
        href='https://github.com/junaidanjum/play-quran'
        target="_blank"
      ><Github size={20} strokeWidth={0.7} /> </a>

    </div>
  );
}
