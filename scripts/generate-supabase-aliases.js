const fs = require('fs');
const path = require('path');

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

const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.argv[2] || '';

const INPUT_PATH = path.join(__dirname, '../src/app/core/supabase-models/database.types.ts');
const OUTPUT_PATH = path.join(__dirname, '../src/app/core/supabase-models/supabase-type-aliases.ts');

function toPascalCase(str) {
  // Eliminar guiones bajos al principio o final para el nombre de la clase
  const cleanStr = str.replace(/^_+|_+$/g, '');
  return cleanStr.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function generate() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Error: No se encuentra ${INPUT_PATH}. Asegúrate de generar primero database.types.ts`);
    return;
  }

  const content = fs.readFileSync(INPUT_PATH, 'utf8');

  // Extraer nombres de tablas
  const tablesStart = content.indexOf('Tables: {');
  const tablesEnd = content.indexOf('Views: {');
  const tablesSection = content.substring(tablesStart, tablesEnd);

  // Regex más estricto: busca claves indentadas exactamente con 6 espacios
  // y que tengan un bloque de apertura '{'
  const tablesRegex = /^ {6}(\w+): \{/gm;
  const tables = [];
  let match;

  const reservedKeywords = ['Row', 'Insert', 'Update', 'Relationships', 'Args', 'Returns'];

  while ((match = tablesRegex.exec(tablesSection)) !== null) {
    const tableName = match[1];
    if (!reservedKeywords.includes(tableName)) {
      tables.push(tableName);
    }
  }

  // Extraer nombres de vistas
  const viewsStart = content.indexOf('Views: {');
  const viewsEnd = content.indexOf('Functions: {');
  const viewsSection = content.substring(viewsStart, viewsEnd);
  const viewsRegex = /^ {6}(\w+): \{/gm;
  const views = [];

  while ((match = viewsRegex.exec(viewsSection)) !== null) {
    const viewName = match[1];
    if (!reservedKeywords.includes(viewName)) {
      views.push(viewName);
    }
  }

  // Extraer nombres de funciones
  const functionsStart = content.indexOf('Functions: {');
  const functionsEnd = content.indexOf('Enums: {');
  const functionsSection = content.substring(functionsStart, functionsEnd);
  const functionsRegex = /^ {6}(\w+): \{/gm;
  const functions = [];

  while ((match = functionsRegex.exec(functionsSection)) !== null) {
    const functionName = match[1];
    if (!reservedKeywords.includes(functionName)) {
      functions.push(functionName);
    }
  }

  // Extraer nombres de enums
  const enumsStart = content.indexOf('Enums: {');
  const enumsEnd = content.indexOf('CompositeTypes: {');
  const enumsSection = content.substring(enumsStart, enumsEnd);
  const enumsRegex = /^ {6}(\w+):/gm;
  const enums = [];

  while ((match = enumsRegex.exec(enumsSection)) !== null) {
    const enumName = match[1];
    if (!reservedKeywords.includes(enumName)) {
      enums.push(enumName);
    }
  }

  // Construir el archivo de salida
  let output = `import { Database } from './database.types';\n\n`;
  output += `// Tipos base de ayuda\n`;
  output += `export type Tables<T extends keyof Database['public']['Tables']> =\n`;
  output += `  Database['public']['Tables'][T]['Row'];\n`;
  output += `export type TablesInsert<T extends keyof Database['public']['Tables']> =\n`;
  output += `  Database['public']['Tables'][T]['Insert'];\n`;
  output += `export type TablesUpdate<T extends keyof Database['public']['Tables']> =\n`;
  output += `  Database['public']['Tables'][T]['Update'];\n`;
  output += `export type Views<T extends keyof Database['public']['Views']> =\n`;
  output += `  Database['public']['Views'][T]['Row'];\n`;
  output += `export type ViewsInsert<T extends keyof Database['public']['Views']> =\n`;
  output += `  Database['public']['Views'][T]['Insert'];\n`;
  output += `export type ViewsUpdate<T extends keyof Database['public']['Views']> =\n`;
  output += `  Database['public']['Views'][T]['Update'];\n`;
  output += `export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];\n`;
  output += `export type FunctionsArgs<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]['Args'];\n`;
  output += `export type FunctionsReturns<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]['Returns'];\n\n`;

  // Generar alias para tablas
  output += `/* ==========================================================================\n`;
  output += `   TABLE ALIASES\n`;
  output += `   ========================================================================== */\n\n`;

  tables.sort().forEach(table => {
    const pascal = toPascalCase(table);
    output += `// --- ${pascal} ---\n`;
    output += `export type ${pascal} = Tables<'${table}'>;\n`;
    output += `export type ${pascal}Insert = TablesInsert<'${table}'>;\n`;
    output += `export type ${pascal}Update = TablesUpdate<'${table}'>;\n\n`;
  });

  // Generar alias para vistas
  if (views.length > 0) {
    output += `/* ==========================================================================\n`;
    output += `   VIEW ALIASES\n`;
    output += `   ========================================================================== */\n\n`;
    views.sort().forEach(view => {
      const pascal = toPascalCase(view);
      output += `// --- ${pascal} ---\n`;
      output += `export type ${pascal} = Views<'${view}'>;\n`;
      output += `export type ${pascal}Insert = ViewsInsert<'${view}'>;\n`;
      output += `export type ${pascal}Update = ViewsUpdate<'${view}'>;\n\n`;
    });
  }

  // Generar alias para funciones
  if (functions.length > 0) {
    output += `/* ==========================================================================\n`;
    output += `   FUNCTION ALIASES\n`;
    output += `   ========================================================================== */\n\n`;
    functions.sort().forEach(func => {
      const pascal = toPascalCase(func);
      output += `// --- ${pascal} ---\n`;
      output += `export type ${pascal}Args = FunctionsArgs<'${func}'>;\n`;
      output += `export type ${pascal}Returns = FunctionsReturns<'${func}'>;\n\n`;
    });
  }

  // Generar alias para enums
  if (enums.length > 0) {
    output += `/* ==========================================================================\n`;
    output += `   ENUM ALIASES\n`;
    output += `   ========================================================================== */\n\n`;
    enums.sort().forEach(e => {
      const pascal = toPascalCase(e);
      output += `export type ${pascal} = Enums<'${e}'>;\n\n`;
    });
  }

  fs.writeFileSync(OUTPUT_PATH, output);
  console.log(`✅ Alias generados exitosamente en: ${OUTPUT_PATH}`);
}

generate();

