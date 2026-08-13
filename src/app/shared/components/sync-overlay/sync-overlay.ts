import { Component, computed, inject } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { GlobalStore } from '../../stores/global.store';

@Component({
  selector: 'app-sync-overlay',
  imports: [ProgressBarModule],
  templateUrl: './sync-overlay.html',
  styleUrl: './sync-overlay.css',
})
export class SyncOverlay {
  readonly globalStore = inject(GlobalStore);

  readonly synced = computed(() => this.globalStore.syncProgress().synced);
  readonly total = computed(() => this.globalStore.syncProgress().total);
  readonly progressValue = computed(() => {
    const total = this.total();

    return total > 0 ? Math.round((this.synced() / total) * 100) : 0;
  });
}
