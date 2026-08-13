import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { App } from './app';
import { SettingsStore } from './features/settings/ui/stores/settings.store';
import { GlobalStore } from './shared/stores/global.store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        MessageService,
        { provide: SettingsStore, useValue: { isConfigured: signal(false) } },
        {
          provide: GlobalStore,
          useValue: {
            isSyncing: signal(false),
            canSync: signal(false),
            syncNow: (): void => undefined,
            syncProgress: signal({ synced: 0, total: 0 }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});