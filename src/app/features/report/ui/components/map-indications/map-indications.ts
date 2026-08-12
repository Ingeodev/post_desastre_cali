import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { MapStore } from '../../stores/map.store';

@Component({
  selector: 'app-map-indications',
  imports: [Button],
  templateUrl: './map-indications.html',
  styleUrl: './map-indications.css',
})
export class MapIndications {
  store = inject(MapStore)
}
