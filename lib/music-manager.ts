import { Song } from "@/quran/data";
import songs from '@/quran/data.json'
import {
  createQueueManager,
  QueueItem,
  QueueManager,
  QueueManagerOptions,
} from "@/lib/queue-manager";
import { createStorageManager, StorageManager } from "@/lib/storage-manager";

export interface MusicManager {
  storageManager: StorageManager;
  queueManager: QueueManager;
  analyser: AnalyserNode;

  play(): void;
  pause(): void;
  setPlaying(song: Song): void;
  destroy(): void;

  isPaused(): boolean;
  getTime(): number;
  getDuration(): number;
  setTime(time: number): void;

  getVolume(): number;
  setVolume(v: number): void;
}

export interface MusicManagerOptions
  extends Omit<QueueManagerOptions, "onUpdate"> {
  onNext?: (song: QueueItem | undefined) => void;
  onStateChange?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  loading: boolean
  setLoading: (x: boolean) => void
}

export function createMusicManager({
  onSongListUpdated,
  ...options
}: MusicManagerOptions): MusicManager {
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const audio = new Audio();

  let mediaSource: MediaSource | null = null;
  let sourceBuffer: SourceBuffer | null = null;

  // @ts-ignore
  const fetchAudioStream = async (url: string, sourceBuffer: SourceBuffer, mediaSource: MediaSource) => {
    try {
      const response = await fetch(url);
      // @ts-ignore
      const reader = response.body.getReader();
      let sourceBufferUpdating = false;

      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            if (!sourceBufferUpdating) {
              mediaSource.endOfStream();
            }
            return;
          }

          const append = () => {
            if (!sourceBufferUpdating) {
              sourceBufferUpdating = true;
              try {
                sourceBuffer.appendBuffer(value);
              } catch (e) {
                if (e instanceof DOMException) {
                  if (e.name === 'QuotaExceededError') {
                    // Wait for the buffer to be ready
                    sourceBuffer.addEventListener('updateend', append, { once: true });
                  } else {
                    console.error('Error appending buffer:', e);
                  }
                } else {
                  console.error('Error appending buffer:', e);
                }
              }
            }
          };

          append();
          sourceBuffer.addEventListener('updateend', () => {
            sourceBufferUpdating = false;
            read();
          }, { once: true });

        }).catch(error => {
          console.error('Error reading stream:', error);
        });
      };

      read();
    } catch (error) {
      console.error('Error fetching the audio stream:', error);
    }
  };

  const cleanupMediaSource = () => {
    if (mediaSource) {
      mediaSource.removeEventListener('sourceopen', () => { });
      if (sourceBuffer) {
        sourceBuffer.removeEventListener('updateend', () => { });
      }
      URL.revokeObjectURL(audio.src);
      audio.src = '';
      mediaSource = null;
      sourceBuffer = null;
    }
  };


  const onStateChange = () => {
    options.onStateChange?.();
  };
  const onTimeUpdate = () => {
    // options.onTimeUpdate?.(audio.currentTime, songs.filter(a => a.id === queueManager.currentIndex + 1)[0].duration || 0);
    options.onTimeUpdate?.(audio.currentTime, audio.duration);
  };
  const onEnded = () => {
    manager.queueManager.next();
    manager.play();
  };

  const storageManager = createStorageManager();
  const queueManager = createQueueManager({
    onUpdate: (song) => {
      if (song) manager.setPlaying(song);
      options?.onNext?.(song);
      options.onTimeUpdate?.(0, 0);

    },
    onSongListUpdated,
  });

  const init = () => {
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onStateChange);
    audio.addEventListener("pause", onStateChange);
    audio.addEventListener("ended", onEnded);
    queueManager.setSongs(storageManager.loadSongs());
  };

  const manager: MusicManager = {
    queueManager,
    storageManager,
    analyser,
    getTime(): number {
      return audio.currentTime;
    },
    getDuration(): number {
      //TODO: return songs.filter(a => a.id === queueManager.currentIndex + 1)[0].duration || 0;
      return audio.duration;
    },
    setTime(time: number) {
      audio.currentTime = time;
    },
    isPaused(): boolean {
      return context.state === "suspended" || (audio != null && audio.paused);
    },
    getVolume(): number {
      return audio.volume;
    },
    setVolume(v: number) {
      audio.volume = v;
    },
    async play() {
      // When AudioContext is initialized before the first interaction, it is suspended
      // we have to resume it
      if (context.state === "suspended") {
        await context.resume();
      }

      await audio.play();
    },
    pause() {
      void audio.pause();
    },
    async setPlaying(song) {
      cleanupMediaSource()
      mediaSource = new MediaSource();
      audio.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', () => {
        if (mediaSource) {
          sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
          fetchAudioStream(`https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${song.id + 1}.mp3`, sourceBuffer, mediaSource);
        }
        this.play();
      });
    },
    destroy() {
      this.pause();
      audio.removeEventListener("play", onStateChange);
      audio.removeEventListener("pause", onStateChange);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    },
  };

  init();

  return manager;
}
