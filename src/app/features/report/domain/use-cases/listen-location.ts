import { Observable } from 'rxjs';
import {
  GeoLocation,
  LocationService,
} from '../../../../core/sensors/location/location.service';
import { Result } from '../../../../shared/utils/result';
import { inject, Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ListenLocation {
  locationService = inject(LocationService);

  execute(): Observable<Result<GeoLocation>> {

    return this.locationService.listen();
  }
}