import { createClient } from '@supabase/supabase-js';

// Replace these with your ACTUAL URL and Anon Key from Supabase 
// (Find them in Supabase -> Project Settings -> API)
const supabaseUrl = 'https://yolfsfforkibqvagahoq.supabase.co';
const supabaseAnonKey = 'sb_publishable_6vQgN5SXaY9lfA8vR8pQgw_SdbPu4It';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);