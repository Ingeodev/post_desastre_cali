import { Component, computed, input } from '@angular/core';
import {
  GeoJSONSourceComponent,
  LayerComponent,
} from '@maplibre/ngx-maplibre-gl';

type Point = [number, number];


@Component({
  selector: 'app-report-layer',
  imports: [
      GeoJSONSourceComponent,
  LayerComponent,
  ],
  templateUrl: './report-layer.html',
  styleUrl: './report-layer.css',
})
export class ReportLayer {

  location = input.required<{
    type: "Point";
    coordinates: [number, number];
  }>()

  readonly markerPaint = {
    'circle-color': '#000000',
    'circle-radius': 10,
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 3,
  };

  readonly markerSource = computed(() => {
    const location = this.location();

    if (!location) {
      return {
        type: 'FeatureCollection' as const,
        features: [],
      };
    }

    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: this.location(),
        },
      ],
    };
  });
}
