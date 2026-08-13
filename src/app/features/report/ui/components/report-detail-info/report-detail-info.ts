import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReportStore } from '../../stores/report.store';
import { ReportProfile } from '../../../domain/models/report-profile.model';

type InfoRow = {
  label: string;
  value: string | null;
};

@Component({
  selector: 'app-report-detail-info',
  imports: [DatePipe],
  templateUrl: './report-detail-info.html',
  styleUrl: './report-detail-info.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDetailInfo {
  readonly profile = input.required<ReportProfile>();

  readonly store = inject(ReportStore);

  private readonly inspection = computed(() => this.profile().inspection);
  private readonly occupancy = computed(() => this.profile().occupancy);

  readonly rows = computed<InfoRow[]>(() => {
    const inspection = this.inspection();
    const occupancy = this.occupancy();

    const constructionLabel = this.store.constructionTypes().find(
      (type) => type.id === inspection.constructionTypeId,
    )?.label;

    const dataSourceLabel = this.store.dataSources().find(
      (source) => source.id === inspection.dataSourceId,
    )?.label;

    return [
      {
        label: 'Dirección',
        value: inspection.addressText ?? 'No registrada',
      },
      {
        label: 'Fecha de captura',
        value: inspection.capturedAt,
      },
      {
        label: 'Categoría de daño',
        value:
          this.store.damageCategories().find(
            (category) => category.id === inspection.damageCategoryId,
          )?.label ?? 'Sin categoría',
      },
      {
        label: 'Tipo de construcción',
        value: constructionLabel ?? 'No registrado',
      },
      {
        label: 'Fuente de datos',
        value: dataSourceLabel ?? 'No registrada',
      },
      {
        label: 'Número de pisos',
        value: inspection.numFloors?.toString() ?? 'No registrado',
      },
      {
        label: 'Año aproximado',
        value: inspection.approxYearBuilt?.toString() ?? 'No registrado',
      },
      {
        label: 'Reportado por',
        value: inspection.reportedBy ?? 'No registrado',
      },
      {
        label: 'Observaciones',
        value: inspection.notes ?? 'Sin observaciones',
      },
      {
        label: '¿Está ocupada?',
        value:
          occupancy?.isCurrentlyOccupied == null
            ? 'No registrado'
            : occupancy.isCurrentlyOccupied
              ? 'Sí'
              : 'No',
      },
      {
        label: '¿Hay personas atrapadas?',
        value:
          occupancy?.hasTrappedPeople == null
            ? 'No registrado'
            : occupancy.hasTrappedPeople
              ? 'Sí'
              : 'No',
      },
      {
        label: 'Residentes estimados',
        value: occupancy?.estimatedResidents?.toString() ?? 'No registrado',
      },
    ];
  });
}