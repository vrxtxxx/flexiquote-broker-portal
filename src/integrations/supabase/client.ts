// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hqdaacxhdbgogxclasro.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZGFhY3hoZGJnb2d4Y2xhc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTk4NTMsImV4cCI6MjA1OTgzNTg1M30.jf-jXmAAZydTGe5EhcuorlagFCiPv3BzKuw3dexJQTc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);