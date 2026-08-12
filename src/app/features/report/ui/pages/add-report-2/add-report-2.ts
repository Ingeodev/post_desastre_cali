import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FormStepper } from '../../../../../shared/components/form-stepper/form-stepper';
import { Stepp } from '../../../../../shared/components/stepp/stepp';

interface DamageCategoryOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-add-report-2',
  imports: [
    FormStepper,
    Stepp,
    ReactiveFormsModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './add-report-2.html',
  styleUrl: './add-report-2.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReport2 {
  private readonly router = inject(Router);

  readonly damageCategories: DamageCategoryOption[] = [
    { id: 1, label: 'Daño leve' },
    { id: 2, label: 'Daño moderado' },
    { id: 3, label: 'Daño severo' },
  ];

  readonly sampleObservations = Array.from(
    { length: 60 },
    (_, index) => `Observación de prueba ${index + 1}`,
  );

  readonly eventForm = new FormGroup({
    addressText: new FormControl<string>('', Validators.required),
    municipality: new FormControl<string>('', Validators.required),
  });

  readonly damageForm = new FormGroup({
    damageCategoryId: new FormControl<number | null>(null, Validators.required),
    numFloors: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  });

  readonly contactForm = new FormGroup({
    reportedBy: new FormControl<string>('', Validators.required),
    notes: new FormControl<string>(''),
  });

  onCancel(): void {
    this.router.navigate(['/reportes']);
  }

  onFinish(): void {
    if (this.eventForm.invalid || this.damageForm.invalid || this.contactForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.damageForm.markAllAsTouched();
      this.contactForm.markAllAsTouched();
      return;
    }

    const report = {
      ...this.eventForm.value,
      ...this.damageForm.value,
      ...this.contactForm.value,
    };
    console.log('[ADD-REPORT-2]', report);
  }
}