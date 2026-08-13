import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapForm } from './map-form';
import { SaveReport } from '../../../domain/use-cases/save-report';
import { GlobalStore } from '../../../../../shared/stores/global.store';
import { NewReportStore } from '../../stores/new-report.store';
import { MapStore } from '../../stores/map.store';

vi.mock('@maplibre/ngx-maplibre-gl', async () => {
  const { Component } = await import('@angular/core');

  const MapComponent = Component({
    selector: 'mgl-map',
    template: '<div></div>',
  })(class MapComponent {});

  const GeoJSONSourceComponent = Component({
    selector: 'mgl-geojson-source',
    template: '',
  })(class GeoJSONSourceComponent {});

  const LayerComponent = Component({
    selector: 'mgl-layer',
    template: '',
  })(class LayerComponent {});

  return {
    MapComponent,
    GeoJSONSourceComponent,
    LayerComponent,
  };
});

describe('MapForm', () => {
  let component: MapForm;
  let fixture: ComponentFixture<MapForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapForm],
      providers: [
        { provide: SaveReport, useValue: { execute: () => Promise.resolve() } },
        { provide: GlobalStore, useValue: { setRegistering: (): void => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the recapture button only after the location is captured', async () => {
    component.store.toggleIndication();
    fixture.detectChanges();

    component.store.changeStatus('idle');
    fixture.detectChanges();

    const idleButtons = fixture.nativeElement.querySelectorAll('button');
    const idleRecapture = Array.from(idleButtons).filter((button) =>
      (button as HTMLButtonElement).textContent?.includes('Volver a capturar'),
    );
    expect(idleRecapture.length).toBe(0);

    component.store.changeStatus('captured');
    fixture.detectChanges();

    const capturedButtons = fixture.nativeElement.querySelectorAll('button');
    const capturedRecapture = Array.from(capturedButtons).filter((button) =>
      (button as HTMLButtonElement).textContent?.includes('Volver a capturar'),
    );
    expect(capturedRecapture.length).toBe(1);
  });

  it('should clear the report coordinates and reset the map on recapture', () => {
    const mapStore = TestBed.inject(MapStore);
    const newReportStore = TestBed.inject(NewReportStore);

    component.store.toggleIndication();
    newReportStore.setCoordinates([-76.5, 3.45]);
    mapStore.changeStatus('captured');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const recapture = Array.from(buttons).find((button) =>
      (button as HTMLButtonElement).textContent?.includes('Volver a capturar'),
    ) as HTMLButtonElement;
    recapture.click();
    fixture.detectChanges();

    expect(newReportStore.report().geom).toBeNull();
    expect(mapStore.status()).toBe('idle');
  });
});