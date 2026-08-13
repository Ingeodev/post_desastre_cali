import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormStepper } from '../../../../../shared/components/form-stepper/form-stepper';
import { Stepp } from '../../../../../shared/components/stepp/stepp';
import { AttachmentManager } from '../../components/attachment-manager/attachment-manager';
import { MapForm } from '../../components/map-form/map-form';
import { StepDamage } from '../../components/step-damage/step-damage';
import { StepDescription } from '../../components/step-description/step-description';
import { StepOccupancy } from '../../components/step-occupancy/step-occupancy';
import { StepNotes } from '../../components/step-notes/step-notes';
import { NewReportStore } from '../../stores/new-report.store';
import { ReportStore } from '../../stores/report.store';
import { SettingsStore } from '../../../../settings/ui/stores/settings.store';

@Component({
  selector: 'app-add-report',
  imports: [
    FormStepper,
    Stepp,
    MapForm,
    StepDescription,
    StepDamage,
    StepOccupancy,
    StepNotes,
    AttachmentManager,
  ],
  templateUrl: './add-report.html',
  styleUrl: './add-report.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReport {
  readonly reportStore = inject(ReportStore);
  readonly newReportStore = inject(NewReportStore);
  readonly settingsStore = inject(SettingsStore);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly isLocationValid = computed(
    () => this.newReportStore.inspection().geom !== null,
  );

  readonly isDescriptionStepValid = computed(
    () => this.newReportStore.inspection().constructionTypeId !== null,
  );

  readonly isDamageStepValid = computed(
    () => this.newReportStore.inspection().damageCategoryId !== null,
  );

  readonly isOccupancyStepValid = computed(() => {
    const occupancy = this.newReportStore.occupancy();
    return (
      occupancy.isCurrentlyOccupied !== null &&
      occupancy.hasTrappedPeople !== null &&
      occupancy.estimatedResidents !== null
    );
  });

  readonly hasPhotos = computed(() => this.newReportStore.photos().length > 0);

  constructor() {
    this.newReportStore.resetDraft();

    effect(() => {
      const event = this.settingsStore.event();
      if (event && !this.newReportStore.inspection().seismicEventId) {
        this.newReportStore.updateInspection({ seismicEventId: event.id });
      }
    });

    effect(() => {
      const email = this.settingsStore.email();
      if (email && !this.newReportStore.inspection().reportedBy) {
        this.newReportStore.updateInspection({ reportedBy: email });
      }
    });

    effect(() => {
      const dataSources = this.reportStore.dataSources();
      if (!this.newReportStore.inspection().dataSourceId && dataSources.length > 0) {
        this.newReportStore.updateInspection({ dataSourceId: dataSources[0].id });
      }
    });

    effect(() => {
      const status = this.newReportStore.saveStatus();

      if (status === 'saved') {
        this.messageService.add({
          severity: 'success',
          summary: 'Reporte guardado',
          detail: 'El reporte se guardó correctamente y quedará pendiente de sincronizar.',
        });
        this.router.navigate(['/reportes']);
      } else if (status === 'error') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al guardar',
          detail: 'No se pudo guardar el reporte. Intenta nuevamente.',
        });
      }
    });
  }

  onCancel(): void {
    this.newReportStore.resetDraft();
    this.router.navigate(['/reportes']);
  }

  onFinish(): void {
    this.newReportStore.save();
  }
}