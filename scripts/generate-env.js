const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '..', 'src', 'environments');
const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key] && value) {
      process.env[key] = value;
    }
  }
}

const isVercel = !!process.env.VERCEL;
const isVercelProduction = process.env.VERCEL_ENV === 'production';

const env = {
  baseUrl: (() => {
    if (isVercel) return `https://${process.env.VERCEL_URL}`;
    return process.env.BASE_URL || 'http://localhost:4200';
  })(),
  production: false,
  supabaseUrl: process.env.SUPABASE_URL || 'https://YOUR_PROJECT_REF.supabase.co',
  supabaseKey: process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY',
  maplibreStyle: process.env.MAPLIBRE_STYLE || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

function writeEnvFile(filename, overrides = {}) {
  const merged = { ...env, ...overrides };
  const content = `export const environment = ${JSON.stringify(merged, null, 2)};
`;
  fs.writeFileSync(path.join(envDir, filename), content);
  console.log(`  ✓ ${filename}`);
}

console.log('Generating environment files...');
writeEnvFile('environment.ts', { production: isVercelProduction });
writeEnvFile('environment.development.ts');
console.log('Done.');
