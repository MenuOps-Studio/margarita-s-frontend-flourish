import { createClient } from '@supabase/supabase-js';

// Διαβάζουμε τα κλειδιά με ασφάλεια
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Δημιουργούμε τον client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);