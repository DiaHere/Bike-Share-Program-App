// Checks that this app can reach Supabase with the keys in its env file.
// Run with: npm run check:supabase
import { createClient } from '@supabase/supabase-js';

const ENV_FILE = '.env';
const PREFIX = 'EXPO_PUBLIC_';

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

// Legacy keys are JWTs; the role inside tells the public anon key from the secret service_role key.
function jwtRole(key) {
  try {
    return JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role;
  } catch {
    return undefined;
  }
}

try {
  process.loadEnvFile(ENV_FILE);
} catch {
  fail(`Could not read ${ENV_FILE}. Copy the matching block from the repo's .env.example into it.`);
}

const url = process.env[`${PREFIX}SUPABASE_URL`];
const key = process.env[`${PREFIX}SUPABASE_PUBLISHABLE_KEY`];

if (!url || !key) {
  fail(`${PREFIX}SUPABASE_URL and ${PREFIX}SUPABASE_PUBLISHABLE_KEY must both be set in ${ENV_FILE}.`);
}

let origin;
try {
  origin = new URL(url).origin;
} catch {
  fail(`${PREFIX}SUPABASE_URL is not a valid URL: ${url}`);
}
if (url.replace(/\/$/, '') !== origin) {
  fail(`${PREFIX}SUPABASE_URL should be just the project URL (${origin}), with no path after it.`);
}

if (key.startsWith('sb_secret_') || jwtRole(key) === 'service_role') {
  fail('That is a secret key. Use the publishable (or legacy anon) key, and keep the secret key out of the app.');
}

console.log(`Connecting to ${origin} ...`);

const supabase = createClient(origin, key, { auth: { persistSession: false } });
const { count, error, status } = await supabase
  .from('stations')
  .select('*', { count: 'exact' })
  .limit(1);

if (!error) {
  console.log(`✓ Connected. Read the stations table (${count} row(s)).`);
} else if (error.code === 'PGRST205') {
  // Supabase answered, so the URL and key work; the table just isn't created yet.
  console.log('✓ Connected. The stations table does not exist yet (expected until Sprint 2).');
} else if (status === 0) {
  fail(`Could not reach ${origin}. Check the URL and your internet connection.`);
} else if (status === 401) {
  fail(`Supabase rejected the key: ${error.message}. Copy it again from Project Settings → API Keys.`);
} else {
  fail(`Supabase returned an error (${status}): ${error.message || 'no response, check the URL and your network'}`);
}
