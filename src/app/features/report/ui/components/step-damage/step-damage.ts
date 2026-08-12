import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import {
  DamageCategories,
  DamagePatterns,
} from '../../../../../core/supabase-models/supabase-type-aliases';
import { DamagePatternCatalogComponent } from '../damage-catalog/damage-catalog';
import { NewReportStore } from '../../stores/new-report.store';
import { ReportStore } from '../../stores/report.store';

@Component({
  selector: 'app-step-damage',
  imports: [ReactiveFormsModule, SelectModule, DamagePatternCatalogComponent],
  templateUrl: './step-damage.html',
  styleUrl: './step-damage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepDamage {
  readonly reportStore = inject(ReportStore);
  readonly newReportStore = inject(NewReportStore);

  readonly damageForm = new FormGroup({
    damageCategoryId: new FormControl<number | null>(null, Validators.required),
  });

  constructor() {
    this.damageForm.patchValue({
      damageCategoryId: this.newReportStore.inspection().damageCategoryId,
    });

    this.damageForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.newReportStore.updateInspection({
        damageCategoryId: value.damageCategoryId ?? null,
      });
    });
  }

  get damageCategories(): DamageCategories[] {
    return this.reportStore.damageCategories();
  }

  onPatternsChange(items: DamagePatterns[]): void {
    this.newReportStore.setPatternIds(items.map((item) => item.id));
  }
}