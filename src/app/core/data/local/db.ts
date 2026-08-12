import { INDEX_DB_NAME, INDEX_DB_SCHEMA, INDEX_DB_VERSION } from "./db-shcema";
import { IndexDbStore } from "./db-stores";

export class IndexDb {
  private database?: IDBDatabase;
  private opening?: Promise<IDBDatabase>;

  async open(): Promise<IDBDatabase> {
    if (this.database) {
      return this.database;
    }

    if (this.opening) {
      return this.opening;
    }

    this.opening = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(
        INDEX_DB_NAME,
        INDEX_DB_VERSION,
      );

      request.onupgradeneeded = () => {
        this.configureSchema(request.result);
      };

      request.onsuccess = () => {
        const database = request.result;

        this.database = database;

        database.onversionchange = () => {
          database.close();
          this.database = undefined;
        };

        resolve(database);
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error('Unable to open IndexedDB database'),
        );
      };
    });

    try {
      return await this.opening;
    } finally {
      this.opening = undefined;
    }
  }

  async put<T>(
    store: IndexDbStore,
    value: T,
  ): Promise<void> {
    const database = await this.open();

    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        store,
        'readwrite',
      );

      transaction.objectStore(store).put(value);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error(
              `Failed to write to store "${store}"`,
            ),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error(
              `Transaction aborted for store "${store}"`,
            ),
        );
      };
    });
  }

  async get<T>(
    store: IndexDbStore,
    key: IDBValidKey,
  ): Promise<T | undefined> {
    const database = await this.open();

    return new Promise<T | undefined>((resolve, reject) => {
      const transaction = database.transaction(
        store,
        'readonly',
      );

      const request = transaction
        .objectStore(store)
        .get(key);

      request.onsuccess = () => {
        resolve(request.result as T | undefined);
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              `Failed to read from store "${store}"`,
            ),
        );
      };
    });
  }

  async getAll<T>(
    store: IndexDbStore,
  ): Promise<T[]> {
    const database = await this.open();

    return new Promise<T[]>((resolve, reject) => {
      const transaction = database.transaction(
        store,
        'readonly',
      );

      const request = transaction
        .objectStore(store)
        .getAll();

      request.onsuccess = () => {
        resolve(request.result as T[]);
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              `Failed to read from store "${store}"`,
            ),
        );
      };
    });
  }

  async delete(
    store: IndexDbStore,
    key: IDBValidKey,
  ): Promise<void> {
    const database = await this.open();

    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        store,
        'readwrite',
      );

      transaction.objectStore(store).delete(key);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error(
              `Failed to delete from store "${store}"`,
            ),
        );
      };
    });
  }

  async clear(
    store: IndexDbStore,
  ): Promise<void> {
    const database = await this.open();

    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        store,
        'readwrite',
      );

      transaction.objectStore(store).clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error(
              `Failed to clear store "${store}"`,
            ),
        );
      };
    });
  }

  close(): void {
    this.database?.close();
    this.database = undefined;
  }

  private configureSchema(
    database: IDBDatabase,
  ): void {
    for (const [storeName, configuration] of Object.entries(
      INDEX_DB_SCHEMA,
    )) {
      if (
        !database.objectStoreNames.contains(storeName)
      ) {
        database.createObjectStore(
          storeName,
          configuration as IDBObjectStoreParameters,
        );
      }
    }
  }
}