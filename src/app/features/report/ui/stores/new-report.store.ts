import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap, throwError } from 'rxjs';
import { DamageInspectionsInsert } from '../../../../core/supabase-models/supabase-type-aliases';
import { resizePhoto, toLocalPhoto } from '../../application/mappers/photo.mapper';
import { GeoJsonPoint } from '../../data/entities/inspection.entity';
import { InspectionPhotoEntity } from '../../data/entities/inspection-photo.entity';
import { ReportEntities } from '../../domain/models/report-entities.model';
import { SaveReport } from '../../domain/use-cases/save-report';

export interface NewReportDraft {
  addressText: string;
  approxYearBuilt: number | null;
  capturedAt: string;
  constructionTypeId: number | null;
  damageCategoryId: number | null;
  dataSourceId: number | null;
  notes: string;
  numFloors: number | null;
  reportedBy: string;
  seismicEventId: string | null;
  geom: GeoJsonPoint | null;
}

export interface InspectionDraft {
  id: string;
  deviceLocalId: string;
  capturedAt: string;
  createdAt: string;
  geom: GeoJsonPoint | null;
  damageCategoryId: number | null;
  dataSourceId: number | null;
  seismicEventId: string | null;
  constructionTypeId: number | null;
  addressText: string | null;
  approxYearBuilt: number | null;
  numFloors: number | null;
  notes: string | null;
  reportedBy: string | null;
}

export interface OccupancyDraft {
  inspectionId: string;
  estimatedResidents: number | null;
  hasTrappedPeople: boolean | null;
  isCurrentlyOccupied: boolean | null;
}

interface NewReportState {
  inspection: InspectionDraft;
  occupancy: OccupancyDraft;
  patternIds: number[];
  photos: InspectionPhotoEntity[];
}

function createInitialState(): NewReportState {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  return {
    inspection: {
      id,
      deviceLocalId: id,
      capturedAt: now,
      createdAt: now,
      geom: null,
      damageCategoryId: null,
      dataSourceId: null,
      seismicEventId: null,
      constructionTypeId: null,
      addressText: null,
      approxYearBuilt: null,
      numFloors: null,
      notes: null,
      reportedBy: null,
    },
    occupancy: {
      inspectionId: id,
      estimatedResidents: null,
      hasTrappedPeople: null,
      isCurrentlyOccupied: null,
    },
    patternIds: [],
    photos: [],
  };
}

export const NewReportStore = signalStore(
  { providedIn: 'root' },
  withState<NewReportState>(createInitialState()),
  withProps(() => ({
    saveReport: inject(SaveReport),
  })),
  withComputed((store) => ({
    report: computed((): NewReportDraft => {
      const inspection = store.inspection();

      return {
        addressText: inspection.addressText ?? '',
        approxYearBuilt: inspection.approxYearBuilt,
        capturedAt: inspection.capturedAt,
        constructionTypeId: inspection.constructionTypeId,
        damageCategoryId: inspection.damageCategoryId,
        dataSourceId: inspection.dataSourceId,
        notes: inspection.notes ?? '',
        numFloors: inspection.numFloors,
        reportedBy: inspection.reportedBy ?? '',
        seismicEventId: inspection.seismicEventId,
        geom: inspection.geom,
      };
    }),
    isReadyToStore: computed(() => {
      const inspection = store.inspection();

      return (
        inspection.geom !== null &&
        inspection.damageCategoryId !== null &&
        inspection.dataSourceId !== null &&
        inspection.seismicEventId !== null &&
        store.photos().length > 0
      );
    }),
  })),
  withMethods((store) => {
    const assertComplete = (inspection: InspectionDraft): void => {
      if (
        !inspection.geom ||
        inspection.damageCategoryId === null ||
        inspection.dataSourceId === null ||
        !inspection.seismicEventId
      ) {
        throw new Error('Incomplete report: required inspection fields are missing');
      }
    };

    return {
      updateInspection(partial: Partial<InspectionDraft>): void {
        patchState(store, { inspection: { ...store.inspection(), ...partial } });
      },

      updateDraft(partial: Partial<NewReportDraft>): void {
        patchState(store, {
          inspection: {
            ...store.inspection(),
            ...partial,
            addressText: partial.addressText ?? null,
            notes: partial.notes ?? null,
            reportedBy: partial.reportedBy ?? null,
          },
        });
      },

      setCoordinates(coordinates: [number, number]): void {
        const geom: GeoJsonPoint = { type: 'Point', coordinates };
        patchState(store, { inspection: { ...store.inspection(), geom } });
      },

      updateOccupancy(
        partial: Partial<Omit<OccupancyDraft, 'inspectionId'>>,
      ): void {
        patchState(store, { occupancy: { ...store.occupancy(), ...partial } });
      },

      setPatternIds(patternIds: number[]): void {
        patchState(store, { patternIds });
      },

      async addPhoto(blob: Blob): Promise<void> {
        const resized = await resizePhoto(blob);

        const photo = toLocalPhoto({
          id: crypto.randomUUID(),
          inspectionId: store.inspection().id,
          blob: resized,
          sequence: store.photos().length,
        });

        patchState(store, { photos: [...store.photos(), photo] });
      },

      addPhotoEntity(photo: InspectionPhotoEntity): void {
        patchState(store, { photos: [...store.photos(), photo] });
      },

      removePhoto(id: string): void {
        patchState(store, {
          photos: store.photos().filter((photo) => photo.id !== id),
        });
      },

      resetDraft(): void {
        patchState(store, createInitialState());
      },

      buildEntities(): ReportEntities {
        const inspection = store.inspection();
        assertComplete(inspection);

        return {
          inspection: {
            id: inspection.id,
            deviceLocalId: inspection.deviceLocalId,
            capturedAt: inspection.capturedAt,
            geom: inspection.geom!,
            damageCategoryId: inspection.damageCategoryId!,
            dataSourceId: inspection.dataSourceId!,
            seismicEventId: inspection.seismicEventId!,
            constructionTypeId: inspection.constructionTypeId,
            deviceId: null,
            addressText: inspection.addressText,
            approxYearBuilt: inspection.approxYearBuilt,
            notes: inspection.notes,
            numFloors: inspection.numFloors,
            reportedBy: inspection.reportedBy,
            createdAt: inspection.createdAt,
            syncedAt: null,
          },
          occupancy: {
            id: inspection.id,
            inspectionId: inspection.id,
            createdAt: inspection.capturedAt,
            estimatedResidents: store.occupancy().estimatedResidents,
            hasTrappedPeople: store.occupancy().hasTrappedPeople,
            isCurrentlyOccupied: store.occupancy().isCurrentlyOccupied,
          },
          patterns: store.patternIds().map((patternId) => ({
            inspectionId: inspection.id,
            patternId,
          })),
          photos: store.photos().map((photo) => ({
            ...photo,
            inspectionId: inspection.id,
          })),
        };
      },

      buildReport(): DamageInspectionsInsert {
        const inspection = store.inspection();
        assertComplete(inspection);

        return {
          captured_at: inspection.capturedAt,
          damage_category_id: inspection.damageCategoryId!,
          data_source_id: inspection.dataSourceId!,
          seismic_event_id: inspection.seismicEventId!,
          construction_type_id: inspection.constructionTypeId,
          device_local_id: inspection.deviceLocalId,
          geom: inspection.geom!,
          address_text: inspection.addressText,
          approx_year_built: inspection.approxYearBuilt,
          notes: inspection.notes,
          num_floors: inspection.numFloors,
          reported_by: inspection.reportedBy,
        };
      },
    };
  }),
  withMethods((store) => ({
    save: rxMethod<void>(
      pipe(
        switchMap(() => {
          try {
            return store.saveReport.execute(store.buildEntities());
          } catch (error) {
            return throwError(() => error);
          }
        }),
        catchError((error) => {
          console.error('Failed to save report', error);
          return EMPTY;
        }),
        tap(() => patchState(store, createInitialState())),
      ),
    ),
  })),
);