import { Component, inject } from '@angular/core';
import { GlobalStore } from '../../stores/global.store';

@Component({
  selector: 'app-sync-overlay',
  imports: [],
  templateUrl: './sync-overlay.html',
  styleUrl: './sync-overlay.css',
})
export class SyncOverlay {
  readonly globalStore = inject(GlobalStore);
}
