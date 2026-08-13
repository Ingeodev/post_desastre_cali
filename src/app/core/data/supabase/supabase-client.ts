import { InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../supabase-models/database.types'
import { environment } from '../../../../environments/environment'


export const supabase = createClient<Database>(
  environment.supabaseUrl,
  environment.supabaseKey,
)

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient<Database>>(
  'Supabase client',
  {
    providedIn: 'root',
    factory: () => supabase,
  },
)
