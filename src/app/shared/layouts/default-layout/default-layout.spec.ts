import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MessageService } from 'primeng/api';

import { DefaultLayout } from './default-layout';
import { SettingsStore } from '../../../features/settings/ui/stores/settings.store';
import { GlobalStore } from '../../stores/global.store';

describe('DefaultLayout', () => {
  let component: DefaultLayout;
  let fixture: ComponentFixture<DefaultLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultLayout],
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
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
