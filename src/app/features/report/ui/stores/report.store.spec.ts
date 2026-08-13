import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, Subject } from 'rxjs';
import { ReportStore } from './report.store';
import { GetReportSummaries } from '../../domain/use-cases/get-report-summaries';
import { GetLocalReportSummaries } from '../../domain/use-cases/get-local-report-summaries';
import { GetDamageCategories } from '../../domain/use-cases/get-damage-categories';
import { GetConstructionTypes } from '../../domain/use-cases/get-construction-types';
import { GetDataSources } from '../../domain/use-cases/get-data-sources';
import { GetSeismicEvents } from '../../../../shared/use-cases/get-seismic-events';
import { GetDamageCatalog } from '../../domain/use-cases/get-damage-catalog';
import { IndexedDbReportRepository } from '../../data/local/indexeddb-report.repository';
import { SyncReportsUseCase } from '../../domain/use-cases/sync-reports';
import { ReportSummary } from '../../domain/models/report-summary.model';

describe('ReportStore', () => {
  let store: InstanceType<typeof ReportStore>;
  let getReportSummaries: { execute: ReturnType<typeof vi.fn> };
  let getLocalReportSummaries: { execute: ReturnType<typeof vi.fn> };
  let getDamageCategories: { execute: ReturnType<typeof vi.fn> };
  let localChanges: Subject<void>;
  let remoteChanges: Subject<void>;

  function buildSummary(source: 'local' | 'remote', id = '1'): ReportSummary {
    return {
      id,
      addressText: 'Calle 1',
      damageCategoryId: 2,
      damageCategoryLabel: null,
      capturedAt: '2026-08-10T00:00:00Z',
      notes: null,
      firstPhotoUrl: null,
      source,
    };
  }

  function injectStore(): void {
    store = TestBed.inject(ReportStore);
  }

  beforeEach(() => {
    getReportSummaries = { execute: vi.fn() };
    getLocalReportSummaries = { execute: vi.fn() };
    getDamageCategories = { execute: vi.fn().mockReturnValue(of([])) };
    localChanges = new Subject<void>();
    remoteChanges = new Subject<void>();

    TestBed.configureTestingModule({
      providers: [
        { provide: GetReportSummaries, useValue: getReportSummaries },
        { provide: GetLocalReportSummaries, useValue: getLocalReportSummaries },
        { provide: GetDamageCategories, useValue: getDamageCategories },
        { provide: GetConstructionTypes, useValue: { execute: () => of([]) } },
        { provide: GetDataSources, useValue: { execute: () => of([]) } },
        { provide: GetSeismicEvents, useValue: { execute: () => of([]) } },
        { provide: GetDamageCatalog, useValue: { execute: () => of([]) } },
        {
          provide: IndexedDbReportRepository,
          useValue: { changes$: localChanges },
        },
        { provide: SyncReportsUseCase, useValue: { changed$: remoteChanges } },
      ],
    });
  });

  it('should load local and remote summaries', async () => {
    getLocalReportSummaries.execute.mockResolvedValue([buildSummary('local')]);
    getReportSummaries.execute.mockResolvedValue([buildSummary('remote')]);
    injectStore();

    await store.loadSummaries();

    expect(store.localSummaries()).toEqual([buildSummary('local')]);
    expect(store.remoteSummaries()).toEqual([buildSummary('remote')]);
    expect(store.isLoading()).toBe(false);
  });

  it('should show local summaries by default', async () => {
    getLocalReportSummaries.execute.mockResolvedValue([buildSummary('local')]);
    getReportSummaries.execute.mockResolvedValue([]);
    injectStore();

    await store.loadSummaries();

    expect(store.activeSource()).toBe('local');
    expect(store.summaries()).toEqual([buildSummary('local')]);
  });

  it('should show remote summaries when the source is remote', async () => {
    getLocalReportSummaries.execute.mockResolvedValue([
      buildSummary('local'),
    ]);
    getReportSummaries.execute.mockResolvedValue([buildSummary('remote')]);
    injectStore();

    await store.loadSummaries();
    store.setSource('remote');

    expect(store.activeSource()).toBe('remote');
    expect(store.summaries()).toEqual([buildSummary('remote')]);
  });

  it('should resolve the local category label from the catalog', async () => {
    getDamageCategories.execute.mockReturnValue(
      of([{ id: 2, label: 'Daño alto', code: 'high', description: 'Fisuras' }]),
    );
    getLocalReportSummaries.execute.mockResolvedValue([buildSummary('local')]);
    getReportSummaries.execute.mockResolvedValue([]);
    injectStore();

    await store.loadSummaries();

    expect(store.summaries()[0].damageCategoryLabel).toBe('Daño alto');
  });

  it('should reload local summaries when local data changes', async () => {
    const summary = buildSummary('local');
    getLocalReportSummaries.execute.mockResolvedValue([summary]);
    injectStore();

    localChanges.next();

    await vi.waitFor(() =>
      expect(store.localSummaries()).toEqual([summary]),
    );
  });

  it('should reload remote summaries when sync completes', async () => {
    const summary = buildSummary('remote');
    getReportSummaries.execute.mockResolvedValue([summary]);
    injectStore();

    remoteChanges.next();

    await vi.waitFor(() =>
      expect(store.remoteSummaries()).toEqual([summary]),
    );
  });

  it('should not reload while loading', async () => {
    getLocalReportSummaries.execute.mockResolvedValue([]);
    getReportSummaries.execute.mockResolvedValue([]);
    injectStore();

    const first = store.loadSummaries();
    const second = store.loadSummaries();
    await Promise.all([first, second]);

    expect(getReportSummaries.execute).toHaveBeenCalledTimes(1);
  });

  it('should select a report', () => {
    injectStore();
    const summary = buildSummary('local');
    expect(store.selectedReport()).toBeNull();

    store.selectReport(summary);

    expect(store.selectedReport()).toEqual(summary);
  });
});
