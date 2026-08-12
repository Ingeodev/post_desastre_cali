import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConstructionTypes } from '../../../../../core/supabase-models/supabase-type-aliases';
import { NewReportStore } from '../../stores/new-report.store';
import { ReportStore } from '../../stores/report.store';

@Component({
  selector: 'app-step-description',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './step-description.html',
  styleUrl: './step-description.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepDescription {
  readonly reportStore = inject(ReportStore);
  readonly newReportStore = inject(NewReportStore);

  readonly form = new FormGroup({
    constructionTypeId: new FormControl<number | null>(null),
    approxYearBuilt: new FormControl<number | null>(null),
    addressText: new FormControl<string>(''),
    numFloors: new FormControl<number | null>(null),
  });

  constructor() {
    const inspection = this.newReportStore.inspection();
    this.form.patchValue({
      constructionTypeId: inspection.constructionTypeId,
      approxYearBuilt: inspection.approxYearBuilt,
      addressText: inspection.addressText ?? '',
      numFloors: inspection.numFloors,
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.newReportStore.updateInspection({
        constructionTypeId: value.constructionTypeId ?? null,
        approxYearBuilt: value.approxYearBuilt ?? null,
        addressText: value.addressText?.trim() || null,
        numFloors: value.numFloors ?? null,
      });
    });
  }

  get constructionTypes(): ConstructionTypes[] {
    return this.reportStore.constructionTypes();
  }
}