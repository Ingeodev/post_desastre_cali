import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import type { StyleSpecification } from 'maplibre-gl';
import { GeoJsonPoint } from '../../../data/entities/inspection.entity';
import { ReportLayer } from '../report-layer/report-layer';

const DEFAULT_ZOOM = 14;

const GOOGLE_MAPS_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'google-maps': {
      type: 'raster',
      tiles: ['https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'],
      tileSize: 256,
      attribution: '© Google Maps',
    },
  },
  layers: [
    {
      id: 'google-maps',
      type: 'raster',
      source: 'google-maps',
    },
  ],
};

@Component({
  selector: 'app-report-detail-map',
  imports: [MapComponent, ReportLayer],
  templateUrl: './report-detail-map.html',
  styleUrl: './report-detail-map.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDetailMap {
  readonly location = input.required<GeoJsonPoint | null>();

  readonly mapStyle = GOOGLE_MAPS_STYLE;
  readonly zoom = signal(DEFAULT_ZOOM);

  readonly center = computed(() => {
    const location = this.location();

    if (!location) {
      return [-76.5225, 3.4516] as [number, number];
    }

    return location.coordinates;
  });
}