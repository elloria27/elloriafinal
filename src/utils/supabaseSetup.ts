
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function configureSupabase(config: {
  project_id: string;
  supabase_url: string;
  supabase_key: string;
}) {
  // Update config.toml
  const configPath = path.join(process.cwd(), 'supabase', 'config.toml');
  const configContent = `project_id = "${config.project_id}"`;
  fs.writeFileSync(configPath, configContent);

  // Update client.ts
  const clientPath = path.join(process.cwd(), 'src', 'integrations', 'supabase', 'client.ts');
  const clientContent = `
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "${config.supabase_url}";
const SUPABASE_PUBLISHABLE_KEY = "${config.supabase_key}";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  `.trim();
  fs.writeFileSync(clientPath, clientContent);

  // Initialize Supabase client
  const supabase = createClient(config.supabase_url, config.supabase_key);

  // Run migrations
  const migrations = JSON.parse(fs.readFileSync(
    path.join(process.cwd(), 'src', 'install', 'migrations', 'initial-setup.json'),
    'utf-8'
  ));

  // Execute migrations
  for (const type of migrations.types) {
    await supabase.rpc('create_types', { sql: type });
  }

  for (const table of migrations.tables) {
    await supabase.rpc('create_table', { sql: table });
  }

  return true;
}
