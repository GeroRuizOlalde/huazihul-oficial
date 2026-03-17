import { createClient } from '@supabase/supabase-js'

// Este cliente es solo para archivos que se ejecutan en el SERVIDOR
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usa la llave secreta
)