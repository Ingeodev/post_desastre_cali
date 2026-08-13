import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { SeismicEvents } from '../../../../../core/supabase-models/supabase-type-aliases';
import { SettingsStore } from '../../stores/settings.store';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule, ToastModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  readonly settingsStore = inject(SettingsStore);
  private readonly messageService = inject(MessageService);

  readonly saving = signal(false);

  readonly form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    eventId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        email: this.settingsStore.email() ?? '',
        eventId: this.settingsStore.event()?.id ?? null,
      });
    });
  }

  get eventOptions(): SeismicEvents[] {
    return this.settingsStore.seismicEvents();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email ?? '';
    const event = this.eventOptions.find(
      (candidate) => candidate.id === this.form.value.eventId,
    );

    if (!event) {
      return;
    }

    this.saving.set(true);

    try {
      await this.settingsStore.saveSettings(email, event);
      this.messageService.add({
        severity: 'success',
        summary: 'Configuración guardada',
        detail: 'Tus datos se guardaron correctamente.',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'No se pudieron guardar los datos. Intenta nuevamente.',
      });
    } finally {
      this.saving.set(false);
    }
  }
}