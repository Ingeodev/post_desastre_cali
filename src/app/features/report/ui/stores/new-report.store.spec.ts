import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { NewReportStore } from './new-report.store';
import { SaveReport } from '../../domain/use-cases/save-report';

describe('NewReportStore', () => {
  let store: InstanceType<typeof NewReportStore>;
  let saveReport: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    saveReport = { execute: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: SaveReport, useValue: saveReport }],
    });

    store = TestBed.inject(NewReportStore);
    store.resetDraft();
  });

  it('should create the draft with a createdAt timestamp', () => {
    expect(store.inspection().createdAt).toBeTruthy();
    expect(Number.isNaN(Date.parse(store.inspection().createdAt))).toBe(false);
    expect(store.inspection().capturedAt).toBe(store.inspection().createdAt);
  });

  it('should throw when building entities with incomplete data', () => {
    expect(() => store.buildEntities()).toThrow(
      'Incomplete report: required inspection fields are missing',
    );
  });

  it('should carry the draft createdAt into the built inspection entity', () => {
    store.setCoordinates([-76.5, 3.45]);
    store.updateInspection({
      damageCategoryId: 2,
      dataSourceId: 1,
      seismicEventId: 'evt-1',
    });

    const { inspection } = store.buildEntities();

    expect(inspection.createdAt).toBe(store.inspection().createdAt);
    expect(inspection.capturedAt).toBe(store.inspection().capturedAt);
  });

  it('should save the built entities and reset the draft on success', async () => {
    saveReport.execute.mockResolvedValue(undefined);

    store.setCoordinates([-76.5, 3.45]);
    store.updateInspection({
      damageCategoryId: 2,
      dataSourceId: 1,
      seismicEventId: 'evt-1',
    });
    store.save();

    await vi.waitFor(() => {
      expect(saveReport.execute).toHaveBeenCalledTimes(1);
    });
    expect(store.inspection().geom).toBeNull();
  });

  it('should keep the draft when saving fails', async () => {
    saveReport.execute.mockRejectedValue(new Error('boom'));

    store.setCoordinates([-76.5, 3.45]);
    store.updateInspection({
      damageCategoryId: 2,
      dataSourceId: 1,
      seismicEventId: 'evt-1',
    });
    store.save();

    await vi.waitFor(() => {
      expect(saveReport.execute).toHaveBeenCalledTimes(1);
    });
    expect(store.inspection().geom).not.toBeNull();
  });
});
