// src/infra/storage/indexed-db.ts
import { openDB, type IDBPDatabase } from 'idb';
import type { Draft } from '@/domain/types';

const DB_NAME = 'techblog-admin';
const STORE_NAME = 'drafts';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

export async function saveDraft(draft: Draft): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, draft);
}

export async function getDraft(id: string): Promise<Draft | null> {
    const db = await getDB();
    return (await db.get(STORE_NAME, id)) || null;
}

export async function listDrafts(): Promise<Draft[]> {
    const db = await getDB();
    return await db.getAll(STORE_NAME);
}

export async function deleteDraft(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
}