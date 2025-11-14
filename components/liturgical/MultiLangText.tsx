'use client';

import { MultiLangText as MultiLangTextType, LanguageCode } from '@/lib/types';
import { useMassView } from '@/lib/contexts/MassViewContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState } from 'react';

interface MultiLangTextProps {
  text: MultiLangTextType;
  sectionId?: string; // Unique ID for this section (for override tracking)
  className?: string;
  showLanguageMenu?: boolean; // Whether to show the language selection menu
}

const LANGUAGES = [
  { code: 'la' as LanguageCode, name: 'Latina', flag: '🇻🇦' },
  { code: 'pt' as LanguageCode, name: 'Português', flag: '🇧🇷' },
  { code: 'es' as LanguageCode, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as LanguageCode, name: 'English', flag: '🇬🇧' },
  { code: 'de' as LanguageCode, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it' as LanguageCode, name: 'Italiano', flag: '🇮🇹' },
];

export function MultiLangText({
  text,
  sectionId,
  className = '',
  showLanguageMenu = true,
}: MultiLangTextProps) {
  const {
    primaryLang,
    secondaryLang,
    displayMode,
    layoutMode,
    sectionOverrides,
    setSectionOverride,
    clearSectionOverride,
    fontSize,
  } = useMassView();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine which language to show (check for override first)
  const getLanguageForSection = () => {
    if (sectionId && sectionOverrides[sectionId]) {
      return sectionOverrides[sectionId];
    }
    return displayMode === 'secondary' && secondaryLang ? secondaryLang : primaryLang;
  };

  const handleLanguageSelect = (lang: LanguageCode) => {
    if (sectionId) {
      setSectionOverride(sectionId, lang);
    }
    setIsMenuOpen(false);
  };

  const handleClearOverride = () => {
    if (sectionId) {
      clearSectionOverride(sectionId);
    }
    setIsMenuOpen(false);
  };

  // Render based on layout mode
  if (layoutMode === 'single' || !secondaryLang) {
    const lang = getLanguageForSection();
    const hasOverride = sectionId && sectionOverrides[sectionId];

    return (
      <div
        className={`liturgical-text relative group ${className}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div
          className={`px-3 py-2 rounded-md transition-colors ${
            hasOverride ? 'bg-accent/20 border border-accent' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: text[lang] || '' }}
        />

        {/* Language menu button (appears on hover) */}
        {showLanguageMenu && sectionId && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 rounded-full shadow-md"
                  title="Escolher idioma para este trecho"
                >
                  <Globe className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-1">
                  <p className="text-sm font-medium mb-2">Idioma deste trecho:</p>
                  {LANGUAGES.map((language) => (
                    <Button
                      key={language.code}
                      variant={lang === language.code ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      size="sm"
                      onClick={() => handleLanguageSelect(language.code)}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </Button>
                  ))}
                  {hasOverride && (
                    <>
                      <div className="border-t my-2" />
                      <Button
                        variant="outline"
                        className="w-full justify-start text-xs"
                        size="sm"
                        onClick={handleClearOverride}
                      >
                        Remover personalização
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    );
  }

  // Double column layout (side by side)
  if (displayMode === 'both' && secondaryLang) {
    const primaryOverride = sectionId && sectionOverrides[`${sectionId}-primary`];
    const secondaryOverride = sectionId && sectionOverrides[`${sectionId}-secondary`];
    const effectivePrimaryLang = primaryOverride || primaryLang;
    const effectiveSecondaryLang = secondaryOverride || secondaryLang;

    return (
      <div
        className={`liturgical-text grid grid-cols-2 gap-6 ${className}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {/* Primary language column */}
        <div className="relative group">
          <div
            className={`px-3 py-2 rounded-md border-r border-border transition-colors ${
              primaryOverride ? 'bg-accent/20 border border-accent' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: text[effectivePrimaryLang] || '' }}
          />
          {showLanguageMenu && sectionId && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full shadow-md"
                    title="Escolher idioma para este trecho"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-1">
                    <p className="text-sm font-medium mb-2">Coluna primária:</p>
                    {LANGUAGES.map((language) => (
                      <Button
                        key={language.code}
                        variant={effectivePrimaryLang === language.code ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => {
                          if (sectionId) {
                            setSectionOverride(`${sectionId}-primary`, language.code);
                          }
                        }}
                      >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                      </Button>
                    ))}
                    {primaryOverride && (
                      <>
                        <div className="border-t my-2" />
                        <Button
                          variant="outline"
                          className="w-full justify-start text-xs"
                          size="sm"
                          onClick={() => {
                            if (sectionId) {
                              clearSectionOverride(`${sectionId}-primary`);
                            }
                          }}
                        >
                          Remover personalização
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Secondary language column */}
        <div className="relative group">
          <div
            className={`px-3 py-2 rounded-md transition-colors ${
              secondaryOverride ? 'bg-accent/20 border border-accent' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: text[effectiveSecondaryLang] || '' }}
          />
          {showLanguageMenu && sectionId && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full shadow-md"
                    title="Escolher idioma para este trecho"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-1">
                    <p className="text-sm font-medium mb-2">Coluna secundária:</p>
                    {LANGUAGES.map((language) => (
                      <Button
                        key={language.code}
                        variant={effectiveSecondaryLang === language.code ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => {
                          if (sectionId) {
                            setSectionOverride(`${sectionId}-secondary`, language.code);
                          }
                        }}
                      >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                      </Button>
                    ))}
                    {secondaryOverride && (
                      <>
                        <div className="border-t my-2" />
                        <Button
                          variant="outline"
                          className="w-full justify-start text-xs"
                          size="sm"
                          onClick={() => {
                            if (sectionId) {
                              clearSectionOverride(`${sectionId}-secondary`);
                            }
                          }}
                        >
                          Remover personalização
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: show primary or secondary based on displayMode
  const lang = displayMode === 'secondary' && secondaryLang ? secondaryLang : primaryLang;
  return (
    <div className={`liturgical-text ${className}`} style={{ fontSize: `${fontSize}px` }}>
      <div
        className="px-3 py-2 rounded-md"
        dangerouslySetInnerHTML={{ __html: text[lang] || '' }}
      />
    </div>
  );
}
