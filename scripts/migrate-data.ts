/**
 * Data Migration Script
 *
 * This script migrates data from the JSON files in missale_json_final to PostgreSQL
 *
 * Usage:
 * npm run migrate
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Path to JSON data
const DATA_PATH = path.join(__dirname, '../../missale_json_final');

interface JSONMultiLang {
  pt: string;
  es: string;
  la: string;
  en: string;
  de: string;
  it: string;
}

interface JSONMass {
  id: string;
  titulo: JSONMultiLang;
  antifona_entrada?: JSONMultiLang;
  oracion_colecta?: JSONMultiLang;
  lecturas_link?: string;
  oracion_ofrendas?: JSONMultiLang;
  prefacio?: any;
  antifona_comunion?: JSONMultiLang;
  oracion_postcomunion?: JSONMultiLang;
}

/**
 * Clean HTML tags from text
 */
function cleanHTML(text: string): string {
  if (!text) return '';

  return text
    // Remove script and style tags with content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Keep line breaks as <br> temporarily
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Clean up whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * Create a MultiLangText record in the database
 */
async function createMultiLangText(text: JSONMultiLang) {
  return await prisma.multiLangText.create({
    data: {
      pt: cleanHTML(text.pt || ''),
      es: cleanHTML(text.es || ''),
      la: cleanHTML(text.la || ''),
      en: cleanHTML(text.en || ''),
      de: cleanHTML(text.de || ''),
      it: cleanHTML(text.it || ''),
    },
  });
}

/**
 * Migrate Santos (Saints) data
 */
async function migrateSantos() {
  console.log('🔄 Migrating Santos data...');

  const santosFile = path.join(DATA_PATH, 'santos.json');
  if (!fs.existsSync(santosFile)) {
    console.log('⚠️  santos.json not found, skipping...');
    return;
  }

  const data = JSON.parse(fs.readFileSync(santosFile, 'utf-8'));
  let count = 0;

  // Process each month
  for (const [month, celebrations] of Object.entries(data)) {
    if (month === 'metadata') continue;

    const monthNum = getMonthNumber(month);

    for (const [celebrationId, celebration] of Object.entries(celebrations as Record<string, any>)) {
      const mass = celebration as JSONMass;

      try {
        // Create title
        const title = await createMultiLangText(mass.titulo);

        // Create optional fields
        const entranceAntiphon = mass.antifona_entrada
          ? await createMultiLangText(mass.antifona_entrada)
          : null;

        const collect = mass.oracion_colecta
          ? await createMultiLangText(mass.oracion_colecta)
          : null;

        const prayerOverOfferings = mass.oracion_ofrendas
          ? await createMultiLangText(mass.oracion_ofrendas)
          : null;

        const communionAntiphon = mass.antifona_comunion
          ? await createMultiLangText(mass.antifona_comunion)
          : null;

        const postCommunion = mass.oracion_postcomunion
          ? await createMultiLangText(mass.oracion_postcomunion)
          : null;

        // Extract day from celebration ID (format: MMDD)
        const dayMatch = celebrationId.match(/(\d{2})(\d{2})/);
        const day = dayMatch ? parseInt(dayMatch[2]) : null;

        // Create Mass record
        await prisma.mass.create({
          data: {
            code: `santos_${month}_${celebrationId}`,
            category: 'SAINTS',
            rank: 'MEMORIAL', // Default, should be determined from data
            color: 'WHITE',     // Default, should be determined from data
            month: monthNum,
            day: day,
            titleId: title.id,
            entranceAntiphonId: entranceAntiphon?.id,
            collectId: collect?.id,
            prayerOverOfferingsId: prayerOverOfferings?.id,
            communionAntiphonId: communionAntiphon?.id,
            postCommunionId: postCommunion?.id,
            readingsRef: mass.lecturas_link,
            tags: ['santos', month],
            searchText: [
              title.pt, title.es, title.la, title.en
            ].join(' ').toLowerCase(),
          },
        });

        count++;
        if (count % 10 === 0) {
          console.log(`  ✓ Migrated ${count} saints...`);
        }
      } catch (error) {
        console.error(`  ✗ Error migrating ${celebrationId}:`, error);
      }
    }
  }

  console.log(`✅ Migrated ${count} santos total`);
}

/**
 * Get month number from month name
 */
function getMonthNumber(month: string): number {
  const months: Record<string, number> = {
    'ene': 1, 'enero': 1, 'jan': 1, 'janeiro': 1,
    'feb': 2, 'febrero': 2, 'fev': 2, 'fevereiro': 2,
    'mar': 3, 'marzo': 3, 'março': 3,
    'abr': 4, 'abril': 4,
    'may': 5, 'mayo': 5, 'mai': 5, 'maio': 5,
    'jun': 6, 'junio': 6, 'junho': 6,
    'jul': 7, 'julio': 7, 'julho': 7,
    'ago': 8, 'agosto': 8,
    'sep': 9, 'septiembre': 9, 'set': 9, 'setembro': 9,
    'oct': 10, 'octubre': 10, 'out': 10, 'outubro': 10,
    'nov': 11, 'noviembre': 11, 'novembro': 11,
    'dic': 12, 'diciembre': 12, 'dez': 12, 'dezembro': 12,
  };

  return months[month.toLowerCase()] || 0;
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting data migration...\n');

  try {
    // Clear existing data (optional - comment out in production)
    console.log('🗑️  Clearing existing data...');
    await prisma.mass.deleteMany();
    await prisma.multiLangText.deleteMany();
    console.log('✅ Database cleared\n');

    // Migrate each category
    await migrateSantos();
    // TODO: Add more migration functions:
    // await migrateTiempos();
    // await migrateComunes();
    // await migrateReadings();
    // await migratePrefacios();
    // await migrateEucharisticPrayers();

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
