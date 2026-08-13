import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { SettingsStore } from './settings.store';
import { GetSettings } from '../../domain/use-cases/get-settings';
import { UpdateSettings } from '../../domain/use-cases/update-settings';
import { GetSeismicEvents } from '../../../../shared/use-cases/get-seismic-events';
import { Settings } from '../../domain/models/settings.model';
import { SeismicEvents } from '../../../../core/supabase-models/supabase-type-aliases';

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

describe('SettingsStore', () => {
  let resolveSettings: (settings: Settings | null) => void;
  let seismicEvents$: Subject<SeismicEvents[]>;
  let updateSettings: ReturnType<typeof vi.fn>;
  let store: InstanceType<typeof SettingsStore>;

  beforeEach(() => {
    seismicEvents$ = new Subject<SeismicEvents[]>();
    updateSettings = vi.fn().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: GetSettings,
          useValue: {
            execute: () =>
              new Promise<Settings | null>((resolve) => {
                resolveSettings = resolve;
              }),
          },
        },
        {
          provide: GetSeismicEvents,
          useValue: { execute: () => seismicEvents$ },
        },
        { provide: UpdateSettings, useValue: { execute: updateSettings } },
      ],
    });

    store = TestBed.inject(SettingsStore);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should hydrate the email and the event from local storage', async () => {
    resolveSettings({ email: 'usuario@example.com', event: EVENT });

    await vi.waitFor(() => {
      expect(store.email()).toBe('usuario@example.com');
      expect(store.event()).toEqual(EVENT);
      expect(store.isConfigured()).toBe(true);
    });
  });

  it('should not be configured when the local storage is empty', async () => {
    resolveSettings(null);

    await vi.waitFor(() => {
      expect(store.isConfigured()).toBe(false);
    });
  });

  it('should load the seismic events catalog', async () => {
    seismicEvents$.next([EVENT]);

    await vi.waitFor(() => {
      expect(store.seismicEvents()).toHaveLength(1);
      expect(store.seismicEvents()[0].id).toBe(EVENT.id);
    });
  });

  it('should persist the settings and update the state', async () => {
    await store.saveSettings('otro@example.com', EVENT);

    expect(updateSettings).toHaveBeenCalledWith({
      email: 'otro@example.com',
      event: EVENT,
    });
    expect(store.email()).toBe('otro@example.com');
    expect(store.event()).toEqual(EVENT);
  });
});