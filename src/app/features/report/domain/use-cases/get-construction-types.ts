import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConstructionTypes } from '../../../../core/supabase-models/supabase-type-aliases';

const DATA: ConstructionTypes[] = [
  { id: 0, code: 'D0', label: 'Sin daño' },
  { id: 1, code: 'D1', label: 'Daño leve' },
  { id: 2, code: 'D2', label: 'Daño moderado' },
  { id: 3, code: 'D3', label: 'Daño severo' },
  { id: 4, code: 'D4', label: 'Peligro de colapso' },
  { id: 5, code: 'D5', label: 'Colapso' },
];

@Injectable({
  providedIn: 'root',
})
export class GetConstructionTypes {
  execute(): Observable<ConstructionTypes[]> {
    return of(DATA);
  }
}