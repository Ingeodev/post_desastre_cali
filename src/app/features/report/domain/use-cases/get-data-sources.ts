import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataSources } from '../../../../core/supabase-models/supabase-type-aliases';

const DATA: DataSources[] = [
  { id: 1, code: 'BRIGADE', label: 'Brigada de campo' },
  { id: 2, code: 'CITIZEN', label: 'Reporte ciudadano' },
  { id: 3, code: 'DRONE', label: 'Dron' },
  { id: 4, code: 'SATELLITE', label: 'Imagen satelital' },
  { id: 5, code: 'IOT', label: 'Sensor automático' },
];

@Injectable({
  providedIn: 'root',
})
export class GetDataSources {
  execute(): Observable<DataSources[]> {
    return of(DATA);
  }
}