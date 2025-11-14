// Language codes
export type LanguageCode = 'pt' | 'es' | 'la' | 'en' | 'de' | 'it';

// Liturgical colors matching Prisma enum
export type LiturgicalColor = 'GREEN' | 'PURPLE' | 'WHITE' | 'RED' | 'ROSE' | 'BLACK' | 'GOLD';

// Liturgical ranks matching Prisma enum
export type LiturgicalRank = 'SOLEMNITY' | 'FEAST' | 'MEMORIAL' | 'OPTIONAL_MEMORIAL' | 'FERIAL';

// Liturgical seasons matching Prisma enum
export type LiturgicalSeason = 'ADVENT' | 'CHRISTMAS' | 'ORDINARY_TIME' | 'LENT' | 'HOLY_WEEK' | 'EASTER';

// Mass categories matching Prisma enum
export type MassCategory = 'ORDINARY' | 'SEASONAL' | 'SAINTS' | 'COMMONS' | 'VOTIVE' | 'FUNERAL' | 'VARIOUS' | 'READINGS' | 'PREFACES' | 'EUCHARISTIC';

// Multi-language text interface
export interface MultiLangText {
  pt: string;  // Portuguese
  es: string;  // Spanish
  la: string;  // Latin
  en: string;  // English
  de: string;  // German
  it: string;  // Italian
}

// Mass data structure (simplified for frontend)
export interface Mass {
  id: string;
  code: string;
  category: MassCategory;
  season?: LiturgicalSeason;
  rank: LiturgicalRank;
  color: LiturgicalColor;
  date?: Date;
  month?: number;
  day?: number;

  title: MultiLangText;
  entranceAntiphon?: MultiLangText;
  collect?: MultiLangText;
  prayerOverOfferings?: MultiLangText;
  communionAntiphon?: MultiLangText;
  postCommunion?: MultiLangText;

  readingsRef?: string;
  prefaceRef?: string;
  eucharisticPrayerRef?: string;

  tags?: string; // JSON string array
}

// Reading structure
export interface Reading {
  id: string;
  code: string;
  firstReadingRef?: string;
  firstReadingText?: string;
  psalmRef?: string;
  psalmText?: string;
  secondReadingRef?: string;
  secondReadingText?: string;
  gospelRef: string;
  gospelText?: string;
  alleluiaVerse?: string;
}

// Preface structure
export interface Preface {
  id: string;
  code: string;
  text: MultiLangText;
}

// Eucharistic Prayer structure
export interface EucharisticPrayer {
  id: string;
  code: string;
  number?: number;
  text: MultiLangText;
}

// User preferences
export interface UserPreferences {
  primaryLanguage: LanguageCode;
  secondaryLanguage?: LanguageCode;
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif';
  showRubrics: boolean;
  showBackground: boolean;
  darkMode: boolean;
  textPresentation: 'sideBySide' | 'alternating' | 'single';
}

// Liturgical day info (for calendar)
export interface LiturgicalDay {
  date: Date;
  season: LiturgicalSeason;
  color: LiturgicalColor;
  masses: Mass[];  // Can have multiple options (saint + ferial, etc.)
  primaryMass?: Mass;  // The one with highest rank
  weekOfSeason?: number;
  dayOfWeek: number;  // 0 = Sunday
}

// Language names for UI
export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  pt: 'Português',
  es: 'Español',
  la: 'Latina',
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
};

// Color hex values for UI
export const LITURGICAL_COLOR_VALUES: Record<LiturgicalColor, string> = {
  GREEN: 'var(--liturgical-green)',
  PURPLE: 'var(--liturgical-purple)',
  WHITE: 'var(--liturgical-white)',
  RED: 'var(--liturgical-red)',
  ROSE: 'var(--liturgical-rose)',
  BLACK: 'var(--liturgical-black)',
  GOLD: 'var(--liturgical-gold)',
};

// Season names for UI
export const SEASON_NAMES: Record<LiturgicalSeason, MultiLangText> = {
  ADVENT: {
    pt: 'Advento',
    es: 'Adviento',
    la: 'Adventus',
    en: 'Advent',
    de: 'Advent',
    it: 'Avvento',
  },
  CHRISTMAS: {
    pt: 'Natal',
    es: 'Navidad',
    la: 'Nativitas',
    en: 'Christmas',
    de: 'Weihnachten',
    it: 'Natale',
  },
  ORDINARY_TIME: {
    pt: 'Tempo Comum',
    es: 'Tiempo Ordinario',
    la: 'Tempus per Annum',
    en: 'Ordinary Time',
    de: 'Zeit im Jahreskreis',
    it: 'Tempo Ordinario',
  },
  LENT: {
    pt: 'Quaresma',
    es: 'Cuaresma',
    la: 'Quadragesima',
    en: 'Lent',
    de: 'Fastenzeit',
    it: 'Quaresima',
  },
  HOLY_WEEK: {
    pt: 'Semana Santa',
    es: 'Semana Santa',
    la: 'Hebdomada Sancta',
    en: 'Holy Week',
    de: 'Karwoche',
    it: 'Settimana Santa',
  },
  EASTER: {
    pt: 'Páscoa',
    es: 'Pascua',
    la: 'Paschalis',
    en: 'Easter',
    de: 'Osterzeit',
    it: 'Pasqua',
  },
};
