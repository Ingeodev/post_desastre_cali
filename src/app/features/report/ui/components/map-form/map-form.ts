import { Component, inject, signal } from '@angular/core';
import { EventData, MapComponent } from '@maplibre/ngx-maplibre-gl';
import { MapLibreEvent, type StyleSpecification } from 'maplibre-gl';
import { MapStore } from '../../stores/map.store';
import { UserLocationLayer } from '../user-location-layer/user-location-layer';
import { ButtonModule } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugePinLocation03 } from '@ng-icons/huge-icons';
import { hugeCursorPointer02 } from '@ng-icons/huge-icons';
import { matPointScanFillRound } from '@ng-icons/material-symbols/round';
import { MapIndications } from "../map-indications/map-indications";

const DEFAULT_ZOOM = 13;

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
  selector: 'app-map-form',
  imports: [MapComponent, UserLocationLayer, ButtonModule, NgIcon, MapIndications],
  providers: [provideIcons({ hugePinLocation03, hugeCursorPointer02, matPointScanFillRound })],
  templateUrl: './map-form.html',
  styleUrl: './map-form.css',
})
export class MapForm {

  readonly store = inject(MapStore);

  readonly mapStyle = GOOGLE_MAPS_STYLE;
  readonly zoom = signal(DEFAULT_ZOOM);

  onUserInteraction(): void {
    this.store.stopFollowing();
  }

  enableCapturing () {
      this.store.changeMode('capturing')
  }

  cancelCapturing(){
    this.store.changeMode('default')
  }

  onDragEnd(event: MapLibreEvent) {
    let center = event.target.getCenter()
    this.store.setCenter(center.lng, center.lat)
  }

  setCenterAsReportLocation(){
    //Usar el centro del store como localizacion del reporte
  }

  setUserLocationAsReportLocation(){
    //Usar la ubicacion del usuario que esta en el store como localizacion del reporte
  }


}