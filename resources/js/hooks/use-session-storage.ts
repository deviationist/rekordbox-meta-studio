import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

interface UseSessionStorageOptions {
  serializer?: (value: unknown) => string;
  deserializer?: (value: string) => unknown;
}

function useSessionStorage<T>(
  key: string,
  initialValue: T,
  options: UseSessionStorageOptions = {}
): [T, SetValue<T>, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
  } = options;

  // Get initial value from sessionStorage or use provided initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (deserializer(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter that persists to sessionStorage
  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn(`Tried setting sessionStorage key "${key}" on server`);
        return;
      }

      try {
        // Allow value to be a function for same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Save to sessionStorage
        window.sessionStorage.setItem(key, serializer(newValue));

        // Save state
        setStoredValue(newValue);

        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new CustomEvent('session-storage', {
          detail: { key, value: newValue }
        }));
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  // Remove value from sessionStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn(`Tried removing sessionStorage key "${key}" on server`);
      return;
    }

    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);

      window.dispatchEvent(new CustomEvent('session-storage', {
        detail: { key, value: undefined }
      }));
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key && e.key !== key) {
        return;
      }

      if ('detail' in e && e.detail.key !== key) {
        return;
      }

      setStoredValue(readValue());
    };

    // Listen to storage events (other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Listen to custom events (same tab)
    window.addEventListener('session-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('session-storage', handleStorageChange as EventListener);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}

export default useSessionStorage;
