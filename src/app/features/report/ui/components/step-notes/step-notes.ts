import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { NewReportStore } from '../../stores/new-report.store';

@Component({
  selector: 'app-step-notes',
  imports: [ReactiveFormsModule, TextareaModule],
  templateUrl: './step-notes.html',
  styleUrl: './step-notes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepNotes {
  readonly newReportStore = inject(NewReportStore);

  readonly form = new FormGroup({
    notes: new FormControl<string>(''),
  });

  constructor() {
    this.form.patchValue({
      notes: this.newReportStore.inspection().notes ?? '',
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.newReportStore.updateInspection({
        notes: value.notes?.trim() || null,
      });
    });
  }
}