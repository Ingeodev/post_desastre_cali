import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProfileStore } from '../../stores/profile.store';
import { ReportDetailMap } from '../../components/report-detail-map/report-detail-map';
import { ReportDetailInfo } from '../../components/report-detail-info/report-detail-info';
import { ReportDetailPatterns } from '../../components/report-detail-patterns/report-detail-patterns';
import { ReportDetailPhotos } from '../../components/report-detail-photos/report-detail-photos';

@Component({
  selector: 'app-report-detail',
  imports: [
    ReportDetailMap,
    ReportDetailInfo,
    ReportDetailPatterns,
    ReportDetailPhotos,
  ],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDetail {
  readonly store = inject(ProfileStore);

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly error = signal<string | null>(null);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.error.set('Falta el identificador del reporte.');
        return;
      }

      this.error.set(null);
      this.store.reset();
      this.store.load(id);
    });
  }
}