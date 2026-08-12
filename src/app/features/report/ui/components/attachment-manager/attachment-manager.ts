import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InspectionPhotoEntity } from '../../../data/entities/inspection-photo.entity';
import { NewReportStore } from '../../stores/new-report.store';
import { getLocalPhotoUrl } from '../../../application/mappers/photo.mapper';

@Component({
  selector: 'app-attachment-manager',
  imports: [],
  templateUrl: './attachment-manager.html',
  styleUrl: './attachment-manager.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentManager {
  readonly newReportStore = inject(NewReportStore);

  private readonly objectUrls = new Map<string, string>();

  photoUrl(photo: InspectionPhotoEntity): string | null {
    let url = this.objectUrls.get(photo.id);

    if (!url && photo.blob) {
      url = getLocalPhotoUrl(photo);
      this.objectUrls.set(photo.id, url);
    }

    return url ?? null;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.newReportStore.addPhoto(file);
    input.value = '';
  }

  onRemovePhoto(photo: InspectionPhotoEntity): void {
    const url = this.objectUrls.get(photo.id);

    if (url) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(photo.id);
    }

    this.newReportStore.removePhoto(photo.id);
  }
}