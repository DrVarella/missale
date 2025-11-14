#!/usr/bin/env tsx
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Path to original HTML files
const MISAL_PATH = '/home/pedro/Missale/original/rcr.missale.romanum_11.5_paid-www.apkhere.com_analise/raw/assets/www/misal';

// Language mapping: HTML class → database code
const LANG_MAP: Record<string, string> = {
  'port': 'pt',
  'cast': 'es',
  'engl': 'en',
  'latin': 'la',
  'germ': 'de',
  'ital': 'it',
};

interface MultiLangText {
  pt: string;
  es: string;
  en: string;
  la: string;
  de: string;
  it: string;
}

interface ParsedMass {
  id: string;
  title: MultiLangText;
  category: 'SANTOS' | 'TIEMPOS' | 'COMUNES';
  precedence: number;
  antEntr: MultiLangText;
  colecta: MultiLangText;
  orOfrend: MultiLangText;
  prefacio: string; // Reference to preface (e.g., "pf056")
  antCom: MultiLangText;
  postCom: MultiLangText;
  lectionarium?: string; // Reference to readings file
}

/**
 * Extract multilingual text from a section (div)
 */
function extractMultiLangText($: cheerio.CheerioAPI, $section: cheerio.Cheerio<cheerio.Element>): MultiLangText {
  const text: Partial<MultiLangText> = {};

  // Find all language divs
  for (const htmlClass of Object.keys(LANG_MAP)) {
    const $langDiv = $section.find(`.${htmlClass}`).not('h2, h3, h4, .red, .indicepref');
    if ($langDiv.length > 0) {
      const dbCode = LANG_MAP[htmlClass] as keyof MultiLangText;
      // Get text content, replace <br> with newlines, trim
      let content = $langDiv.html() || '';
      content = content.replace(/<br\s*\/?>/gi, '\n');
      content = content.replace(/<[^>]+>/g, ''); // Remove other HTML tags
      content = content.trim();
      text[dbCode] = content;
    }
  }

  // Fill in missing languages with empty string
  return {
    pt: text.pt || '',
    es: text.es || '',
    en: text.en || '',
    la: text.la || '',
    de: text.de || '',
    it: text.it || '',
  };
}

/**
 * Extract title from div.x_titulo
 */
function extractTitle($: cheerio.CheerioAPI, $section: cheerio.Cheerio<cheerio.Element>): MultiLangText {
  const title: Partial<MultiLangText> = {};

  for (const htmlClass of Object.keys(LANG_MAP)) {
    const $langDiv = $section.find(`.${htmlClass}`);
    if ($langDiv.length > 0) {
      const dbCode = LANG_MAP[htmlClass] as keyof MultiLangText;
      const $h2 = $langDiv.find('h2');
      if ($h2.length > 0) {
        let text = $h2.html() || '';
        text = text.replace(/<br\s*\/?>/gi, ' - ');
        text = text.replace(/<[^>]+>/g, '');
        title[dbCode] = text.trim();
      }
    }
  }

  return {
    pt: title.pt || '',
    es: title.es || '',
    en: title.en || '',
    la: title.la || '',
    de: title.de || '',
    it: title.it || '',
  };
}

/**
 * Extract precedence (liturgical rank) from hidden input
 */
function extractPrecedence($section: cheerio.Cheerio<cheerio.Element>): number {
  const $input = $section.find('input[type=hidden][class*=precedencia]');
  if ($input.length > 0) {
    const value = $input.attr('value');
    return value ? parseInt(value, 10) : 10;
  }
  return 10; // Default precedence
}

/**
 * Extract preface reference from div.x_prefacio
 */
function extractPrefaceRef($: cheerio.CheerioAPI, $section: cheerio.Cheerio<cheerio.Element>): string {
  const $link = $section.find('a[href*="prefacios.html"]').first();
  if ($link.length > 0) {
    const href = $link.attr('href');
    if (href) {
      const match = href.match(/#(pf\d+)/);
      if (match) {
        return match[1];
      }
    }
  }
  return 'pf001'; // Default: Common preface
}

/**
 * Extract lectionary reference
 */
function extractLectionariumRef($: cheerio.CheerioAPI, $section: cheerio.Cheerio<cheerio.Element>): string | undefined {
  const $link = $section.find('div.lectionarium a[href*="lecturas"]');
  if ($link.length > 0) {
    const href = $link.attr('href');
    if (href) {
      // Extract file name and anchor
      const match = href.match(/lecturas_([^.]+)\.html#(.+)/);
      if (match) {
        return `${match[1]}_${match[2]}`; // e.g., "santos_ene_0102"
      }
    }
  }
  return undefined;
}

/**
 * Parse a single mass entry (div.dia)
 */
function parseMass($: cheerio.CheerioAPI, $dia: cheerio.Cheerio<cheerio.Element>, category: 'SANTOS' | 'TIEMPOS' | 'COMUNES'): ParsedMass | null {
  const id = $dia.attr('id');
  if (!id) {
    console.warn('Mass without ID, skipping');
    return null;
  }

  // Extract all sections
  const $titulo = $dia.find('.x_titulo');
  const $antEnt = $dia.find('.x_ant_ent');
  const $colecta = $dia.find('.x_colecta');
  const $orOfrend = $dia.find('.x_or_ofrend');
  const $prefacio = $dia.find('.x_prefacio');
  const $antCom = $dia.find('.x_ant_com');
  const $postCom = $dia.find('.x_post_com');
  const $lectionarium = $dia.find('.lectionarium');

  const mass: ParsedMass = {
    id,
    category,
    precedence: extractPrecedence($titulo),
    title: extractTitle($, $titulo),
    antEntr: extractMultiLangText($, $antEnt),
    colecta: extractMultiLangText($, $colecta),
    orOfrend: extractMultiLangText($, $orOfrend),
    prefacio: extractPrefaceRef($, $prefacio),
    antCom: extractMultiLangText($, $antCom),
    postCom: extractMultiLangText($, $postCom),
    lectionarium: extractLectionariumRef($, $lectionarium),
  };

  return mass;
}

/**
 * Parse an HTML file and extract all masses
 */
async function parseHTMLFile(filePath: string, category: 'SANTOS' | 'TIEMPOS' | 'COMUNES'): Promise<ParsedMass[]> {
  try {
    const html = await fs.readFile(filePath, 'utf-8');
    const $ = cheerio.load(html);
    const masses: ParsedMass[] = [];

    // Find all div.dia (mass entries)
    $('div.dia').each((_, elem) => {
      const $dia = $(elem);
      const mass = parseMass($, $dia, category);
      if (mass) {
        masses.push(mass);
      }
    });

    console.log(`✓ Parsed ${masses.length} masses from ${path.basename(filePath)}`);
    return masses;
  } catch (error) {
    console.error(`✗ Error parsing ${filePath}:`, error);
    return [];
  }
}

/**
 * Save parsed masses to database
 */
async function saveMassesToDB(masses: ParsedMass[]) {
  console.log(`\n📊 Saving ${masses.length} masses to database...`);

  let saved = 0;
  let errors = 0;

  for (const mass of masses) {
    try {
      // Create MultiLangText records for each section
      const titleText = await prisma.multiLangText.create({
        data: mass.title,
      });

      const antEntrText = await prisma.multiLangText.create({
        data: mass.antEntr,
      });

      const colectaText = await prisma.multiLangText.create({
        data: mass.colecta,
      });

      const orOfrendText = await prisma.multiLangText.create({
        data: mass.orOfrend,
      });

      const antComText = await prisma.multiLangText.create({
        data: mass.antCom,
      });

      const postComText = await prisma.multiLangText.create({
        data: mass.postCom,
      });

      // Determine liturgical color and rank based on category and precedence
      let color: 'GREEN' | 'PURPLE' | 'WHITE' | 'RED' | 'ROSE' | 'BLACK' | 'GOLD' = 'GREEN';
      let rank: 'SOLEMNITY' | 'FEAST' | 'MEMORIAL' | 'OPTIONAL_MEMORIAL' | 'FERIA' = 'MEMORIAL';

      // Simplified logic - can be enhanced later
      if (mass.precedence <= 3) {
        rank = 'SOLEMNITY';
        color = 'WHITE';
      } else if (mass.precedence <= 6) {
        rank = 'FEAST';
        color = 'WHITE';
      } else if (mass.precedence <= 10) {
        rank = 'MEMORIAL';
      } else {
        rank = 'OPTIONAL_MEMORIAL';
      }

      // Determine season (simplified - can be enhanced)
      let season: 'ADVENT' | 'CHRISTMAS' | 'ORDINARY_TIME' | 'LENT' | 'HOLY_WEEK' | 'EASTER' | null = null;
      if (mass.category === 'TIEMPOS') {
        // Try to infer season from ID
        if (mass.id.startsWith('A')) season = 'ADVENT';
        else if (mass.id.startsWith('N')) season = 'CHRISTMAS';
        else if (mass.id.startsWith('Q')) season = 'LENT';
        else if (mass.id.startsWith('S')) season = 'HOLY_WEEK';
        else if (mass.id.startsWith('P')) season = 'EASTER';
        else season = 'ORDINARY_TIME';
      }

      // Map category to MassCategory enum
      const massCategory = mass.category === 'SANTOS' ? 'SAINTS' :
                          mass.category === 'TIEMPOS' ? 'SEASONS' : 'COMMONS';

      // Extract month and day from code if it's a 4-digit number (MMDD format)
      let month: number | null = null;
      let day: number | null = null;
      const codeMatch = mass.id.match(/^(\d{2})(\d{2})/);
      if (codeMatch) {
        month = parseInt(codeMatch[1], 10);
        day = parseInt(codeMatch[2], 10);
      }

      // Create Mass record
      await prisma.mass.create({
        data: {
          code: mass.id,
          category: massCategory,
          season: season,
          rank: rank,
          color: color,
          precedence: mass.precedence,
          month: month,
          day: day,
          titleId: titleText.id,
          entranceAntiphonId: antEntrText.id,
          collectId: colectaText.id,
          prayerOverOfferingsId: orOfrendText.id,
          communionAntiphonId: antComText.id,
          postCommunionId: postComText.id,
          prefaceRef: mass.prefacio,
          searchText: `${mass.title.pt} ${mass.title.la}`.toLowerCase(),
          tags: null,
        },
      });

      saved++;
      if (saved % 50 === 0) {
        console.log(`  ✓ Saved ${saved}/${masses.length} masses...`);
      }
    } catch (error) {
      console.error(`  ✗ Error saving mass ${mass.id}:`, error);
      errors++;
    }
  }

  console.log(`\n✅ Complete: ${saved} masses saved, ${errors} errors`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting HTML mass parser...\n');

  const allMasses: ParsedMass[] = [];

  // Parse Santos (Saints) - all 14 files
  console.log('📖 Parsing Santos (Saints)...');
  const santosFiles = [
    'santos/santos_ene.html',
    'santos/santos_feb.html',
    'santos/santos_mar.html',
    'santos/santos_abr.html',
    'santos/santos_may.html',
    'santos/santos_jun.html',
    'santos/santos_jul.html',
    'santos/santos_ago.html',
    'santos/santos_sep.html',
    'santos/santos_oct.html',
    'santos/santos_nov.html',
    'santos/santos_dic.html',
    'santos/santos_obra.html',
    'santos/santos_africa.html',
  ];

  for (const file of santosFiles) {
    const filePath = path.join(MISAL_PATH, file);
    const masses = await parseHTMLFile(filePath, 'SANTOS');
    allMasses.push(...masses);
  }

  // Parse Tiempos (Liturgical Seasons)
  console.log('\n📖 Parsing Tiempos (Liturgical Seasons)...');
  const tiemposFiles = [
    'tiempos/tiempos_advnav.html',
    'tiempos/tiempos_cuaresma.html',
    'tiempos/tiempos_pascua.html',
    'tiempos/tiempos_ordinario.html',
    'tiempos/tiempos_semanasta.html',
    'tiempos/tiempos_semanasta2.html',
    'tiempos/tiempos_semanasta3.html',
    'tiempos/tiempos_semanasta4.html',
    'tiempos/tiempos_semanasta5.html',
  ];

  for (const file of tiemposFiles) {
    const filePath = path.join(MISAL_PATH, file);
    const masses = await parseHTMLFile(filePath, 'TIEMPOS');
    allMasses.push(...masses);
  }

  // Parse Comunes (Commons & Votives)
  console.log('\n📖 Parsing Comunes (Commons & Votives)...');
  const comunesFiles = [
    'comunes_votivas/comunes_bmv.html',
    'comunes_votivas/comunes_past.html',
    'comunes_votivas/comunes_mart.html',
    'comunes_votivas/comunes_sant.html',
    'comunes_votivas/comunes_doct.html',
    'comunes_votivas/comunes_virg.html',
    'comunes_votivas/comunes_ded.html',
    'comunes_votivas/votivas.html',
    'comunes_votivas/diversas.html',
    'comunes_votivas/difuntos.html',
  ];

  for (const file of comunesFiles) {
    const filePath = path.join(MISAL_PATH, file);
    const masses = await parseHTMLFile(filePath, 'COMUNES');
    allMasses.push(...masses);
  }

  console.log(`\n📊 Total masses parsed: ${allMasses.length}`);

  // Save to database
  await saveMassesToDB(allMasses);

  await prisma.$disconnect();
  console.log('\n🎉 Migration complete!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
