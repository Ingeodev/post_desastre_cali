import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

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
      const event = this.reportStore.currentSeismicEvent();
      if (event && !this.newReportStore.inspection().seismicEventId) {
        this.newReportStore.updateInspection({ seismicEventId: event.id });
      }
    });

    effect(() => {
      const dataSources = this.reportStore.dataSources();
      if (!this.newReportStore.inspection().dataSourceId && dataSources.length > 0) {
        this.newReportStore.updateInspection({ dataSourceId: dataSources[0].id });
      }
    });
  }

  onCancel(): void {
    this.newReportStore.resetDraft();
    this.router.navigate(['/reportes']);
  }

  onFinish(): void {
    const entities = this.newReportStore.buildEntities();
    console.log('[REPORT READY]', entities);
  }
}