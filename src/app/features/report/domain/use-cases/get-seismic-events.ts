import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SeismicEvents } from '../../../../core/supabase-models/supabase-type-aliases';

const DATA: SeismicEvents[] = [{
  id: 'bda05606-8c1e-43e7-b13e-bdf828a9bd42',
  event_datetime: '2026-08-10 12:34:28+00',
  magnitude: 7.4,
  depth_km: 110.3,
  epicenter: '0101000020E6100000736891ED7C0F53C0C74B378941601340',
  source: 'USGS - M 7.4, 5 km S of San José del Palmar, Chocó, Colombia',
  created_at: '2026-08-12 14:39:52.951703+00',
  name: 'Sismo San José del Palmar 2026',
}];

@Injectable({
  providedIn: 'root',
})
export class GetSeismicEvents {
  execute(): Observable<SeismicEvents[]> {
    return of(DATA);
  }
}