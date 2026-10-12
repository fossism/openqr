const DB_NAME = 'openqr-db';
const STORE_NAME = 'kv';
const LOGO_KEY = 'active-logo-original';

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });

const idbGet = async (key: string): Promise<string | null> => {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          db.close();
          resolve(typeof req.result === 'string' ? req.result : null);
        };
        req.onerror = () => {
          db.close();
          resolve(null);
        };
      } catch {
        db.close();
        resolve(null);
      }
    });
  } catch {
    return null;
  }
};

const idbSet = async (key: string, value: string): Promise<void> => {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      } catch {
        db.close();
        resolve();
      }
    });
  } catch {
    // Ignore: persistence is best-effort
  }
};

const idbDel = async (key: string): Promise<void> => {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          resolve();
        };
      } catch {
        db.close();
        resolve();
      }
    });
  } catch {
    // ignore
  }
};

export const loadStoredLogo = (): Promise<string | null> => idbGet(LOGO_KEY);

export const saveStoredLogo = (src: string): Promise<void> => {
  if (!src) return clearStoredLogo();
  // Small SVG presets (<8KB) can stay out of IDB; large uploads must not touch localStorage.
  return idbSet(LOGO_KEY, src);
};

export const clearStoredLogo = (): Promise<void> => idbDel(LOGO_KEY);
