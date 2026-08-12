import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AddReport2 } from './add-report-2';

function getButton(fixture: ComponentFixture<AddReport2>, label: string): HTMLButtonElement {
  const buttons = Array.from(
    fixture.nativeElement.querySelectorAll('button'),
  ) as HTMLButtonElement[];
  const button = buttons.find((b) => b.textContent?.includes(label));
  if (!button) {
    throw new Error(`Botón "${label}" no encontrado`);
  }
  return button;
}

describe('AddReport2', () => {
  let component: AddReport2;
  let fixture: ComponentFixture<AddReport2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReport2],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReport2);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the stepper with its title', () => {
    expect(fixture.nativeElement.textContent).toContain('Nuevo reporte de daños');
    expect(fixture.nativeElement.querySelector('app-form-stepper')).not.toBeNull();
  });

  it('should show the first step form and its fields', () => {
    expect(fixture.nativeElement.querySelector('#addressText')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#municipality')).not.toBeNull();
  });

  it('should keep the next button disabled while the current form is invalid', () => {
    expect(getButton(fixture, 'Siguiente').disabled).toBe(true);
  });

  it('should enable the next button once the current form is valid', () => {
    const addressText = fixture.nativeElement.querySelector('#addressText') as HTMLInputElement;
    const municipality = fixture.nativeElement.querySelector('#municipality') as HTMLInputElement;

    addressText.value = 'Cra 5 # 10-20';
    addressText.dispatchEvent(new Event('input'));
    municipality.value = 'Comuna 3';
    municipality.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(getButton(fixture, 'Siguiente').disabled).toBe(false);
  });

  it('should navigate to the report list on cancel', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    getButton(fixture, 'Cancelar').click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/reportes']);
  });
});