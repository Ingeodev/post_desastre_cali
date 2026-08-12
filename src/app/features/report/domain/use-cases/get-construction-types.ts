import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConstructionTypes } from '../../../../core/supabase-models/supabase-type-aliases';

const DATA: ConstructionTypes[] = [
  { "id": 1, "code": "MAMP_NR", "label": "Ladrillo o bloque sin refuerzo" }, 
  { "id": 2, "code": "MAMP_REF", "label": "Ladrillo o bloque con refuerzo (columnas y vigas de amarre)" }, 
  { "id": 3, "code": "CONC_REF", "label": "Concreto reforzado (columnas y vigas de concreto)" }, 
  { "id": 4, "code": "ADOBE", "label": "Adobe o tapia pisada (barro/tierra)" }, 
  { "id": 5, "code": "MADERA", "label": "Madera" }, 
  { "id": 6, "code": "INFORMAL", "label": "Construcción informal, sin planos ni diseño técnico" }, 
  { "id": 7, "code": "OTRO", "label": "Otro tipo de construcción" }, 
  { "id": 8, "code": "MURO_CONC", "label": "Muros de concreto (paños de concreto vaciados en sitio, común en conjuntos cerrados)" }];

@Injectable({
  providedIn: 'root',
})
export class GetConstructionTypes {
  execute(): Observable<ConstructionTypes[]> {
    return of(DATA);
  }
}