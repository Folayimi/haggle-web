// Minimal IndexedDB helpers for storing blobs (screenshots/audio)
export async function openDb(dbName = "haggle-web-db", version = 1) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(dbName, version);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("screenshots")) {
        db.createObjectStore("screenshots", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("audio")) {
        db.createObjectStore("audio", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function nextId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export async function saveBlob(storeName: "screenshots" | "audio", blob: Blob) {
  const db = await openDb();
  return new Promise<string>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const id = nextId(storeName);
    const obj = { id, blob };
    const req = tx.objectStore(storeName).add(obj);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
}

export async function getBlob(storeName: "screenshots" | "audio", id: string) {
  const db = await openDb();
  return new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(id);
    req.onsuccess = () => {
      const result = req.result;
      resolve(result ? (result.blob as Blob) : null);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveImageFromUrl(url: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const id = await saveBlob("screenshots", blob);
  const objectUrl = URL.createObjectURL(blob);
  return { id, objectUrl };
}

export async function saveAudioBlob(blob: Blob) {
  const id = await saveBlob("audio", blob);
  const objectUrl = URL.createObjectURL(blob);
  return { id, objectUrl };
}

export async function getBlobUrl(storeName: "screenshots" | "audio", id: string) {
  const blob = await getBlob(storeName, id);
  return blob ? URL.createObjectURL(blob) : null;
}
