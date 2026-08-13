import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { SyncOverlay } from './sync-overlay';
import { GlobalStore } from '../../stores/global.store';
import { SyncProgress } from '../../../features/report/domain/use-cases/sync-reports';

describe('SyncOverlay', () => {
  let component: SyncOverlay;
  let fixture: ComponentFixture<SyncOverlay>;
  let isSyncing: ReturnType<typeof signal<boolean>>;
  let syncProgress: ReturnType<typeof signal<SyncProgress>>;

  beforeEach(async () => {
    isSyncing = signal(false);
    syncProgress = signal({ synced: 0, total: 0 });

    await TestBed.configureTestingModule({
      imports: [SyncOverlay],
      providers: [
        {
          provide: GlobalStore,
          useValue: { isSyncing, syncProgress },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the overlay when idle', () => {
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('[role="status"]');
    expect(overlay).toBeNull();
  });

  it('should render the overlay while syncing', () => {
    isSyncing.set(true);
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('[role="status"]');
    expect(overlay).not.toBeNull();
    expect(overlay.textContent).toContain('No cierres la aplicación');
  });

  it('should show the progress bar and the synced/total count', () => {
    isSyncing.set(true);
    syncProgress.set({ synced: 2, total: 5 });
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[role="status"]');
    expect(overlay.textContent).toContain('2 de 5');
    expect(component.progressValue()).toBe(40);
  });

  it('should show zero progress when there is nothing to sync', () => {
    isSyncing.set(true);
    fixture.detectChanges();

    expect(component.progressValue()).toBe(0);
  });
});
