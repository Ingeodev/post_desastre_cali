import { createClient } from '@supabase/supabase-js'
import { Database } from '../../supabase-models/database.types'
import { environment } from '../../../../environments/environment'


export const supabase = createClient<Database>(
  environment.supabaseUrl,
  environment.supabaseKey,
)
