import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Subscription } from 'rxjs';
import { GeoLocation } from '../../../../core/sensors/location/location.service';
import { ListenLocation } from '../../domain/use-cases/listen-location';

const CALI_CENTER: [number, number] = [-76.5225, 3.4516];

export type MapStatus = 'idle' |'captured' | 'error';
export type MapMode = 'default' | 'capturing'

export interface MapState {
  status: MapStatus;
  showIndication: boolean,
  mode: MapMode;
  error?: Error;
  center: [number, number];
  location: GeoLocation | null;
}


const initialState: MapState = {
  status: 'idle',
  mode: 'default',
  showIndication: true,
  center: CALI_CENTER,
  location: null,
};

export const MapStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    listenLocation: inject(ListenLocation),
  })),
  withMethods((store) => {
    let locationSubscription: Subscription | undefined;
    let centeredOnUser = false;

    return {
      listenToLocation(): void {
        if (locationSubscription) {
          return;
        }

        locationSubscription = store.listenLocation.execute().subscribe({
          next: (result) => {
            if (!result.isSuccess) {
              patchState(store, { status: 'error', error: result.error });
              return;
            }

            const location = result.value;

            if (!centeredOnUser) {
              patchState(store, { location, center: [location.lng, location.lat] });
              centeredOnUser = true;
            } else {
              patchState(store, { location });
            }
          },
        });
      },
      stopListening(): void {
        locationSubscription?.unsubscribe();
        locationSubscription = undefined;
      },

      changeMode(m: MapMode): void {
        patchState(store, {
           mode: m, 
        })
      },

      setCenter(lng: number, lat: number) {
        const [currentLng, currentLat] = store.center();
        if (Math.abs(currentLng - lng) < 1e-9 && Math.abs(currentLat - lat) < 1e-9) {
          return;
        }
        patchState(store, {
           center: [lng, lat], 
        })
      },

      toggleIndication() {
        patchState(store, {
           showIndication: !store.showIndication() 
        })
      },

      changeStatus(status: MapStatus) {
        patchState(store, {
          status: status
        })
      },

      reset() {
        centeredOnUser = false;
        patchState(store, { ...initialState });
      }
    };
  }),
  withHooks({
    onInit(store) {
      store.listenToLocation();
    },
    onDestroy(store) {
      store.stopListening();
    },
  }),
);
