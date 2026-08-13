import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ProfileStore } from './profile.store';
import { GetReportProfile } from '../../domain/use-cases/get-report-profile';
import { ReportProfile } from '../../domain/models/report-profile.model';
import { InspectionEntity } from '../../data/entities/inspection.entity';

describe('ProfileStore', () => {
  let store: InstanceType<typeof ProfileStore>;
  let getReportProfile: { execute: ReturnType<typeof vi.fn> };

  function buildProfile(): ReportProfile {
    const inspection: InspectionEntity = {
      id: 'abc',
      deviceLocalId: 'device-1',
      capturedAt: '2026-08-10T00:00:00Z',
      geom: null,
      damageCategoryId: 2,
      dataSourceId: 1,
      seismicEventId: 'evt-1',
      constructionTypeId: null,
      deviceId: null,
      addressText: 'Calle 1',
      approxYearBuilt: null,
      notes: null,
      numFloors: null,
      reportedBy: null,
      createdAt: null,
      syncedAt: null,
    };

    return { inspection, occupancy: null, patterns: [], photos: [] };
  }

  beforeEach(() => {
    getReportProfile = { execute: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: GetReportProfile, useValue: getReportProfile },
      ],
    });

    store = TestBed.inject(ProfileStore);
    store.reset();
  });

  it('should be idle at the start', () => {
    expect(store.isLoading()).toBe(false);
    expect(store.profile()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('should load the profile on success', async () => {
    const profile = buildProfile();
    getReportProfile.execute.mockResolvedValue(profile);

    await store.load('abc');

    expect(store.profile()).toEqual(profile);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should set an error when the profile does not exist', async () => {
    getReportProfile.execute.mockResolvedValue(undefined);

    await store.load('missing');

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('No existe un reporte con ese identificador.');
  });

  it('should set an error when the request fails', async () => {
    getReportProfile.execute.mockRejectedValue(new Error('network'));

    await store.load('abc');

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('No se pudo cargar el detalle del reporte.');
  });

  it('should reset to the initial state', async () => {
    getReportProfile.execute.mockResolvedValue(buildProfile());
    await store.load('abc');

    store.reset();

    expect(store.profile()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });
});