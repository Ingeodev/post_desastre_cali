import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailMap } from './report-detail-map';

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

describe('ReportDetailMap', () => {
  let component: ReportDetailMap;
  let fixture: ComponentFixture<ReportDetailMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailMap],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetailMap);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('location', {
      type: 'Point',
      coordinates: [-76.5225, 3.4516],
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should center the map on the report location', () => {
    expect(component.center()).toEqual([-76.5225, 3.4516]);
  });
});