import { countries } from '../shared/countries.js';

const blobCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

export const ALL_FLAG_CODES = countries.map((country) => country.code);
const TOTAL_FLAGS = ALL_FLAG_CODES.length;

let preloadPromise: Promise<void> | null = null;
let preloadDone = false;

export function getFlagBlobUrl(code: string): string | undefined {
  return blobCache.get(code);
}

export function isPreloadComplete(): boolean {
  return preloadDone || blobCache.size >= TOTAL_FLAGS;
}

async function loadFlagFromUrl(code: string, url: string): Promise<string | null> {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();
  if (blob.size < 64) {
    return null;
  }

  const objectUrl = URL.createObjectURL(blob);
  blobCache.set(code, objectUrl);
  return objectUrl;
}

async function fetchFlagBlob(code: string): Promise<string> {
  const cached = blobCache.get(code);
  if (cached) {
    return cached;
  }

  const pending = inflight.get(code);
  if (pending) {
    return pending;
  }

  const task = (async () => {
    const staticUrl = `/flags/${code}.png`;
    const apiUrl = `/api/flag/${code}`;

    const staticResult = await loadFlagFromUrl(code, staticUrl).catch(() => null);
    if (staticResult) {
      return staticResult;
    }

    const apiResult = await loadFlagFromUrl(code, apiUrl).catch(() => null);
    if (apiResult) {
      return apiResult;
    }

    throw new Error(`Unable to load flag: ${code}`);
  })();

  inflight.set(code, task);

  try {
    return await task;
  } finally {
    inflight.delete(code);
  }
}

export async function preloadAllFlags(): Promise<void> {
  const concurrency = 48;
  let index = 0;

  async function worker() {
    while (index < TOTAL_FLAGS) {
      const code = ALL_FLAG_CODES[index];
      index += 1;
      if (!code || blobCache.has(code)) {
        continue;
      }

      try {
        await fetchFlagBlob(code);
      } catch {
        // individual failures are retried during gameplay
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  preloadDone = true;
}

export function beginFlagPreload(): Promise<void> {
  if (preloadDone) {
    return Promise.resolve();
  }

  if (!preloadPromise) {
    preloadPromise = preloadAllFlags();
  }

  return preloadPromise;
}

export async function resolveFlagUrl(code: string): Promise<string> {
  return fetchFlagBlob(code);
}

export function preloadFlags(codes: string[]): void {
  for (const code of codes) {
    if (!code || blobCache.has(code)) {
      continue;
    }
    void fetchFlagBlob(code).catch(() => undefined);
  }
}

if (typeof window !== 'undefined') {
  void beginFlagPreload();
}
