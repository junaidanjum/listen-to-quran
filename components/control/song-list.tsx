import { MusicManager } from "@/lib/music-manager";
import { cn } from "@/lib/cn";
import { QueueItem } from "@/lib/queue-manager";


export interface SongListProps {
  musicManager: MusicManager;
}

export function SongList({ musicManager }: SongListProps) {
  const onPlay = (item: QueueItem) => {
    musicManager.queueManager.setIndex(item.id);
  };

  return (
    <div className="flex flex-col -mx-2 -mt-2 h-[300px] overflow-y-scroll">
      {musicManager.queueManager.songs.map((song) => (
        <Item
          key={song.id}
          song={song}
          playing={song.id === musicManager.queueManager.currentIndex}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}

function Item({
  song,
  playing,
  onPlay,
}: {
    song: any;
  playing: boolean;
    onPlay: (item: any) => void;
}) {
  return (
    <button
      className={cn(
        "relative flex flex-row text-left items-center gap-3 rounded-xl p-2 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
        playing ? "bg-purple-400/20" : "hover:bg-purple-200/5",
      )}
      onClick={() => onPlay(song)}
    >
      <img alt="picture" src='sample.jpeg' className="size-12 rounded-md" />
      <div>
        <p className="text-sm font-medium"> <span className="font-extralight">{song.id + 1}</span> {song.name_simple}</p>
        <p className="text-xs text-purple-200">Mishari Alafasi</p>
      </div>

    </button>
  );
}
