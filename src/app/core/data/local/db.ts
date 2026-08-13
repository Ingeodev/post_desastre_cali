import { INDEX_DB_NAME, INDEX_DB_SCHEMA } from "./db-shcema";
import { IndexDbStore } from "./db-stores";

export interface IndexDbRecord {
  store: IndexDbStore;
  value: object;
}

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

    this.opening = this.openCurrent()
      .then((database) => {
        if (this.hasExpectedStores(database)) {
          this.setDatabase(database);
          return database;
        }

        // Faltan stores alineados (base vieja o "pegada" en una versión sin
        // schema): forzamos un upgrade con la versión siguiente.
        database.close();

        return this.upgradeSchema(database.version + 1).then((upgraded) => {
          this.setDatabase(upgraded);
          return upgraded;
        });
      })
      .finally(() => {
        this.opening = undefined;
      });

    return this.opening;
  }

  private openCurrent(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(INDEX_DB_NAME);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(
          request.error ?? new Error('Unable to open IndexedDB database'),
        );
      };
    });
  }

  private upgradeSchema(version: number): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(INDEX_DB_NAME, version);

      request.onupgradeneeded = () => {
        this.configureSchema(request.result);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(
          request.error ?? new Error('Unable to open IndexedDB database'),
        );
      };
    });
  }

  private setDatabase(database: IDBDatabase): void {
    this.database = database;

    database.onversionchange = () => {
      database.close();
      if (this.database === database) {
        this.database = undefined;
      }
    };
  }

  private hasExpectedStores(database: IDBDatabase): boolean {
    return Object.keys(INDEX_DB_SCHEMA).every((storeName) =>
      database.objectStoreNames.contains(storeName),
    );
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

  async putInTransaction(records: IndexDbRecord[]): Promise<void> {
    if (records.length === 0) {
      return;
    }

    const database = await this.open();

    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        records.map((record) => record.store),
        'readwrite',
      );

      for (const record of records) {
        transaction.objectStore(record.store).put(record.value);
      }

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error('Failed to write records in transaction'),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error('Transaction aborted while writing records'),
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
    this.dropLegacyStores(database);

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

  private dropLegacyStores(database: IDBDatabase): void {
    const legacyNames = [
      'inspectionPhotos',
      'inspectionOccupancy',
      'inspectionPatterns',
      'syncQueue',
      'seismicEvents',
    ];

    for (const name of legacyNames) {
      if (database.objectStoreNames.contains(name)) {
        database.deleteObjectStore(name);
      }
    }
  }
}