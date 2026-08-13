import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { ConnectivityService } from '../../core/connectivity/connectivity.service';
import { SyncReportsUseCase } from '../../features/report/domain/use-cases/sync-reports';
import { GlobalStore } from './global.store';

describe('GlobalStore', () => {
  let store: InstanceType<typeof GlobalStore>;
  let isOnline: ReturnType<typeof signal<boolean>>;
  let syncReports: {
    pendingCount: ReturnType<typeof vi.fn>;
    run: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    isOnline = signal(true);
    syncReports = {
      pendingCount: vi.fn().mockResolvedValue(0),
      run: vi.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        GlobalStore,
        { provide: ConnectivityService, useValue: { isOnline, start: vi.fn() } },
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

  it('should auto-trigger sync when online with pending data', async () => {
    syncReports.pendingCount.mockResolvedValue(2);
    await store.refreshPendingCount();
    TestBed.flushEffects();

    await vi.waitFor(() => {
      expect(store.syncStatus()).toBe('idle');
    });
    expect(syncReports.run).toHaveBeenCalled();
  });

  it('should not auto-trigger sync while a report is being registered', async () => {
    syncReports.pendingCount.mockResolvedValue(2);
    store.setRegistering(true);
    await store.refreshPendingCount();
    TestBed.flushEffects();

    await vi.waitFor(() => {
      expect(store.syncStatus()).toBe('idle');
    });
    expect(syncReports.run).not.toHaveBeenCalled();
  });

  it('should mark sync as error and keep pending count when run fails', async () => {
    syncReports.pendingCount.mockResolvedValue(2);
    syncReports.run.mockRejectedValue(new Error('boom'));

    await store.refreshPendingCount();
    await store.syncNow();

    expect(store.syncStatus()).toBe('error');
    expect(store.pendingCount()).toBe(2);
  });

  it('should reset the pending count after a successful sync', async () => {
    syncReports.pendingCount.mockResolvedValueOnce(2).mockResolvedValueOnce(0);
    syncReports.run.mockResolvedValue(undefined);

    await store.refreshPendingCount();
    await store.syncNow();

    expect(store.syncStatus()).toBe('idle');
    expect(store.pendingCount()).toBe(0);
  });

  it('should auto-trigger sync when connectivity returns after a failure', async () => {
    let runCalls = 0;
    syncReports.run.mockImplementation(() => {
      runCalls++;
      if (runCalls === 1) {
        return Promise.reject(new Error('network'));
      }
      return Promise.resolve(undefined);
    });
    syncReports.pendingCount.mockImplementation(async () =>
      runCalls >= 2 ? 0 : 2,
    );

    await store.refreshPendingCount();
    TestBed.flushEffects();
    await vi.waitFor(() => {
      expect(store.syncStatus()).toBe('error');
    });
    expect(syncReports.run).toHaveBeenCalledTimes(1);

    isOnline.set(false);
    TestBed.flushEffects();

    isOnline.set(true);
    TestBed.flushEffects();

    await vi.waitFor(() => {
      expect(store.syncStatus()).toBe('idle');
    });
    expect(syncReports.run).toHaveBeenCalledTimes(2);
  });

  it('should not re-trigger sync when staying offline', async () => {
    syncReports.pendingCount.mockResolvedValue(2);
    syncReports.run.mockRejectedValue(new Error('network'));

    await store.refreshPendingCount();
    TestBed.flushEffects();
    await vi.waitFor(() => {
      expect(store.syncStatus()).toBe('error');
    });
    expect(syncReports.run).toHaveBeenCalledTimes(1);

    isOnline.set(false);
    TestBed.flushEffects();
    TestBed.flushEffects();

    expect(syncReports.run).toHaveBeenCalledTimes(1);
    expect(store.syncStatus()).toBe('error');
  });
});
