import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DamageCategories } from '../../../../core/supabase-models/supabase-type-aliases';

const DATA: DamageCategories[] = [
  { id: 0, code: 'D0', label: 'Sin daño', description: 'La edificación se ve en buen estado, sin grietas ni daños visibles.' },
  { id: 1, code: 'D1', label: 'Daño leve', description: 'Grietas pequeñas y delgadas en paredes. No representa peligro para entrar.' },
  { id: 2, code: 'D2', label: 'Daño moderado', description: 'Grietas más grandes en paredes, o caída de tejas, cornisas u otros elementos que no sostienen la construcción.' },
  { id: 3, code: 'D3', label: 'Daño severo', description: 'Grietas grandes en columnas o muros, la construcción se ve inclinada o con partes caídas. Precaución al entrar.' },
  { id: 4, code: 'D4', label: 'Peligro de colapso', description: 'La construcción está muy dañada y podría caerse en cualquier momento. No se debe entrar.' },
  { id: 5, code: 'D5', label: 'Colapso', description: 'La construcción se cayó total o parcialmente.' },
];

@Injectable({
  providedIn: 'root',
})
export class GetDamageCategories {
  execute(): Observable<DamageCategories[]> {
    return of(DATA);
  }
}