import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-attachment-manager',
  imports: [CarouselModule],
  templateUrl: './attachment-manager.html',
  styleUrl: './attachment-manager.css',
})
export class AttachmentManager {
   items = [1, 2, 3, 4, 5];

     photoBlob: Blob | null = null;

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.photoBlob = file;
    input.value = '';
  }
}
