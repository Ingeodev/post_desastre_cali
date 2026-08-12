import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Stepp } from '../stepp/stepp';

@Component({
  selector: 'app-form-stepper',
  imports: [ButtonModule],
  templateUrl: './form-stepper.html',
  styleUrl: './form-stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepper {
  readonly title = input.required<string>();

  readonly cancel = output<void>();
  readonly finish = output<void>();

  readonly stepsRef = contentChildren(Stepp);

  readonly currentPosition = signal(0);

  readonly steps = computed(() =>
    [...this.stepsRef()].sort((a, b) => a.position() - b.position()),
  );

  readonly currentStep = computed(() => this.steps()[this.currentPosition()] ?? null);

  readonly isOnLastStep = computed(
    () => this.currentPosition() === this.steps().length - 1,
  );

  readonly stepLabel = computed(
    () => `Paso ${this.currentPosition() + 1} de ${this.steps().length}`,
  );

  readonly isCurrentStepValid = computed(() => {
    const validate = this.currentStep()?.validate() ?? (() => true);
    return typeof validate === 'function' ? validate() : validate;
  });

  constructor() {
    effect(() => {
      const position = this.currentPosition();
      for (const step of this.stepsRef()) {
        step.setActive(step.position() === position);
      }
    });
  }

  onBack(): void {
    this.currentPosition.update((position) => Math.max(0, position - 1));
  }

  onNext(): void {
    if (!this.isCurrentStepValid()) {
      return;
    }

    if (this.isOnLastStep()) {
      this.finish.emit();
      return;
    }

    this.currentPosition.update((position) => position + 1);
  }
}