import { Injectable, inject } from '@angular/core';
import { UserEntity } from '../../data/entities/user.entity';
import { IndexedDbUserRepository } from '../../data/local/indexeddb-user.repository';
import { IndexedDbSeismicEventRepository } from '../../data/local/indexeddb-seismic-event.repository';
import { Settings } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class UpdateSettings {
  private readonly userRepository = inject(IndexedDbUserRepository);
  private readonly eventRepository = inject(IndexedDbSeismicEventRepository);

  async execute(settings: Settings): Promise<void> {
    const [existingUser] = await this.userRepository.getAllLocal();

    const user: UserEntity = {
      id: existingUser?.id ?? crypto.randomUUID(),
      email: settings.email,
    };

    await this.userRepository.saveLocal(user);
    await this.eventRepository.saveLocal(settings.event);
  }
}