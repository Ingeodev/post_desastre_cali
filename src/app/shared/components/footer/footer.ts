import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsStore } from '../../../features/settings/ui/stores/settings.store';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly router = inject(Router);
  readonly settingsStore = inject(SettingsStore);

  readonly isReportEnabled = computed(() => this.settingsStore.isConfigured());

  onNewReportClick(event: Event): void {
    if (this.isReportEnabled()) {
      return;
    }

    event.preventDefault();
    this.router.navigate(['/settings']);
  }
}