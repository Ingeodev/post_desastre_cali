import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { SyncOverlay } from './sync-overlay';
import { GlobalStore } from '../../stores/global.store';

describe('SyncOverlay', () => {
  let component: SyncOverlay;
  let fixture: ComponentFixture<SyncOverlay>;
  let isSyncing: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    isSyncing = signal(false);

    await TestBed.configureTestingModule({
      imports: [SyncOverlay],
      providers: [
        {
          provide: GlobalStore,
          useValue: { isSyncing },
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
});
