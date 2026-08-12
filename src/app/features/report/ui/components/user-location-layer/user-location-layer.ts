import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  GeoJSONSourceComponent,
  LayerComponent,
} from '@maplibre/ngx-maplibre-gl';
import { MapStore } from '../../stores/map.store';

const EARTH_RADIUS = 6_371_000;
const BUFFER_SEGMENTS = 32;

type Point = [number, number];

@Component({
  selector: 'app-user-location-layer',
  imports: [
    GeoJSONSourceComponent,
    LayerComponent,
  ],
  templateUrl: './user-location-layer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLocationLayer {
  private readonly store = inject(MapStore);

  readonly location = this.store.location;

  /**
   * Generates a geographic circle in meters.
   */
  readonly accuracySource = computed(() => {
    const location = this.location();

    if (!location) {
      return {
        type: 'FeatureCollection' as const,
        features: [],
      };
    }

    const coordinates: Point[] = [];

    const lat = location.lat * Math.PI / 180;
    const lng = location.lng * Math.PI / 180;
    const angularDistance = location.accuracy / EARTH_RADIUS;

    for (let i = 0; i <= BUFFER_SEGMENTS; i++) {
      const bearing = (i / BUFFER_SEGMENTS) * Math.PI * 2;

      const pointLat = Math.asin(
        Math.sin(lat) * Math.cos(angularDistance) +
        Math.cos(lat) *
          Math.sin(angularDistance) *
          Math.cos(bearing),
      );

      const pointLng =
        lng +
        Math.atan2(
          Math.sin(bearing) *
            Math.sin(angularDistance) *
            Math.cos(lat),
          Math.cos(angularDistance) -
            Math.sin(lat) * Math.sin(pointLat),
        );

      coordinates.push([
        pointLng * 180 / Math.PI,
        pointLat * 180 / Math.PI,
      ]);
    }

    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: [coordinates],
          },
        },
      ],
    };
  });

  /**
   * Point used by the visual location marker.
   */
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
          geometry: {
            type: 'Point' as const,
            coordinates: [location.lng, location.lat] as Point,
          },
        },
      ],
    };
  });

  readonly accuracyFillPaint = {
    'fill-color': '#4285F4',
    'fill-opacity': 0.15,
  };

  readonly accuracyOutlinePaint = {
    'line-color': '#4285F4',
    'line-width': 1,
    'line-opacity': 0.25,
  };

  readonly markerPaint = {
    'circle-color': '#4285F4',
    'circle-radius': 7,
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 3,
  };
}