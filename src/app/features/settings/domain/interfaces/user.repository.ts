import { UserEntity } from '../../data/entities/user.entity';

export interface UserRepository {
  saveLocal(user: UserEntity): Promise<void>;
  getLocal(id: string): Promise<UserEntity | undefined>;
  getAllLocal(): Promise<UserEntity[]>;
  deleteLocal(id: string): Promise<void>;
}