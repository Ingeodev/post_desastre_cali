import { Injectable, inject } from '@angular/core';
import { IndexedDbUserRepository } from '../../data/local/indexeddb-user.repository';
import { IndexedDbSeismicEventRepository } from '../../data/local/indexeddb-seismic-event.repository';
import { Settings } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class GetSettings {
  private readonly userRepository = inject(IndexedDbUserRepository);
  private readonly eventRepository = inject(IndexedDbSeismicEventRepository);

  async execute(): Promise<Settings | null> {
    const [user] = await this.userRepository.getAllLocal();
    const [event] = await this.eventRepository.getAllLocal();

    if (!user?.email || !event) {
      return null;
    }

    return { email: user.email, event };
  }
}