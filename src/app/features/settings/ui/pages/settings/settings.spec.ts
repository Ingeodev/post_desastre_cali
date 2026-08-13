import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { vi } from 'vitest';
import { Settings } from './settings';
import { SettingsStore } from '../../stores/settings.store';
import { SeismicEvents } from '../../../../../core/supabase-models/supabase-type-aliases';

const EVENT: SeismicEvents = {
  id: 'evt-1',
  event_datetime: '2026-08-10 12:34:28+00',
  magnitude: 7.4,
  depth_km: 110.3,
  epicenter: '0101000020E6100000736891ED7C0F53C0C74B378941601340',
  source: 'USGS - mock',
  created_at: '2026-08-12 14:39:52.951703+00',
  name: 'Sismo mock 2026',
};

function getButton(fixture: ComponentFixture<Settings>, label: string): HTMLButtonElement {
  const buttons = Array.from(
    fixture.nativeElement.querySelectorAll('button'),
  ) as HTMLButtonElement[];
  const button = buttons.find((b) => b.textContent?.includes(label));
  if (!button) {
    throw new Error(`Botón "${label}" no encontrado`);
  }
  return button;
}

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;
  let saveSettings: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    saveSettings = vi.fn().mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        MessageService,
        {
          provide: SettingsStore,
          useValue: {
            email: signal<string | null>(null),
            event: signal<SeismicEvents | null>(null),
            seismicEvents: signal<SeismicEvents[]>([EVENT]),
            saveSettings,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the email and event fields', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('#email')).not.toBeNull();
    expect(html.querySelector('p-select')).not.toBeNull();
  });

  it('should keep the save button disabled while the form is invalid', () => {
    expect(getButton(fixture, 'Guardar').disabled).toBe(true);
  });

  it('should persist the email and the selected event on submit', async () => {
    component.form.setValue({ email: 'usuario@example.com', eventId: EVENT.id });
    fixture.detectChanges();

    getButton(fixture, 'Guardar').click();
    await fixture.whenStable();

    expect(saveSettings).toHaveBeenCalledWith('usuario@example.com', EVENT);
  });
});