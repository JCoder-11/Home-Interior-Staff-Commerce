import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient(supabaseUrl, supabaseServiceKey, clientOptions);

export const createAuthClient = () =>
  createClient(supabaseUrl, supabaseServiceKey, clientOptions);