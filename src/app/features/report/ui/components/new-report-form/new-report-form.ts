import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import {
  ConstructionTypes,
  DamageCategories,
  DataSources,
  SeismicEvents,
} from '../../../../../core/supabase-models/supabase-type-aliases';
import { NewReportStore } from '../../stores/new-report.store';
import { ReportStore } from '../../stores/report.store';
import { AttachmentManager } from "../attachment-manager/attachment-manager";

@Component({
  selector: 'app-new-report-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    AttachmentManager
],
  providers: [NewReportStore],
  templateUrl: './new-report-form.html',
  styleUrl: './new-report-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReportForm {
  readonly reportStore = inject(ReportStore);
  readonly newReportStore = inject(NewReportStore);

  readonly form = new FormGroup({
    damageCategoryId: new FormControl<number | null>(null, Validators.required),
    constructionTypeId: new FormControl<number | null>(null),
    dataSourceId: new FormControl<number | null>(null, Validators.required),
    seismicEventId: new FormControl<string | null>(null, Validators.required),
    addressText: new FormControl<string>(''),
    approxYearBuilt: new FormControl<number | null>(null),
    numFloors: new FormControl<number | null>(null),
    notes: new FormControl<string>(''),
    reportedBy: new FormControl<string>(''),
  });

  constructor() {
    effect(
      () => {
        const event = this.reportStore.currentSeismicEvent();
        if (event && !this.form.get('seismicEventId')?.value) {
          this.form.patchValue({ seismicEventId: event.id });
        }
      },
      { allowSignalWrites: true },
    );

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.newReportStore.updateDraft({
        addressText: value.addressText ?? '',
        approxYearBuilt: value.approxYearBuilt ?? null,
        constructionTypeId: value.constructionTypeId ?? null,
        damageCategoryId: value.damageCategoryId ?? null,
        dataSourceId: value.dataSourceId ?? null,
        notes: value.notes ?? '',
        numFloors: value.numFloors ?? null,
        reportedBy: value.reportedBy ?? null,
        seismicEventId: value.seismicEventId ?? null,
        capturedAt: new Date().toISOString(),
});
    });
  }

  get currentSeismicEvent(): SeismicEvents | null {
    return this.reportStore.currentSeismicEvent();
  }

  get damageCategories(): DamageCategories[] {
    return this.reportStore.damageCategories();
  }

  get constructionTypes(): ConstructionTypes[] {
    return this.reportStore.constructionTypes();
  }

  get dataSources(): DataSources[] {
    return this.reportStore.dataSources();
  }

  onFinish(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const report = this.newReportStore.buildReport();
    console.log('[NEW REPORT]', report);
  }
}