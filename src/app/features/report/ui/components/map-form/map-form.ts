import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { GeoLocation } from '../../../../../core/sensors/location/location.service';

const CALI_CENTER: L.LatLngExpression = [3.4516, -76.532];
const DEFAULT_ZOOM = 13;

const ACCURACY_CIRCLE_OPTIONS: L.CircleOptions = {
  stroke: true,
  color: '#4285f4',
  weight: 1.5,
  opacity: 0.7,
  fillColor: '#4285f4',
  fillOpacity: 0.12,
};

const LOCATION_DOT_OPTIONS: L.CircleMarkerOptions = {
  radius: 7,
  stroke: true,
  color: '#ffffff',
  weight: 2,
  fillColor: '#1a73e8',
  fillOpacity: 1,
};

@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.html',
  styleUrl: './map-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapForm {
  readonly location = input<GeoLocation | null>(null);

  private readonly mapNode = viewChild<ElementRef<HTMLDivElement>>('map');

  private readonly mapReady = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  private map?: L.Map;
  private locationLayer?: L.LayerGroup;
  private hasCentered = false;

  constructor() {
    afterNextRender(() => {
      this.initializeMap();
    });

    this.destroyRef.onDestroy(() => {
      this.map?.remove();
      this.map = undefined;
    });

    effect(() => {
      this.mapReady();
      this.syncLocation(this.location());
    });
  }

  private initializeMap(): void {
    const container = this.mapNode()?.nativeElement;

    if (!container) {
      return;
    }

    this.map = L.map(container, {
      center: CALI_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.mapReady.set(true);
  }

  private syncLocation(location: GeoLocation | null): void {
    const map = this.map;

    if (!map) {
      return;
    }

    this.locationLayer?.clearLayers();

    if (!location) {
      return;
    }

    if (!this.locationLayer) {
      this.locationLayer = L.layerGroup().addTo(map);
    }

    const position: L.LatLngExpression = [location.lat, location.lng];

    L.circle(position, {
      ...ACCURACY_CIRCLE_OPTIONS,
      radius: location.accuracy,
    }).addTo(this.locationLayer);
    L.circleMarker(position, LOCATION_DOT_OPTIONS).addTo(this.locationLayer);

    this.centerOnce(location);
  }

  private centerOnce(location: GeoLocation): void {
    if (this.hasCentered || !this.map) {
      return;
    }

    this.hasCentered = true;

    const accuracyBounds = L.circle([location.lat, location.lng], {
      radius: location.accuracy,
    }).getBounds();

    this.map.fitBounds(accuracyBounds.pad(0.3), { animate: true });
  }
}
