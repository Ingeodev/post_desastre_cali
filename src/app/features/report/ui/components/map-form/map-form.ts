import { Component } from '@angular/core';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'app-map-form',
  imports: [MapComponent],
  templateUrl: './map-form.html',
  styleUrl: './map-form.css',
})
export class MapForm {

}
