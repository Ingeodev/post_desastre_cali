import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReportProfilePhoto } from '../../../domain/models/report-profile.model';

@Component({
  selector: 'app-report-detail-photos',
  imports: [],
  templateUrl: './report-detail-photos.html',
  styleUrl: './report-detail-photos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDetailPhotos {
  readonly photos = input.required<ReportProfilePhoto[]>();
}