import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/utils/result';

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
  listen(): Observable<Result<GeoLocation>> {
    return new Observable<Result<GeoLocation>>((subscriber) => {
      if (!navigator.geolocation) {
        subscriber.next(
          Result.error<GeoLocation>(new Error('Geolocation is not supported by this browser.')),
        );
        subscriber.complete();
        return () => {};
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          subscriber.next(
            Result.success<GeoLocation>({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
            }),
          );
        },
        (error) => {
          subscriber.next(Result.error<GeoLocation>(this.mapPositionError(error)));
        },
        HIGH_ACCURACY_OPTIONS,
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    });
  }

  private mapPositionError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return new Error('Location permission denied by user.');
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return new Error('Location position unavailable.');
      case GeolocationPositionError.TIMEOUT:
        return new Error('Location request timed out.');
      default:
        return new Error(error.message);
    }
  }
}
