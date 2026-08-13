import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SUPABASE_CLIENT } from './supabase-client';
import { SupabaseAuthService } from './supabase-auth.service';

describe('SupabaseAuthService', () => {
  let service: SupabaseAuthService;
  let getSession: ReturnType<typeof vi.fn>;
  let signInAnonymously: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getSession = vi.fn();
    signInAnonymously = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        SupabaseAuthService,
        {
          provide: SUPABASE_CLIENT,
          useValue: { auth: { getSession, signInAnonymously } },
        },
      ],
    });

    service = TestBed.inject(SupabaseAuthService);
  });

  it('should not sign in anonymously when a session already exists', async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: 't' } } });

    await service.ensureSession();

    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it('should sign in anonymously when there is no session', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    signInAnonymously.mockResolvedValue({ error: null });

    await service.ensureSession();

    expect(signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('should throw when the anonymous sign-in fails', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    signInAnonymously.mockResolvedValue({ error: new Error('anon disabled') });

    await expect(service.ensureSession()).rejects.toThrow('anon disabled');
  });

  it('should reuse a single in-flight session request', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    signInAnonymously.mockResolvedValue({ error: null });

    const first = service.ensureSession();
    const second = service.ensureSession();

    await Promise.all([first, second]);

    expect(signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('should allow retrying after a failed attempt', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    signInAnonymously.mockRejectedValueOnce(new Error('network'));

    await expect(service.ensureSession()).rejects.toThrow('network');

    signInAnonymously.mockResolvedValue({ error: null });

    await expect(service.ensureSession()).resolves.toBeUndefined();
    expect(signInAnonymously).toHaveBeenCalledTimes(2);
  });
});
