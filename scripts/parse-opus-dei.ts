#!/usr/bin/env tsx
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OPUS_DEI_FILE = '/home/pedro/Missale/original/rcr.missale.romanum_11.5_paid-www.apkhere.com_analise/raw/assets/www/misal/santos/santos_obra.html';

const LANG_MAP: Record<string, string> = {
  'port': 'pt',
  'cast': 'es',
  'engl': 'en',
  'latin': 'la',
};

interface MultiLangText {
  pt: string;
  es: string;
  en: string;
  la: string;
  de: string;
  it: string;
}

/**
 * Extract multilingual text from divs with ontouchend='cambialengua(this)'
 * These divs are siblings, each containing one language
 */
function extractMultiLangTextOpusDei($: cheerio.CheerioAPI, $parent: cheerio.Cheerio<cheerio.Element>, selector: string): MultiLangText {
  const text: Partial<MultiLangText> = {};

  const $divs = $parent.find(selector);

  $divs.each((_, elem) => {
    const $div = $(elem);
    const classAttr = $div.attr('class');

    if (classAttr) {
      const htmlClass = classAttr.split(' ')[0]; // Get first class
      const dbCode = LANG_MAP[htmlClass] as keyof MultiLangText;

      if (dbCode) {
        // Clone the element to manipulate
        const $clone = $div.clone();

        // Remove h2, h3, h4 headers and .red rubrics
        $clone.find('h2, h3, h4, .red, span.alindcha').remove();

        let content = $clone.html() || '';
        content = content.replace(/<br\s*\/?>/gi, '\n');
        content = content.replace(/<[^>]+>/g, '');
        content = content.replace(/\s+/g, ' ').trim();

        text[dbCode] = content;
      }
    }
  });

  return {
    pt: text.pt || '',
    es: text.es || '',
    en: text.en || '',
    la: text.la || '',
    de: '',
    it: '',
  };
}

/**
 * Extract title from x_titulo divs
 */
function extractTitleOpusDei($: cheerio.CheerioAPI, $titulo: cheerio.Cheerio<cheerio.Element>): MultiLangText {
  const title: Partial<MultiLangText> = {};

  $titulo.children('div').each((_, elem) => {
    const $div = $(elem);
    const classAttr = $div.attr('class');

    if (classAttr) {
      const htmlClass = classAttr.split(' ')[0];
      const dbCode = LANG_MAP[htmlClass] as keyof MultiLangText;

      if (dbCode) {
        const $h2 = $div.find('h2');
        if ($h2.length > 0) {
          let text = $h2.html() || '';
          text = text.replace(/<br\s*\/?>/gi, ' - ');
          text = text.replace(/<[^>]+>/g, '');
          title[dbCode] = text.trim();
        }
      }
    }
  });

  return {
    pt: title.pt || '',
    es: title.es || '',
    en: title.en || '',
    la: title.la || '',
    de: '',
    it: '',
  };
}

/**
 * Extract precedence from hidden input
 */
function extractPrecedence($titulo: cheerio.Cheerio<cheerio.Element>): number {
  const $input = $titulo.find('input[type=hidden]');
  if ($input.length > 0) {
    const value = $input.attr('value');
    return value ? parseInt(value, 10) : 10;
  }
  return 10;
}

async function parseOpusDeiMasses() {
  console.log('🔍 Parsing Opus Dei masses from santos_obra.html...\n');

  try {
    const html = await fs.readFile(OPUS_DEI_FILE, 'utf-8');
    const $ = cheerio.load(html);

    let parsed = 0;
    let updated = 0;
    let created = 0;

    $('div.dia').each((_, elem) => {
      const $dia = $(elem);
      const id = $dia.attr('id');

      if (!id) return;

      parsed++;

      console.log(`\nProcessing mass: ${id}`);

      // Extract sections
      const $titulo = $dia.find('.x_titulo');
      const $antEnt = $dia.find('.x_ant_ent');
      const $colecta = $dia.find('.x_colecta');
      const $orOfrend = $dia.find('.x_or_ofrend');
      const $antCom = $dia.find('.x_ant_com');
      const $postCom = $dia.find('.x_post_com');

      // Extract data
      const precedence = extractPrecedence($titulo);
      const title = extractTitleOpusDei($, $titulo);
      const antEntr = extractMultiLangTextOpusDei($, $antEnt, "div[class*='port'], div[class*='cast'], div[class*='latin'], div[class*='engl']");
      const colecta = extractMultiLangTextOpusDei($, $colecta, "div[class*='port'], div[class*='cast'], div[class*='latin'], div[class*='engl']");
      const orOfrend = extractMultiLangTextOpusDei($, $orOfrend, "div[class*='port'], div[class*='cast'], div[class*='latin'], div[class*='engl']");
      const antCom = extractMultiLangTextOpusDei($, $antCom, "div[class*='port'], div[class*='cast'], div[class*='latin'], div[class*='engl']");
      const postCom = extractMultiLangTextOpusDei($, $postCom, "div[class*='port'], div[class*='cast'], div[class*='latin'], div[class*='engl']");

      console.log(`  Title PT: ${title.pt.substring(0, 50)}...`);
      console.log(`  Title LA: ${title.la.substring(0, 50)}...`);
      console.log(`  Precedence: ${precedence}`);

      // Store for database update
      (async () => {
        try {
          // Check if mass already exists
          const existing = await prisma.mass.findFirst({
            where: { code: id }
          });

          if (existing) {
            console.log(`  ✓ Mass ${id} exists, updating...`);

            // Update MultiLangText records
            await prisma.multiLangText.update({
              where: { id: existing.titleId },
              data: title
            });

            await prisma.multiLangText.update({
              where: { id: existing.entranceAntiphonId },
              data: antEntr
            });

            await prisma.multiLangText.update({
              where: { id: existing.collectId },
              data: colecta
            });

            await prisma.multiLangText.update({
              where: { id: existing.prayerOverOfferingsId },
              data: orOfrend
            });

            await prisma.multiLangText.update({
              where: { id: existing.communionAntiphonId },
              data: antCom
            });

            await prisma.multiLangText.update({
              where: { id: existing.postCommunionId },
              data: postCom
            });

            console.log(`  ✅ Updated mass ${id}`);
            updated++;
          } else {
            console.log(`  ℹ️  Mass ${id} not found, skipping (should be created by main parser first)`);
          }
        } catch (error) {
          console.error(`  ❌ Error processing mass ${id}:`, error);
        }
      })();
    });

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`\n✅ Opus Dei parsing complete!`);
    console.log(`   Parsed: ${parsed} masses`);
    console.log(`   Updated: ${updated} masses`);

  } catch (error) {
    console.error('❌ Error parsing Opus Dei file:', error);
  }
}

async function main() {
  await parseOpusDeiMasses();
  await prisma.$disconnect();
}

main().catch(console.error);
