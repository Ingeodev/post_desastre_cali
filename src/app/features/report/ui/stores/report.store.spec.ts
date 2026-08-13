import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ReportStore } from './report.store';
import { GetReportSummaries } from '../../domain/use-cases/get-report-summaries';
import { GetDamageCategories } from '../../domain/use-cases/get-damage-categories';
import { GetConstructionTypes } from '../../domain/use-cases/get-construction-types';
import { GetDataSources } from '../../domain/use-cases/get-data-sources';
import { GetSeismicEvents } from '../../../../shared/use-cases/get-seismic-events';
import { GetDamageCatalog } from '../../domain/use-cases/get-damage-catalog';
import { ReportSummary } from '../../domain/models/report-summary.model';

describe('ReportStore', () => {
  let store: InstanceType<typeof ReportStore>;
  let getReportSummaries: { execute: ReturnType<typeof vi.fn> };

  function buildSummary(): ReportSummary {
    return {
      id: '1',
      addressText: 'Calle 1',
      damageCategoryLabel: 'Daño alto',
      capturedAt: '2026-08-10T00:00:00Z',
      notes: null,
      firstPhotoUrl: null,
    };
  }

  beforeEach(() => {
    getReportSummaries = { execute: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: GetReportSummaries, useValue: getReportSummaries },
        { provide: GetDamageCategories, useValue: { execute: () => of([]) } },
        { provide: GetConstructionTypes, useValue: { execute: () => of([]) } },
        { provide: GetDataSources, useValue: { execute: () => of([]) } },
        { provide: GetSeismicEvents, useValue: { execute: () => of([]) } },
        { provide: GetDamageCatalog, useValue: { execute: () => of([]) } },
      ],
    });

    store = TestBed.inject(ReportStore);
  });

  it('should load the summaries', async () => {
    const summaries = [buildSummary()];
    getReportSummaries.execute.mockResolvedValue(summaries);

    await store.loadSummaries();

    expect(store.summaries()).toEqual(summaries);
    expect(store.isLoading()).toBe(false);
  });

  it('should not reload while loading', async () => {
    getReportSummaries.execute.mockResolvedValue([buildSummary()]);

    const first = store.loadSummaries();
    const second = store.loadSummaries();
    await Promise.all([first, second]);

    expect(getReportSummaries.execute).toHaveBeenCalledTimes(1);
  });

  it('should select a report', () => {
    const summary = buildSummary();
    expect(store.selectedReport()).toBeNull();

    store.selectReport(summary);

    expect(store.selectedReport()).toEqual(summary);
  });
});