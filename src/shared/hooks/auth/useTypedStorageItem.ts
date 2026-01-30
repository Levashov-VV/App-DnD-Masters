import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { StorageValidator, TypedStorage, TypedStorageValue } from './typedStorage';

const noop = () => {};

export function useTypedStorageItem<
  S extends TypedStorageValue,
  K extends Extract<keyof S, string>,
>(
  key: K,
  {
    storage,
    defaultValue,
    validate,
  }: {
    storage: TypedStorage<S>;
    defaultValue?: S[K];
    validate?: StorageValidator<S[K]>;
  }
) {
  const isClient = typeof window !== 'undefined';
  const customEventName = `storage-${key}`;

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!isClient) return noop;

      // cross-tab (срабатывает только из другой вкладки)
      const storageHandler = (e: StorageEvent) => {
        if (e.key === key || e.key === null) callback();
      };

      window.addEventListener('storage', storageHandler);

      // same-tab (срабатывает от createTypedStorage.set/remove)
      window.addEventListener(customEventName, callback);
      window.addEventListener('clear-storage', callback);

      return () => {
        window.removeEventListener('storage', storageHandler);
        window.removeEventListener(customEventName, callback);
        window.removeEventListener('clear-storage', callback);
      };
    },
    [isClient, key, customEventName]
  );

  const getSnapshot = useCallback(
    () => storage.get(key, { defaultValue, validate }),
    [key, storage, defaultValue, validate]
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue ?? null);

  const set = useCallback(
    (val: S[K]) => storage.set(key, val, { validate }),
    [key, storage, validate]
  );
  const remove = useCallback(() => storage.remove(key), [key, storage]);

  return useMemo(() => ({ value, set, remove }), [value, set, remove]);
}
