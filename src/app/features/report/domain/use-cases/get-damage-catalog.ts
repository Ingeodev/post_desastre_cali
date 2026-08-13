import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {  DamagePatterns } from '../../../../core/supabase-models/supabase-type-aliases';

const DATA: DamagePatterns[] = [
  {
    "id": 1, "code": "GRIETA_DIAGONAL", "label": "Grietas diagonales o en forma de x", "description": "Grietas inclinadas, a veces cruzadas como una X, en muros o columnas. Indican que el elemento sufrió fuerza de corte durante el sismo.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/grieta_diagonal.png", "active": true
  }, {
    "id": 2, "code": "GRIETA_HORIZONTAL", "label": "Grietas horizontales", "description": "Grietas que corren de lado a lado, comúnmente donde la pared se une con el piso o la viga.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/grieta_horizontal.png", "active": true
  }, {
    "id": 3, "code": "GRIETA_VERTICAL", "label": "Grietas verticales", "description": "Grietas que corren de arriba hacia abajo en muros o columnas.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/grieta_vertical.png", "active": true
  }, {
    "id": 4, "code": "CONCRETO_DESPRENDIDO", "label": "Concreto desprendido con varillas a la vista en muros", "description": "El recubrimiento de concreto se cayó dejando ver el hierro (varillas) por dentro de una columna o viga.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/concreto_desprendido.png", "active": true
  }, {
    "id": 5, "code": "COLUMNA_PARTIDA", "label": "Columna partida, aplastada o muy deformada", "description": "Una columna se ve rota, aplastada o con forma de \"reloj de arena\" en un punto. Es una señal de alto riesgo.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/columna_colapsada.png", "active": true
  }, {
    "id": 6, "code": "PISO_HUNDIDO_PANDEADO", "label": "Un piso pandeado, colapsado parcial o completamente dentro del edificio", "description": "Un piso (usualmente el primero) se ve más bajo de lo normal, como si el edificio se hubiera \"sentado\" sobre sí mismo.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/piso_hundido.png", "active": true
  }, {
    "id": 7, "code": "EDIFICIO_INCLINADO", "label": "Edificio o muro inclinado", "description": "Toda la construcción, o una parte de ella, se ve visiblemente inclinada hacia un lado, sin haberse caído del todo.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/edificacion_inclinada.png", "active": true
  }, {
    "id": 8, "code": "ESCALERA_CAIDA", "label": "Escaleras caídas o separadas de la estructura", "description": "Las escaleras se desprendieron de los pisos que conectaban, o se ven caídas/colapsadas.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/escaleras_derrumbadas.png", "active": true
  }, {
    "id": 9, "code": "MURO_CAIDO_AFUERA", "label": "Muro caído o con riesgo de caida hacia el exterior o sobre otra propiedad", "description": "Una pared completa se cayó hacia la calle o hacia afuera del edificio, o se ve abombada como si fuera a caerse.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/muro_colapsado_hacia_afuera.png", "active": true
  }, {
    "id": 10, "code": "CAIDA_PARAPETO", "label": "Caída de parapetos, chimeneas o elementos con hornamentos de iglesias", "description": "Elementos en la parte alta del edificio (bordes de techo, chimeneas, tanques) se cayeron o están a punto de caer.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/caida_parapeto.png", "active": true
  }, {
    "id": 11, "code": "CHOQUE_EDIFICIOS", "label": "Edificios vecinos chocados o separados entre sí", "description": "Dos construcciones que estaban pegadas o muy cerca muestran daño por golpe entre ellas, o quedaron separadas con una grieta grande entre las dos.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/edificaciones_separadas.png", "active": true
  }, {
    "id": 12, "code": "GRIETAS_TERRENO", "label": "Grietas o hundimientos en el piso/terreno alrededor", "description": "El suelo alrededor de la construcción (patio, andén, parqueadero) muestra grietas, hundimientos o zonas que se ven \"blandas\" o húmedas donde antes no lo estaban.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/grietas_terreno.png", "active": true
  }, {
    "id": 13, "code": "TECHO_CAIDO", "label": "Techo o losa caída total o parcialmente", "description": "El techo o una losa de entrepiso se cayó, total o parcialmente, hacia el interior del edificio.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/techo_colapsado.png", "active": true
  }, {
    "id": 14, "code": "PUERTAS_VENTANAS_TRABADAS", "label": "Puertas o ventanas que ya no abren ni cierran bien", "description": "Puertas y ventanas que antes funcionaban bien ahora están trabadas o no encajan, señal de que la estructura se deformó.", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/puertas_trabadas.png", "active": true
  }, {
    "id": 15, "code": "GRIETA_SUPERFICIAL", "label": "Grietas superficiales", "description": "Grietas superficiales como del grosor de un cabello", "reference_image_url": "https://amvbjwvkyybqelhrwdgd.supabase.co/storage/v1/object/public/reference_images/grieta_superficial.png", "active": true
  }];

@Injectable({
  providedIn: 'root',
})
export class GetDamageCatalog {
  execute(): Observable<DamagePatterns[]> {
    return of(DATA);
  }
}