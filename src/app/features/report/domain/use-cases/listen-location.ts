import { Observable } from 'rxjs';
import { GeoLocation, LocationService } from '../../../../core/sensors/location/location.service';

export class ListenLocation {
  constructor(private readonly locationService: LocationService) {}

  execute(): Observable<GeoLocation> {
    return this.locationService.listen();
  }
}
