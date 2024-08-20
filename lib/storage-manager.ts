import defaultSongs from "@/quran/data.json";
import { Song } from "@/quran/data";

export interface StorageManager {
  loadSongs(): Song[];
}

export function createStorageManager(): StorageManager {
  return {
    loadSongs() {
      return defaultSongs;
    },
  };
}
