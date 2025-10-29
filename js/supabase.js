// === SUPABASE INITIALIZATION ===
// This module initializes the Supabase client and exports it
// for other modules to use.

const SUPABASE_URL = 'https://mwuxrrwbgytbqrlhzwsc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXhycndiZ3l0YnFybGh6d3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjcxNTYsImV4cCI6MjA3NjEwMzE1Nn0.up3JOKKXEyw6axEGhI2eESJbrZzoH-93zRmCSXukYZY';

// The global supabase object is available from the <script> tag in index.html
export const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);