import type AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

type AsyncStorageLike = typeof AsyncStorage;

type ChunkedAsyncStoragePersisterOptions = {
  chunkSize?: number;
  key: string;
  legacyKeys?: string[];
  storage: AsyncStorageLike;
};

type ChunkIndex = {
  chunkCount: number;
  version: 1;
};

const defaultChunkSize = 120_000;

const getIndexKey = (key: string) => `${key}:index`;
const getChunkKey = (key: string, index: number) => `${key}:chunk:${index}`;

const splitIntoChunks = (value: string, chunkSize: number) => {
  const chunks: string[] = [];

  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }

  return chunks;
};

const parseChunkIndex = (value: string | null): ChunkIndex | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<ChunkIndex>;

    if (parsed.version === 1 && typeof parsed.chunkCount === 'number') {
      return {
        chunkCount: parsed.chunkCount,
        version: 1,
      };
    }
  } catch {
    return null;
  }

  return null;
};

export function createChunkedAsyncStoragePersister({
  chunkSize = defaultChunkSize,
  key,
  legacyKeys = [],
  storage,
}: ChunkedAsyncStoragePersisterOptions): Persister {
  const indexKey = getIndexKey(key);

  const removeStoredChunks = async () => {
    const index = parseChunkIndex(await storage.getItem(indexKey));
    const chunkKeys = Array.from({ length: index?.chunkCount ?? 0 }, (_, chunkIndex) =>
      getChunkKey(key, chunkIndex),
    );

    await storage.multiRemove([indexKey, ...chunkKeys, ...legacyKeys]);
  };

  return {
    persistClient: async (persistedClient) => {
      const existingIndex = parseChunkIndex(await storage.getItem(indexKey));
      const serializedClient = JSON.stringify(persistedClient);
      const chunks = splitIntoChunks(serializedClient, chunkSize);
      const nextChunkKeys = chunks.map((_, chunkIndex) => getChunkKey(key, chunkIndex));
      const staleChunkKeys = Array.from(
        {
          length: Math.max((existingIndex?.chunkCount ?? 0) - chunks.length, 0),
        },
        (_, chunkIndex) => getChunkKey(key, chunks.length + chunkIndex),
      );

      await storage.multiSet([
        [
          indexKey,
          JSON.stringify({
            chunkCount: chunks.length,
            version: 1,
          } satisfies ChunkIndex),
        ],
        ...chunks.map((chunk, chunkIndex) => [nextChunkKeys[chunkIndex], chunk] as [string, string]),
      ]);

      if (staleChunkKeys.length > 0 || legacyKeys.length > 0) {
        await storage.multiRemove([...staleChunkKeys, ...legacyKeys]);
      }
    },
    removeClient: removeStoredChunks,
    restoreClient: async () => {
      const index = parseChunkIndex(await storage.getItem(indexKey));

      if (!index) {
        await storage.multiRemove(legacyKeys);
        return undefined;
      }

      try {
        const chunkKeys = Array.from({ length: index.chunkCount }, (_, chunkIndex) =>
          getChunkKey(key, chunkIndex),
        );
        const chunks = await storage.multiGet(chunkKeys);
        const serializedClient = chunks.map(([, value]) => value ?? '').join('');

        if (!serializedClient) {
          return undefined;
        }

        return JSON.parse(serializedClient) as PersistedClient;
      } catch {
        await removeStoredChunks();
        return undefined;
      }
    },
  };
}
