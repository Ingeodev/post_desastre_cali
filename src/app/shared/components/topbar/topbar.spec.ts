import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Topbar } from './topbar';
import { GlobalStore } from '../../stores/global.store';

describe('Topbar', () => {
  let component: Topbar;
  let fixture: ComponentFixture<Topbar>;
  let syncNow: ReturnType<typeof vi.fn>;
  let isSyncing: ReturnType<typeof signal<boolean>>;
  let canSync: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    syncNow = vi.fn();
    isSyncing = signal(false);
    canSync = signal(false);

    await TestBed.configureTestingModule({
      imports: [Topbar],
      providers: [
        {
          provide: GlobalStore,
          useValue: { isSyncing, canSync, syncNow },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Topbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the sync button when there is nothing to sync', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label="Sincronizar"]');
    expect(buttons.length).toBe(0);
  });

  it('should show the sync button when there is pending data and trigger sync on click', () => {
    canSync.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[aria-label="Sincronizar"]');
    expect(button).not.toBeNull();

    button.click();
    expect(syncNow).toHaveBeenCalled();
  });

  it('should show a syncing indicator while syncing', () => {
    isSyncing.set(true);
    fixture.detectChanges();

    const indicator = fixture.nativeElement.querySelector('button[aria-label="Sincronizando"]');
    expect(indicator).not.toBeNull();
  });
});
