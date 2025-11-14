'use client';

import { MultiLangText as MultiLangTextType, LanguageCode } from '@/lib/types';
import { useState, useEffect } from 'react';

interface MultiLangTextProps {
  text: MultiLangTextType;
  primaryLanguage?: LanguageCode;
  secondaryLanguage?: LanguageCode;
  presentation?: 'sideBySide' | 'alternating' | 'single';
  className?: string;
}

export function MultiLangText({
  text,
  primaryLanguage = 'la',
  secondaryLanguage,
  presentation = 'sideBySide',
  className = '',
}: MultiLangTextProps) {
  const [clickableLanguages, setClickableLanguages] = useState<LanguageCode[]>([]);

  useEffect(() => {
    // All available languages
    const allLanguages: LanguageCode[] = ['pt', 'es', 'la', 'en', 'de', 'it'];
    setClickableLanguages(allLanguages);
  }, []);

  const renderSingle = () => {
    return (
      <div className={`liturgical-text ${className}`}>
        <div
          className="cursor-pointer hover:bg-accent/10 rounded px-2 py-1 transition-colors"
          onClick={(e) => {
            const currentLang = e.currentTarget.getAttribute('data-lang') as LanguageCode;
            const currentIndex = clickableLanguages.indexOf(currentLang);
            const nextIndex = (currentIndex + 1) % clickableLanguages.length;
            e.currentTarget.setAttribute('data-lang', clickableLanguages[nextIndex]);
            e.currentTarget.textContent = text[clickableLanguages[nextIndex]];
          }}
          data-lang={primaryLanguage}
          dangerouslySetInnerHTML={{ __html: text[primaryLanguage] }}
        />
      </div>
    );
  };

  const renderSideBySide = () => {
    if (!secondaryLanguage) return renderSingle();

    return (
      <div className={`liturgical-text grid grid-cols-2 gap-4 ${className}`}>
        <div
          className="cursor-pointer hover:bg-accent/10 rounded px-2 py-1 transition-colors border-r border-border"
          dangerouslySetInnerHTML={{ __html: text[primaryLanguage] }}
        />
        <div
          className="cursor-pointer hover:bg-accent/10 rounded px-2 py-1 transition-colors"
          dangerouslySetInnerHTML={{ __html: text[secondaryLanguage] }}
        />
      </div>
    );
  };

  const renderAlternating = () => {
    if (!secondaryLanguage) return renderSingle();

    return (
      <div className={`liturgical-text space-y-3 ${className}`}>
        <div
          className="cursor-pointer hover:bg-accent/10 rounded px-2 py-1 transition-colors bg-primary/5"
          dangerouslySetInnerHTML={{ __html: text[primaryLanguage] }}
        />
        <div
          className="cursor-pointer hover:bg-accent/10 rounded px-2 py-1 transition-colors bg-secondary/5"
          dangerouslySetInnerHTML={{ __html: text[secondaryLanguage] }}
        />
      </div>
    );
  };

  switch (presentation) {
    case 'sideBySide':
      return renderSideBySide();
    case 'alternating':
      return renderAlternating();
    case 'single':
    default:
      return renderSingle();
  }
}
