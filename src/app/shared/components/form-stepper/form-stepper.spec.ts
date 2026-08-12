import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormStepper } from './form-stepper';
import { Stepp } from '../stepp/stepp';

@Component({
  template: `
    <app-form-stepper
      [title]="'Título de prueba'"
      (cancel)="onCancel()"
      (finish)="onFinish()"
    >
      <app-stepp [position]="0" [validate]="firstValid()">
        <p data-step="0">Contenido paso 1</p>
      </app-stepp>
      <app-stepp [position]="1" [validate]="() => true">
        <p data-step="1">Contenido paso 2</p>
      </app-stepp>
    </app-form-stepper>
  `,
  imports: [FormStepper, Stepp],
})
class HostComponent {
  readonly firstValid = signal(true);
  cancelled = false;
  finished = false;

  onCancel(): void {
    this.cancelled = true;
  }

  onFinish(): void {
    this.finished = true;
  }
}

function getButton(fixture: ComponentFixture<HostComponent>, label: string): HTMLButtonElement {
  const buttons = Array.from(
    fixture.nativeElement.querySelectorAll('button'),
  ) as HTMLButtonElement[];
  const button = buttons.find((b) => b.textContent?.includes(label));
  if (!button) {
    throw new Error(`Botón "${label}" no encontrado`);
  }
  return button;
}

describe('FormStepper', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the title', () => {
    expect(fixture.nativeElement.textContent).toContain('Título de prueba');
  });

  it('should show only the first step initially', () => {
    expect(fixture.nativeElement.querySelector('[data-step="0"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-step="1"]')).toBeNull();
  });

  it('should keep the next button disabled while the current step is invalid', () => {
    component.firstValid.set(false);
    fixture.detectChanges();

    expect(getButton(fixture, 'Siguiente').disabled).toBe(true);
  });

  it('should not advance when the current step is invalid', () => {
    component.firstValid.set(false);
    fixture.detectChanges();

    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-step="0"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-step="1"]')).toBeNull();
  });

  it('should advance to the next step when the current step is valid', () => {
    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-step="0"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-step="1"]')).not.toBeNull();
  });

  it('should emit finish on the last step', () => {
    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();

    expect(getButton(fixture, 'Finalizar').disabled).toBe(false);
    getButton(fixture, 'Finalizar').click();
    fixture.detectChanges();

    expect(component.finished).toBe(true);
  });

  it('should disable the back button on the first step', () => {
    expect(getButton(fixture, 'Atrás').disabled).toBe(true);
  });

  it('should go back when not on the first step', () => {
    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();

    expect(getButton(fixture, 'Atrás').disabled).toBe(false);
    getButton(fixture, 'Atrás').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-step="0"]')).not.toBeNull();
  });

  it('should emit cancel when the cancel button is clicked', () => {
    getButton(fixture, 'Cancelar').click();
    fixture.detectChanges();

    expect(component.cancelled).toBe(true);
  });
});