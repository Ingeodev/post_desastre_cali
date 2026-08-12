const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const projectId = process.env.SUPABASE_PROJECT_ID || '';

const typesPath = path.join(__dirname, '..', 'src/app/core/supabase-models/database.types.ts');
const aliasesPath = path.join(__dirname, '..', 'src/app/core/supabase-models/supabase-type-aliases.ts');

[typesPath, aliasesPath].forEach((f) => {
  if (fs.existsSync(f)) fs.unlinkSync(f);
});

const cmd = `npx supabase gen types typescript --project-id "${projectId}" --schema public`;
const output = execSync(cmd, { encoding: 'utf-8' });
fs.writeFileSync(typesPath, output);
console.log(`✅ Generated Supabase types (project: ${projectId})`);
