import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import {
  ConstructionTypes,
  DamageCategories,
  DamagePatterns,
  DataSources,
  SeismicEvents,
} from '../../../../../core/supabase-models/supabase-type-aliases';
import { InspectionPhotoEntity } from '../../../data/entities/inspection-photo.entity';
import { AddReport } from './add-report';
import { MapForm } from '../../components/map-form/map-form';
import { NewReportStore } from '../../stores/new-report.store';
import { ReportStore } from '../../stores/report.store';
import { SaveReport } from '../../../domain/use-cases/save-report';
import { SettingsStore } from '../../../../settings/ui/stores/settings.store';
import { GlobalStore } from '../../../../../shared/stores/global.store';
import { SeismicEventEntity } from '../../../../settings/data/entities/seismic-event.entity';

@Component({
  selector: 'app-map-form',
  template: '<div></div>',
})
class FakeMapForm {}

function getButton(fixture: ComponentFixture<AddReport>, label: string): HTMLButtonElement {
  const buttons = Array.from(
    fixture.nativeElement.querySelectorAll('button'),
  ) as HTMLButtonElement[];
  const button = buttons.find((b) => b.textContent?.includes(label));
  if (!button) {
    throw new Error(`Botón "${label}" no encontrado`);
  }
  return button;
}

function fakePhoto(id = 'p1'): InspectionPhotoEntity {
  return {
    id,
    inspectionId: null,
    sequence: 0,
    storagePath: null,
    blob: new Blob(['x'], { type: 'image/jpeg' }),
    mimeType: 'image/jpeg',
    takenAt: new Date().toISOString(),
    uploadedAt: null,
    syncStatus: 'PENDING_UPLOAD',
  };
}

describe('AddReport', () => {
  let component: AddReport;
  let fixture: ComponentFixture<AddReport>;
  let store: InstanceType<typeof NewReportStore>;
  const saveReport = { execute: vi.fn().mockResolvedValue(undefined) };
  const settingsStore = {
    email: signal<string | null>(null),
    event: signal<SeismicEventEntity | null>(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReport],
      providers: [
        provideRouter([]),
        {
          provide: ReportStore,
          useValue: {
            damageCategories: signal<DamageCategories[]>([]),
            constructionTypes: signal<ConstructionTypes[]>([]),
            dataSources: signal<DataSources[]>([]),
            currentSeismicEvent: signal<SeismicEvents | null>(null),
            damageCatalog: signal<DamagePatterns[]>([]),
          },
        },
        { provide: SaveReport, useValue: saveReport },
        { provide: SettingsStore, useValue: settingsStore },
        { provide: GlobalStore, useValue: { setRegistering: (): void => undefined } },
      ],
    })
      .overrideComponent(AddReport, {
        remove: { imports: [MapForm] },
        add: { imports: [FakeMapForm] },
      })
      .compileComponents();

    store = TestBed.inject(NewReportStore);
    store.resetDraft();

    fixture = TestBed.createComponent(AddReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the stepper with its title', () => {
    expect(fixture.nativeElement.textContent).toContain('Nuevo reporte de daños');
    expect(fixture.nativeElement.querySelector('app-form-stepper')).not.toBeNull();
  });

  it('should show the map as the first step', () => {
    expect(fixture.nativeElement.querySelector('app-map-form')).not.toBeNull();
  });

  it('should keep the next button disabled until a location is captured', () => {
    expect(getButton(fixture, 'Siguiente').disabled).toBe(true);

    store.setCoordinates([-76.5, 3.45]);
    fixture.detectChanges();

    expect(getButton(fixture, 'Siguiente').disabled).toBe(false);
  });

  it('should navigate to the report list on cancel', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    store.setCoordinates([-76.5, 3.45]);
    fixture.detectChanges();
    expect(store.inspection().geom).not.toBeNull();

    getButton(fixture, 'Cancelar').click();
    fixture.detectChanges();

    expect(store.inspection().geom).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/reportes']);
  });

  it('should keep the next button disabled on the description step until a construction type is chosen', () => {
    store.setCoordinates([-76.5, 3.45]);
    fixture.detectChanges();
    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();

    expect(getButton(fixture, 'Siguiente').disabled).toBe(true);

    store.updateInspection({ constructionTypeId: 1 });
    fixture.detectChanges();

    expect(getButton(fixture, 'Siguiente').disabled).toBe(false);
  });

  it('should keep the next button disabled on the occupancy step until every field is filled', () => {
    store.setCoordinates([-76.5, 3.45]);
    store.updateInspection({ constructionTypeId: 1, damageCategoryId: 2 });
    store.updateOccupancy({
      isCurrentlyOccupied: true,
      hasTrappedPeople: false,
    });
    fixture.detectChanges();

    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();
    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();
    getButton(fixture, 'Siguiente').click();
    fixture.detectChanges();

    expect(getButton(fixture, 'Siguiente').disabled).toBe(true);

    store.updateOccupancy({ estimatedResidents: 2 });
    fixture.detectChanges();

    expect(getButton(fixture, 'Siguiente').disabled).toBe(false);
  });

  it('should autofill reportedBy and seismicEventId from the settings store', () => {
    settingsStore.email.set('user@example.com');
    settingsStore.event.set({
      id: 'evt-settings',
      event_datetime: '2026-08-10 12:34:28+00',
      magnitude: 7.4,
      depth_km: 110.3,
      epicenter: 'xyz',
      source: 'USGS',
      created_at: '2026-08-10T12:34:28Z',
      name: 'Sismo settings',
    });
    fixture.detectChanges();

    expect(store.inspection().reportedBy).toBe('user@example.com');
    expect(store.inspection().seismicEventId).toBe('evt-settings');
  });

  it('should label the last step button as Enviar and save the report on finish', async () => {
    store.setCoordinates([-76.5, 3.45]);
    store.updateInspection({
      constructionTypeId: 3,
      damageCategoryId: 2,
      dataSourceId: 1,
      seismicEventId: 'evt-1',
    });
    store.updateOccupancy({
      isCurrentlyOccupied: true,
      hasTrappedPeople: false,
      estimatedResidents: 2,
    });
    store.addPhotoEntity(fakePhoto());
    fixture.detectChanges();

    for (let step = 0; step < 5; step++) {
      getButton(fixture, 'Siguiente').click();
      fixture.detectChanges();
    }

    const sendButton = getButton(fixture, 'Enviar');
    expect(sendButton.disabled).toBe(false);

    sendButton.click();
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(saveReport.execute).toHaveBeenCalledTimes(1);
    });
    expect(store.inspection().geom).toBeNull();
  });
});