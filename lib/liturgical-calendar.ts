import { LiturgicalSeason, LiturgicalColor } from './types';

/**
 * Calculate Easter Sunday using Meeus/Jones/Butcher algorithm
 * Valid for years 1583-4099
 */
export function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Get the liturgical season for a given date
 */
export function getLiturgicalSeason(date: Date): LiturgicalSeason {
  const year = date.getFullYear();
  const easter = calculateEaster(year);

  // Advent starts 4 Sundays before Christmas (Nov 27 - Dec 3)
  const christmas = new Date(year, 11, 25);
  const adventStart = getPreviousSunday(christmas, 4);

  // Christmas season: Dec 25 - Baptism of the Lord (Sunday after Epiphany)
  const epiphany = new Date(year, 0, 6);
  const baptismOfLord = getNextSunday(epiphany);
  const christmasEnd = baptismOfLord;

  // Lent starts on Ash Wednesday (46 days before Easter)
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);

  // Holy Week starts on Palm Sunday (7 days before Easter)
  const palmSunday = new Date(easter);
  palmSunday.setDate(easter.getDate() - 7);

  // Easter season ends on Pentecost (49 days after Easter)
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);

  // Check seasons in order
  if (date >= adventStart && date < christmas) {
    return 'ADVENT';
  }
  if (date >= christmas && date <= christmasEnd) {
    return 'CHRISTMAS';
  }
  if (date >= ashWednesday && date < palmSunday) {
    return 'LENT';
  }
  if (date >= palmSunday && date < easter) {
    return 'HOLY_WEEK';
  }
  if (date >= easter && date <= pentecost) {
    return 'EASTER';
  }

  return 'ORDINARY_TIME';
}

/**
 * Get the liturgical color for a season (default, can be overridden by specific celebrations)
 */
export function getSeasonColor(season: LiturgicalSeason): LiturgicalColor {
  const colorMap: Record<LiturgicalSeason, LiturgicalColor> = {
    ADVENT: 'PURPLE',
    CHRISTMAS: 'WHITE',
    ORDINARY_TIME: 'GREEN',
    LENT: 'PURPLE',
    HOLY_WEEK: 'RED',
    EASTER: 'WHITE',
  };

  return colorMap[season];
}

/**
 * Get the previous Sunday before a date
 */
function getPreviousSunday(date: Date, weeksBack: number = 1): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 7 * weeksBack : dayOfWeek + 7 * (weeksBack - 1);
  result.setDate(result.getDate() - daysToSubtract);
  return result;
}

/**
 * Get the next Sunday after a date
 */
function getNextSunday(date: Date): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  const daysToAdd = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

/**
 * Check if a date is a Sunday
 */
export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Get the week number of a liturgical season
 */
export function getWeekOfSeason(date: Date, season: LiturgicalSeason): number {
  const year = date.getFullYear();

  if (season === 'ADVENT') {
    const christmas = new Date(year, 11, 25);
    const adventStart = getPreviousSunday(christmas, 4);
    const diffTime = Math.abs(date.getTime() - adventStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.floor(diffDays / 7) + 1, 4);
  }

  if (season === 'LENT') {
    const easter = calculateEaster(year);
    const ashWednesday = new Date(easter);
    ashWednesday.setDate(easter.getDate() - 46);
    const diffTime = Math.abs(date.getTime() - ashWednesday.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.floor(diffDays / 7) + 1, 6);
  }

  if (season === 'EASTER') {
    const easter = calculateEaster(year);
    const diffTime = Math.abs(date.getTime() - easter.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.floor(diffDays / 7) + 1, 7);
  }

  return 0;
}

/**
 * Get important liturgical dates for a year
 */
export function getLiturgicalDates(year: number) {
  const easter = calculateEaster(year);
  const christmas = new Date(year, 11, 25);

  // Advent
  const adventStart = getPreviousSunday(christmas, 4);

  // Lent
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);

  // Holy Week
  const palmSunday = new Date(easter);
  palmSunday.setDate(easter.getDate() - 7);

  const holyThursday = new Date(easter);
  holyThursday.setDate(easter.getDate() - 3);

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  const holySaturday = new Date(easter);
  holySaturday.setDate(easter.getDate() - 1);

  // Easter Season
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);

  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);

  // Other important dates
  const epiphany = new Date(year, 0, 6);
  const baptismOfLord = getNextSunday(epiphany);

  const allSaints = new Date(year, 10, 1); // November 1
  const allSouls = new Date(year, 10, 2); // November 2

  return {
    // Advent & Christmas
    adventStart,
    christmas,
    epiphany,
    baptismOfLord,

    // Lent
    ashWednesday,

    // Holy Week
    palmSunday,
    holyThursday,
    goodFriday,
    holySaturday,

    // Easter
    easter,
    ascension,
    pentecost,

    // Other
    allSaints,
    allSouls,
  };
}

/**
 * Format a date for display
 */
export function formatLiturgicalDate(date: Date, locale: string = 'pt-BR'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
