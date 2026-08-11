import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

const HIGH_ACCURACY_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

@Injectable({ providedIn: 'root' })
export class LocationService {
  listen(): Observable<GeoLocation> {
    return new Observable<GeoLocation>((subscriber) => {
      if (!navigator.geolocation) {
        subscriber.error(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          subscriber.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          subscriber.error(error);
        },
        HIGH_ACCURACY_OPTIONS,
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    });
  }
}
