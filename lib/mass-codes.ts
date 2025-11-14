/**
 * Mass Code System Documentation and Utilities
 *
 * This file documents the ID/Code system used for liturgical celebrations
 * and provides utility functions for working with them.
 */

export type MassCodeType = 'SAINT' | 'SEASON' | 'COMMON'

/**
 * MASS CODE SCHEMA
 * ================
 *
 * 1. SANTOS (Saints) - Category: SAINTS
 *    Format: MMDD[VARIANT]
 *    - MMDD: Month (01-12) + Day (01-31)
 *    - VARIANT: Optional letter suffix for multiple celebrations on same day
 *      - Z: Second celebration
 *      - Y: Third celebration
 *      - X: Fourth celebration
 *
 *    Examples:
 *    - "0102" = January 2 (St. Basil & Gregory Nazianzen)
 *    - "0120Z" = January 20, second celebration
 *    - "1225" = December 25 (Nativity)
 *
 * 2. TIEMPOS (Liturgical Seasons) - Category: SEASONS
 *    Format: {SEASON_CODE}{WEEK_NUM}{DAY_NUM}
 *
 *    Season Codes:
 *    - A: Advent (Adviento)
 *    - N: Christmas (Navidad)
 *    - Q: Lent (Cuaresma/Quadragesima)
 *    - S: Holy Week (Semana Santa)
 *    - P: Easter (Pascua)
 *    - TO: Ordinary Time (Tiempo Ordinario)
 *
 *    Week Number: 01-34 (Ordinary Time has 34 weeks)
 *    Day Number: 0-6 (0=Sunday, 1=Monday, ..., 6=Saturday)
 *
 *    Examples:
 *    - "A010" = Advent, Week 1, Sunday
 *    - "A011" = Advent, Week 1, Monday
 *    - "Q015" = Lent, Week 1, Friday
 *    - "P070" = Easter, Week 7, Sunday (Pentecost)
 *    - "TO010" = Ordinary Time, Week 1, Sunday
 *
 * 3. COMUNES (Commons, Votives, Various) - Category: COMMONS
 *    Format: {TYPE_PREFIX}{NUMBER}
 *
 *    Type Prefixes:
 *    - bmv: Blessed Mary Virgin (Beata Maria Virgen)
 *    - past: Pastors (Pastores)
 *    - mart: Martyrs (Mártires)
 *    - sant: Saints (Santos)
 *    - doct: Doctors (Doctores)
 *    - virg: Virgins (Virgenes)
 *    - ded: Dedication (Dedicación)
 *    - vot: Votive Masses (Votivas)
 *    - div: Various Masses (Diversas)
 *    - dif: Deceased (Difuntos)
 *
 *    Examples:
 *    - "bmv1" = Common of BVM, option 1
 *    - "past3" = Common of Pastors, option 3
 *    - "vot12" = Votive Mass #12
 */

/**
 * Determine the type of mass code
 */
export function getMassCodeType(code: string): MassCodeType {
  // SAINT: 4 digits optionally followed by letters
  if (/^\d{4}[A-Z]*$/.test(code)) {
    return 'SAINT'
  }

  // SEASON: Letter(s) followed by digits
  if (/^[A-Z]{1,2}\d+$/.test(code)) {
    return 'SEASON'
  }

  // COMMON: Everything else (text-based codes)
  return 'COMMON'
}

/**
 * Parse a saint code into month and day
 */
export function parseSaintCode(code: string): { month: number; day: number; variant?: string } | null {
  const match = code.match(/^(\d{2})(\d{2})([A-Z]*)$/)
  if (!match) return null

  return {
    month: parseInt(match[1], 10),
    day: parseInt(match[2], 10),
    variant: match[3] || undefined
  }
}

/**
 * Parse a season code
 */
export function parseSeasonCode(code: string): {
  season: 'ADVENT' | 'CHRISTMAS' | 'LENT' | 'HOLY_WEEK' | 'EASTER' | 'ORDINARY_TIME'
  week: number
  day: number
} | null {
  const match = code.match(/^([A-Z]{1,2})(\d{2})(\d)$/)
  if (!match) return null

  const seasonMap: Record<string, 'ADVENT' | 'CHRISTMAS' | 'LENT' | 'HOLY_WEEK' | 'EASTER' | 'ORDINARY_TIME'> = {
    'A': 'ADVENT',
    'N': 'CHRISTMAS',
    'Q': 'LENT',
    'S': 'HOLY_WEEK',
    'P': 'EASTER',
    'TO': 'ORDINARY_TIME'
  }

  const season = seasonMap[match[1]]
  if (!season) return null

  return {
    season,
    week: parseInt(match[2], 10),
    day: parseInt(match[3], 10)
  }
}

/**
 * Create a saint code from month and day
 */
export function createSaintCode(month: number, day: number, variant?: string): string {
  const mm = month.toString().padStart(2, '0')
  const dd = day.toString().padStart(2, '0')
  return `${mm}${dd}${variant || ''}`
}

/**
 * Create a season code
 */
export function createSeasonCode(
  season: 'ADVENT' | 'CHRISTMAS' | 'LENT' | 'HOLY_WEEK' | 'EASTER' | 'ORDINARY_TIME',
  week: number,
  day: number
): string {
  const seasonCodes: Record<string, string> = {
    'ADVENT': 'A',
    'CHRISTMAS': 'N',
    'LENT': 'Q',
    'HOLY_WEEK': 'S',
    'EASTER': 'P',
    'ORDINARY_TIME': 'TO'
  }

  const code = seasonCodes[season]
  const ww = week.toString().padStart(2, '0')
  const d = day.toString()

  return `${code}${ww}${d}`
}

/**
 * Get next day code for a saint
 * Returns null if it's December 31
 */
export function getNextSaintCode(code: string): string | null {
  const parsed = parseSaintCode(code)
  if (!parsed) return null

  const { month, day, variant } = parsed

  // Days in each month (non-leap year)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  // If December 31, no next day in calendar year
  if (month === 12 && day === 31) {
    return null
  }

  // If last day of month, go to first day of next month
  if (day === daysInMonth[month - 1]) {
    return createSaintCode(month + 1, 1)
  }

  // Otherwise, just increment day
  return createSaintCode(month, day + 1)
}

/**
 * Get previous day code for a saint
 * Returns null if it's January 1
 */
export function getPreviousSaintCode(code: string): string | null {
  const parsed = parseSaintCode(code)
  if (!parsed) return null

  const { month, day, variant } = parsed

  // Days in each month (non-leap year)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  // If January 1, no previous day in calendar year
  if (month === 1 && day === 1) {
    return null
  }

  // If first day of month, go to last day of previous month
  if (day === 1) {
    return createSaintCode(month - 1, daysInMonth[month - 2])
  }

  // Otherwise, just decrement day
  return createSaintCode(month, day - 1)
}

/**
 * Get next season code
 */
export function getNextSeasonCode(code: string): string | null {
  const parsed = parseSeasonCode(code)
  if (!parsed) return null

  const { season, week, day } = parsed

  // If Saturday, go to next week Sunday
  if (day === 6) {
    return createSeasonCode(season, week + 1, 0)
  }

  // Otherwise, just increment day
  return createSeasonCode(season, week, day + 1)
}

/**
 * Get previous season code
 */
export function getPreviousSeasonCode(code: string): string | null {
  const parsed = parseSeasonCode(code)
  if (!parsed) return null

  const { season, week, day } = parsed

  // If Sunday and week 1, can't go back
  if (day === 0 && week === 1) {
    return null
  }

  // If Sunday, go to previous week Saturday
  if (day === 0) {
    return createSeasonCode(season, week - 1, 6)
  }

  // Otherwise, just decrement day
  return createSeasonCode(season, week, day - 1)
}
