import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from './supabase-client';

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService {
  private readonly supabase = inject(SUPABASE_CLIENT);

  private sessionReady: Promise<void> | null = null;

  ensureSession(): Promise<void> {
    if (!this.sessionReady) {
      this.sessionReady = this.establishSession().catch((error) => {
        this.sessionReady = null;
        throw error;
      });
    }

    return this.sessionReady;
  }

  private async establishSession(): Promise<void> {
    const { data } = await this.supabase.auth.getSession();

    if (data.session) {
      return;
    }

    const { error } = await this.supabase.auth.signInAnonymously();

    if (error) {
      throw error;
    }
  }
}
