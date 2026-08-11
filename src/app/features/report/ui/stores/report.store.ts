import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Subscription } from 'rxjs';
import { IndexDb } from '../../../../core/data/local/db';
import { GeoLocation, LocationService } from '../../../../core/sensors/location/location.service';
import { AttachmentRepository } from '../../data/repositories/attachment.repository';
import { Photo } from '../../domain/models/photo.model';
import { Report } from '../../domain/models/report.model';
import { GetAttachments } from '../../domain/use-cases/get-attachments';
import { ListenLocation } from '../../domain/use-cases/listen-location';
import { SaveAttachment } from '../../domain/use-cases/save-attachment';

const REPORT_ID = '1';

type ReportsState = {
  reports: Report[];
  selectedReport: string | null;
  photos: Photo[];
  location: GeoLocation | null;
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ReportsState = {
  reports: [],
  selectedReport: null,
  photos: [],
  location: null,
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const ReportStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => {
    const repository = new AttachmentRepository(new IndexDb());

    return {
      saveAttachment: new SaveAttachment(repository),
      getAttachments: new GetAttachments(repository),
      listenLocation: new ListenLocation(new LocationService()),
    };
  }),
  withMethods((store) => ({
    async loadPhotos(): Promise<void> {
      const photos = await store.getAttachments.execute(REPORT_ID);

      patchState(store, { photos });
    },
  })),
  withMethods((store) => ({
    async savePhoto(file: Blob): Promise<void> {
      const photo: Photo = {
        id: crypto.randomUUID(),
        url: '',
        file,
      };

      await store.saveAttachment.execute(photo, REPORT_ID);
      await store.loadPhotos();
    },
  })),
  withMethods((store) => {
    let locationSubscription: Subscription | undefined;

    return {
      listenToLocation(): void {
        if (locationSubscription) {
          return;
        }

        locationSubscription = store.listenLocation.execute().subscribe({
          next: (location) => patchState(store, { location }),
          error: (error) => {
            console.error('Location error:', error);
          },
        });
      },
      stopListening(): void {
        locationSubscription?.unsubscribe();
        locationSubscription = undefined;
      },
    };
  }),
  withHooks({
    onInit(store) {
      void store.loadPhotos();
      store.listenToLocation();
    },
    onDestroy(store) {
      store.stopListening();
    },
  }),
);
