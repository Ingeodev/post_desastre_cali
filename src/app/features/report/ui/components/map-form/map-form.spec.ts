import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapForm } from './map-form';
import { SaveReport } from '../../../domain/use-cases/save-report';

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});