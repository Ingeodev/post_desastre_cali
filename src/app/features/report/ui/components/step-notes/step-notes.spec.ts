import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { StepNotes } from './step-notes';
import { NewReportStore } from '../../stores/new-report.store';
import { SaveReport } from '../../../domain/use-cases/save-report';

describe('StepNotes', () => {
  let component: StepNotes;
  let fixture: ComponentFixture<StepNotes>;
  let store: InstanceType<typeof NewReportStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepNotes],
      providers: [{ provide: SaveReport, useValue: { execute: vi.fn() } }],
    }).compileComponents();

    store = TestBed.inject(NewReportStore);
    store.resetDraft();

    fixture = TestBed.createComponent(StepNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write the typed notes into the store', () => {
    const textarea = fixture.nativeElement.querySelector('#notes') as HTMLTextAreaElement;

    textarea.value = 'Edificio con rajaduras en la fachada';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(store.inspection().notes).toBe('Edificio con rajaduras en la fachada');
  });

  it('should rehydrate the textarea from the store', () => {
    store.updateInspection({ notes: 'Nota previa guardada' });

    const fresh = TestBed.createComponent(StepNotes);
    fresh.detectChanges();
    const textarea = fresh.nativeElement.querySelector('#notes') as HTMLTextAreaElement;

    expect(textarea.value).toBe('Nota previa guardada');
    fresh.destroy();
  });
});