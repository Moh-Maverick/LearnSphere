import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldqqpeeugvujfynwalzj.supabase.co'; // Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcXFwZWV1Z3Z1amZ5bndhbHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTY2MjYsImV4cCI6MjA2NjY3MjYyNn0.vBzI4mKNH6sDZdVDwBc_6bG5PaHed9D2Kd6wnNBsky4'; // Replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 