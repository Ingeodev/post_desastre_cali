# PLAN — Formulario de reporte en 5 pasos (Stepper)

## Objetivo

Partir el formulario del reporte nuevo en **5 formularios con validación**, uno por cada step del `FormStepper`, de modo que el contenido sea manejable en pantalla y la información quede **estructurada por entidad** en el store, lista para persistir en IndexedDB/Supabase sin propiedades requeridas en blanco.

> **NOTA**: aún NO se persiste nada. El alcance de este plan es el registro correcto de la información en el store.

## Reglas

- Garantizar consistencia entre las tablas `damage_inspections`, `damage_inspection_occupancy`, `damage_inspection_photos` e `inspection_damage_patterns` (n:n).
- No dejar propiedades requeridas (NOT NULL en Supabase) en blanco: `captured_at`, `damage_category_id`, `data_source_id`, `device_local_id`, `geom`, `seismic_event_id` y al menos una foto.
- Los componentes/forms fragmentados escriben SIEMPRE en el store central; el store mantiene las entidades estructuradas con IDs locales consistentes (seed: `crypto.randomUUID()`).

## Definición de steps

| # | Step | Contenido | Validación para avanzar |
|---|------|-----------|--------------------------|
| 1 | Ubicación | `map-form` (maplibre) | `geom` seteado (coordenadas) |
| 2 | Descripción de la construcción | tipo de edificación, año de construcción, dirección, nº de pisos | `construction_type_id` requerido (decidido) |
| 3 | Estado de la construcción | catálogo de daños (n:n, multi-opcional) + nivel de daño percibido | `damage_category_id` requerido |
| 4 | Ocupantes | checkboxes (¿ocupada?, ¿atrapados?) + residentes aprox. | Los 3 campos diligenciados (decidido) |
| 5 | Fotografías | `attachment-manager` en grilla con launcher de cámara como primer ítem | Al menos 1 foto |

## Decisiones confirmadas

1. `data_source_id` y `seismic_event_id` (NOT NULL en Supabase pero sin step propio) se **auto-rellenan** desde los catálogos del `ReportStore` (primer source y evento sísmico actual).
2. Patrones de daño: **multi-selección** (n:n completo, 0..n registro en `inspection_damage_patterns`), opcional.
3. Los checks de validación leen el **store** (no estados locales), así el mismo estado valida el button "Siguiente".

## Arquitectura del store (`new-report.store.ts`)

Estado por entidad (reemplaza el draft plano):

```ts
interface NewReportState {
  inspection: InspectionDraft;   // campos + geom + ids locales
  occupancy: OccupancyDraft;     // 1:1 con inspection
  patternIds: number[];          // → InspectionPatternEntity[]
  photos: InspectionPhotoEntity[];
}
```

- `updateInspection()` / `updateDraft()` (alias compat con el form legacy) / `setCoordinates()` / `updateOccupancy()` / `setPatternIds()` / `addPhoto()` / `addPhotoEntity()` / `removePhoto()` / `resetDraft()`.
- `buildEntities(): ReportEntities` → entidades enlazadas por el mismo `inspection.id` (photo/occupancy/pattern → `inspectionId`), con guard: lanza si faltan campos requeridos.
- `buildReport(): DamageInspectionsInsert` → snapshot para Supabase, con el mismo guard.
- `isReadyToStore(): boolean` → HAD todos los requeridos.

Componentes por step: `step-description`, `step-damage`, `step-occupancy` (+ `map-form` y `attachment-manager` reutilizados).

## Cambios de componentes

- `attachment-manager` → galería en grilla, launcher de cámara como primer ítem (adiós slider).
- `stepp` → conservar estado entre steps: `[class.hidden]` en vez de destruir el contenido (`@if`).
- `form-stepper` → input `finishLabel` (pantalla final: "Enviar").

## Tareas

- [x] Restructure `NewReportStore` a estado por entidad + `buildEntities`
- [x] Crear `StepDescription` (tipo edificación, año, dirección, pisos)
- [x] Crear `StepDamage` (catálogo multi + nivel de daño requerido)
- [x] Crear `StepOccupancy` (checkboxes + residentes)
- [x] `AttachmentManager` a grilla con launcher primero
- [x] `Stepp` preserva estado (hidden)
- [x] `FormStepper` — `finishLabel`
- [x] Reescribir `AddReport2` como página real de 5 steps + autofill + finish
- [x] Specs: store, steps, stepp, AddReport2 — **24/24 verdes** en suite dirigida

### Estado de suite completo
- **34/37 tests verdes**. 3 fallas PRE-EXISTENTES fuera de alcance (fallan igual sin estos cambios, al crear/limpiar con maplibre/inputs requeridos):
  - `add-report.spec.ts`, `report-layer.spec.ts`, `damage-catalog-item.spec.ts`

## Archivos

- `src/app/features/report/ui/stores/new-report.store.ts` (reestructurado)
- `src/app/features/report/ui/components/step-{description,damage,occupancy}/*`
- `src/app/features/report/ui/components/attachment-manager/*` (grilla)
- `src/app/shared/components/stepp/*` (preserva estado)
- `src/app/shared/components/form-stepper/*` (`finishLabel`)
- `src/app/features/report/ui/pages/add-report-2/*` (página real)

## Pendiente / próximo hito

- Persistir `buildEntities()` en IndexedDB y sincronizar a Supabase (fuera de alcance).
- `notes` / `reported_by` aún no tienen step propio (opcionales, quedan en `null`).