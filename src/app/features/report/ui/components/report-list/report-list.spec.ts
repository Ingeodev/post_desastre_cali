import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { ReportList } from './report-list';
import { ReportStore } from '../../stores/report.store';
import { ReportSummary } from '../../../domain/models/report-summary.model';

describe('ReportList', () => {
  let component: ReportList;
  let fixture: ComponentFixture<ReportList>;

  const summaries: ReportSummary[] = [
    {
      id: '1',
      addressText: 'Calle 1',
      damageCategoryId: 2,
      damageCategoryLabel: 'Daño alto',
      capturedAt: '2026-08-10T00:00:00Z',
      notes: null,
      firstPhotoUrl: null,
      source: 'remote',
    },
    {
      id: '2',
      addressText: 'Calle 2',
      damageCategoryId: 3,
      damageCategoryLabel: 'Daño leve',
      capturedAt: '2026-08-11T00:00:00Z',
      notes: null,
      firstPhotoUrl: null,
      source: 'remote',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportList],
      providers: [
        provideRouter([]),
        {
          provide: ReportStore,
          useValue: {
            summaries: signal(summaries),
            isLoading: signal(false),
            loadSummaries: (): void => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an item per summary', () => {
    const items = fixture.nativeElement.querySelectorAll(
      'app-report-list-item',
    );
    expect(items.length).toBe(2);
  });

  it('should show the empty state when there are no summaries', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ReportList],
      providers: [
        provideRouter([]),
        {
          provide: ReportStore,
          useValue: {
            summaries: signal<ReportSummary[]>([]),
            isLoading: signal(false),
            loadSummaries: (): void => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportList);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Todavía no hay reportes registrados.');
  });
});
