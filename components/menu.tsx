import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SongList } from "@/components/control/song-list";
import { MusicManager } from "@/lib/music-manager";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { Search } from "lucide-react";

export function Menu({ musicManager }: { musicManager: MusicManager }) {
  return (
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
  );
}
