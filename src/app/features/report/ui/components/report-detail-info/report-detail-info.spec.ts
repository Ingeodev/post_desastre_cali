import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { ReportDetailInfo } from './report-detail-info';
import { ReportStore } from '../../stores/report.store';
import { ReportProfile } from '../../../domain/models/report-profile.model';
import { InspectionEntity } from '../../../data/entities/inspection.entity';

describe('ReportDetailInfo', () => {
  let component: ReportDetailInfo;
  let fixture: ComponentFixture<ReportDetailInfo>;

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
    approxYearBuilt: 1990,
    notes: 'Grietas en muros',
    numFloors: 3,
    reportedBy: 'Miguel',
    createdAt: null,
    syncedAt: null,
  };

  const profile: ReportProfile = {
    inspection,
    occupancy: {
      id: 'occ-1',
      inspectionId: 'abc',
      createdAt: '2026-08-10T00:00:00Z',
      estimatedResidents: 4,
      hasTrappedPeople: false,
      isCurrentlyOccupied: true,
    },
    patterns: [],
    photos: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailInfo],
      providers: [
        {
          provide: ReportStore,
          useValue: {
            damageCategories: signal([
              { id: 2, code: 'D2', label: 'Daño moderado' },
            ]),
            constructionTypes: signal([]),
            dataSources: signal([{ id: 1, code: 'W', label: 'Web' }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetailInfo);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', profile);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the profile information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Calle 1');
    expect(compiled.textContent).toContain('Daño moderado');
    expect(compiled.textContent).toContain('3');
    expect(compiled.textContent).toContain('1990');
  });
});