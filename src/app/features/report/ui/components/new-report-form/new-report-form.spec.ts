import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReportForm } from './new-report-form';
import { SaveReport } from '../../../domain/use-cases/save-report';

describe('NewReportForm', () => {
  let component: NewReportForm;
  let fixture: ComponentFixture<NewReportForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReportForm],
      providers: [
        { provide: SaveReport, useValue: { execute: () => Promise.resolve() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewReportForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a form', () => {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');

    expect(form).not.toBeNull();
  });
});