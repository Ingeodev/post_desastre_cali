import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { IndexDb } from '../../../../core/data/local/db';
import { AttachmentRepository } from '../../data/repositories/attachment.repository';
import { Photo } from '../../domain/models/photo.model';
import { Report } from '../../domain/models/report.model';
import { GetAttachments } from '../../domain/use-cases/get-attachments';
import { SaveAttachment } from '../../domain/use-cases/save-attachment';

const REPORT_ID = '1';

type ReportsState = {
  reports: Report[];
  selectedReport: string | null;
  photos: Photo[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ReportsState = {
  reports: [],
  selectedReport: null,
  photos: [],
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
  withHooks({
    onInit(store) {
      void store.loadPhotos();
    },
  }),
);
