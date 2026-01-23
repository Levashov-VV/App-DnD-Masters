export type TypedStorageValue = Record<string, unknown>;

export type StorageValidator<T> = (value: unknown) => T;

export type TypedStorage<S extends TypedStorageValue> = {
  get<K extends Extract<keyof S, string>>(
    key: K,
    options?: { defaultValue?: S[K]; validate?: StorageValidator<S[K]> }
  ): S[K] | null;

  set<K extends Extract<keyof S, string>>(
    key: K,
    value: S[K],
    options?: { validate?: StorageValidator<S[K]> }
  ): S[K] | null;

  remove(key: Extract<keyof S, string>): void;
  clear(): void;
};

type StorageType = 'localStorage' | 'sessionStorage';

export function createTypedStorage<S extends TypedStorageValue>(
  type: StorageType = 'localStorage'
): TypedStorage<S> {
  const isClient = typeof window !== 'undefined';
  const cache = new Map<string, { raw: string | null; parsed: unknown }>();

  const getStorage = (): Storage | null => {
    if (!isClient) return null;
    return type === 'localStorage' ? window.localStorage : window.sessionStorage;
  };

  return {
    get<K extends Extract<keyof S, string>>(
      key: K,
      options?: { defaultValue?: S[K]; validate?: StorageValidator<S[K]> }
    ): S[K] | null {
      const storage = getStorage();
      if (!storage) return options?.defaultValue ?? null;

      try {
        const raw = storage.getItem(key);

        const cached = cache.get(key);
        if (cached && cached.raw === raw) return cached.parsed as S[K];

        if (!raw) return options?.defaultValue ?? null;

        let parsed: unknown = JSON.parse(raw);

        if (options?.validate && parsed !== null) {
          parsed = options.validate(parsed);
        }

        cache.set(key, { raw, parsed });
        return parsed as S[K];
      } catch (error) {
        console.warn(`[${type}] Invalid data for key "${key}":`, error);
        return options?.defaultValue ?? null;
      }
    },

    set<K extends Extract<keyof S, string>>(
      key: K,
      value: S[K],
      options?: { validate?: StorageValidator<S[K]> }
    ): S[K] | null {
      const storage = getStorage();
      if (!storage) return null;

      try {
        const valueToSave = options?.validate ? options.validate(value) : value;
        const raw = JSON.stringify(valueToSave);

        storage.setItem(key, raw);
        cache.set(key, { raw, parsed: valueToSave });

        if (isClient) window.dispatchEvent(new CustomEvent(`storage-${key}`));

        return valueToSave;
      } catch (error) {
        console.error(`[${type}] Failed to save key "${key}":`, error);
        return null;
      }
    },

    // ✅ FIX: диспатчим storage-${key}, чтобы same-tab подписчики обновились
    remove(key: Extract<keyof S, string>) {
      getStorage()?.removeItem(key);
      cache.delete(key);

      if (isClient) window.dispatchEvent(new CustomEvent(`storage-${key}`));
    },

    // ✅ FIX: диспатчим clear-storage (как в хуке) — этого достаточно для всех ключей
    clear() {
      getStorage()?.clear();
      cache.clear();

      if (isClient) window.dispatchEvent(new CustomEvent('clear-storage'));
    },
  };
}
