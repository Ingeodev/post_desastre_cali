import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { NewReportStore } from '../../stores/new-report.store';

@Component({
  selector: 'app-step-occupancy',
  imports: [ReactiveFormsModule, CheckboxModule, InputNumberModule],
  templateUrl: './step-occupancy.html',
  styleUrl: './step-occupancy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOccupancy {
  readonly newReportStore = inject(NewReportStore);

  readonly form = new FormGroup({
    isCurrentlyOccupied: new FormControl<boolean | null>(null),
    hasTrappedPeople: new FormControl<boolean | null>(null),
    estimatedResidents: new FormControl<number | null>(null),
  });

  constructor() {
    const occupancy = this.newReportStore.occupancy();
    this.form.patchValue({
      isCurrentlyOccupied: occupancy.isCurrentlyOccupied,
      hasTrappedPeople: occupancy.hasTrappedPeople,
      estimatedResidents: occupancy.estimatedResidents,
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.newReportStore.updateOccupancy({
        isCurrentlyOccupied: value.isCurrentlyOccupied ?? null,
        hasTrappedPeople: value.hasTrappedPeople ?? null,
        estimatedResidents: value.estimatedResidents ?? null,
      });
    });
  }
}