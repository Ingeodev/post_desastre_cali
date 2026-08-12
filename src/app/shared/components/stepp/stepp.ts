import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export type StepValidator = boolean | (() => boolean);

@Component({
  selector: 'app-stepp',
  imports: [],
  templateUrl: './stepp.html',
  styleUrl: './stepp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stepp {
  readonly position = input.required<number>();
  readonly validate = input<StepValidator>(() => true);

  readonly active = signal(false);

  setActive(active: boolean): void {
    this.active.set(active);
  }
}