import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { MessageService } from 'primeng/api';
import { ConnectivityService } from '../../core/connectivity/connectivity.service';
import { SupabaseAuthService } from '../../core/data/supabase/supabase-auth.service';
import { SyncReportsUseCase } from '../../features/report/domain/use-cases/sync-reports';
import { GlobalStore } from './global.store';

describe('GlobalStore', () => {
  let store: InstanceType<typeof GlobalStore>;
  let isOnline: ReturnType<typeof signal<boolean>>;
  let supabaseAuth: { ensureSession: ReturnType<typeof vi.fn> };
  let messageService: { add: ReturnType<typeof vi.fn> };
  let syncReports: {
    pendingCount: ReturnType<typeof vi.fn>;
    run: ReturnType<typeof vi.fn>;
    progress: ReturnType<typeof signal<{ synced: number; total: number }>>;
  };

  beforeEach(() => {
    isOnline = signal(true);
    supabaseAuth = { ensureSession: vi.fn().mockResolvedValue(undefined) };
    messageService = { add: vi.fn() };
    syncReports = {
      pendingCount: vi.fn().mockResolvedValue(0),
      run: vi.fn().mockResolvedValue(undefined),
      progress: signal({ synced: 0, total: 0 }),
    };

    TestBed.configureTestingModule({
      providers: [
        GlobalStore,
        { provide: ConnectivityService, useValue: { isOnline, start: vi.fn() } },
        { provide: SupabaseAuthService, useValue: supabaseAuth },
        { provide: MessageService, useValue: messageService },
        { provide: SyncReportsUseCase, useValue: syncReports },
      ],
    });

    store = TestBed.inject(GlobalStore);
    TestBed.flushEffects();
  });

  it('should reflect connectivity', () => {
    expect(store.isOnline()).toBe(true);

    isOnline.set(false);
    expect(store.isOnline()).toBe(false);
  });

  it('should expose the sync progress from the use case', () => {
    expect(store.syncProgress()).toEqual({ synced: 0, total: 0 });

    syncReports.progress.set({ synced: 1, total: 3 });
    expect(store.syncProgress()).toEqual({ synced: 1, total: 3 });
  });

  it('should not allow sync when offline, without pending, or while registering', async () => {
    isOnline.set(false);
    expect(store.canSync()).toBe(false);

    isOnline.set(true);
    syncReports.pendingCount.mockResolvedValue(5);
    await store.refreshPendingCount();
    expect(store.canSync()).toBe(true);

    store.setRegistering(true);
    expect(store.canSync()).toBe(false);
  });

  it('should not auto-trigger sync, only allow it manually', async () => {
    syncReports.pendingCount.mockResolvedValue(2);
    await store.refreshPendingCount();
    TestBed.flushEffects();

    expect(store.canSync()).toBe(true);
    expect(syncReports.run).not.toHaveBeenCalled();

    await store.syncNow();

    expect(syncReports.run).toHaveBeenCalledTimes(1);
  });

  it('should not auto-trigger sync while a report is being registered', async () => {
    syncReports.pendingCount.mockResolvedValue(2);
    store.setRegistering(true);
    await store.refreshPendingCount();
    TestBed.flushEffects();

    expect(store.canSync()).toBe(false);
    expect(syncReports.run).not.toHaveBeenCalled();
  });

  it('should mark sync as error and keep pending count when run fails', async () => {
    syncReports.pendingCount.mockResolvedValue(2);
    syncReports.run.mockRejectedValue(new Error('boom'));

    await store.refreshPendingCount();
    await store.syncNow();

    expect(store.syncStatus()).toBe('error');
    expect(store.pendingCount()).toBe(2);
    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        detail: expect.stringContaining('boom'),
      }),
    );
  });

  it('should reset the pending count after a successful sync', async () => {
    syncReports.pendingCount.mockResolvedValueOnce(2).mockResolvedValueOnce(0);
    syncReports.run.mockResolvedValue(undefined);

    await store.refreshPendingCount();
    await store.syncNow();

    expect(store.syncStatus()).toBe('idle');
    expect(store.pendingCount()).toBe(0);
    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
    );
  });

  it('should establish the anonymous session before syncing', async () => {
    syncReports.pendingCount.mockResolvedValue(2);

    await store.refreshPendingCount();
    await store.syncNow();

    expect(supabaseAuth.ensureSession).toHaveBeenCalledTimes(1);
    expect(syncReports.run).toHaveBeenCalledTimes(1);
  });

  it('should not sync when the anonymous session cannot be established', async () => {
    supabaseAuth.ensureSession.mockRejectedValue(new Error('anon disabled'));
    syncReports.pendingCount.mockResolvedValue(2);

    await store.refreshPendingCount();
    await store.syncNow();

    expect(store.syncStatus()).toBe('error');
    expect(syncReports.run).not.toHaveBeenCalled();
  });

  it('should expose the pending count refresh after registering a report', async () => {
    syncReports.pendingCount.mockResolvedValueOnce(0).mockResolvedValueOnce(3);

    await store.refreshPendingCount();
    expect(store.pendingCount()).toBe(0);

    await store.refreshPendingCount();
    expect(store.pendingCount()).toBe(3);
    expect(store.canSync()).toBe(true);
  });
});
