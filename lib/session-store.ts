import { FavouriteItem, RecommendationHistoryItem } from "@/types/recommendation";

// In-memory storage for when MongoDB URI is not configured yet
interface MemoryStorage {
  favourites: Map<string, FavouriteItem[]>; // userId -> favourites
  history: Map<string, RecommendationHistoryItem[]>; // userId -> history
}

declare global {
  // eslint-disable-next-line no-var
  var cinesuggestMemoryStore: MemoryStorage | undefined;
}

if (!global.cinesuggestMemoryStore) {
  global.cinesuggestMemoryStore = {
    favourites: new Map(),
    history: new Map(),
  };
}

export const memoryStore = global.cinesuggestMemoryStore;

export function getMemoryFavourites(userId: string): FavouriteItem[] {
  return memoryStore.favourites.get(userId) || [];
}

export function addMemoryFavourite(userId: string, item: FavouriteItem): boolean {
  const current = getMemoryFavourites(userId);
  const exists = current.some((f) => f.movieId === item.movieId);
  if (exists) return false;
  
  memoryStore.favourites.set(userId, [{ ...item, createdAt: new Date().toISOString() }, ...current]);
  return true;
}

export function removeMemoryFavourite(userId: string, movieId: number): boolean {
  const current = getMemoryFavourites(userId);
  const filtered = current.filter((f) => f.movieId !== movieId);
  memoryStore.favourites.set(userId, filtered);
  return filtered.length !== current.length;
}

export function getMemoryHistory(userId: string): RecommendationHistoryItem[] {
  return memoryStore.history.get(userId) || [];
}

export function addMemoryHistory(userId: string, item: Omit<RecommendationHistoryItem, "id" | "createdAt">): RecommendationHistoryItem {
  const current = getMemoryHistory(userId);
  const newItem: RecommendationHistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    _id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  memoryStore.history.set(userId, [newItem, ...current]);
  return newItem;
}

export function removeMemoryHistory(userId: string, historyId: string): boolean {
  const current = getMemoryHistory(userId);
  const filtered = current.filter((h) => h.id !== historyId && h._id !== historyId);
  memoryStore.history.set(userId, filtered);
  return filtered.length !== current.length;
}
