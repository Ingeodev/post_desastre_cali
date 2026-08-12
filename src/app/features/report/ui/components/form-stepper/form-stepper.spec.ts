import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStepper } from './form-stepper';

describe('FormStepper', () => {
  let component: FormStepper;
  let fixture: ComponentFixture<FormStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(FormStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
