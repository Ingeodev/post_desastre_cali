import { Injectable } from '@angular/core';
import { IndexDb } from '../../../../core/data/local/db';
import { INDEX_DB_STORES } from '../../../../core/data/local/db-stores';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../../domain/interfaces/user.repository';

@Injectable({ providedIn: 'root' })
export class IndexedDbUserRepository implements UserRepository {
  constructor(private readonly db: IndexDb) {}

  async saveLocal(user: UserEntity): Promise<void> {
    await this.db.put(INDEX_DB_STORES.user, user);
  }

  async getLocal(id: string): Promise<UserEntity | undefined> {
    return this.db.get<UserEntity>(INDEX_DB_STORES.user, id);
  }

  async getAllLocal(): Promise<UserEntity[]> {
    return this.db.getAll<UserEntity>(INDEX_DB_STORES.user);
  }

  async deleteLocal(id: string): Promise<void> {
    await this.db.delete(INDEX_DB_STORES.user, id);
  }
}