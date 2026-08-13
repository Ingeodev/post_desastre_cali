import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { ReportDetailPatterns } from './report-detail-patterns';
import { ReportStore } from '../../stores/report.store';
import { InspectionPatternEntity } from '../../../data/entities/inspection-pattern.entity';

describe('ReportDetailPatterns', () => {
  let component: ReportDetailPatterns;
  let fixture: ComponentFixture<ReportDetailPatterns>;

  const patterns: InspectionPatternEntity[] = [
    { inspectionId: 'abc', patternId: 1 },
    { inspectionId: 'abc', patternId: 5 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailPatterns],
      providers: [
        {
          provide: ReportStore,
          useValue: {
            damageCatalog: signal([
              { id: 1, label: 'Grietas diagonales' },
              { id: 5, label: 'Columna partida' },
            ]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetailPatterns);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('patterns', patterns);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the pattern labels from the catalog', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Grietas diagonales');
    expect(compiled.textContent).toContain('Columna partida');
  });
});