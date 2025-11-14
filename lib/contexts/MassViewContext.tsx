'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { LanguageCode } from '../types';

export type DisplayMode = 'primary' | 'secondary' | 'both';
export type LayoutMode = 'single' | 'double';

interface SectionOverride {
  [sectionId: string]: LanguageCode;
}

interface MassViewContextType {
  // Language settings
  primaryLang: LanguageCode;
  setPrimaryLang: (lang: LanguageCode) => void;
  secondaryLang: LanguageCode | null;
  setSecondaryLang: (lang: LanguageCode | null) => void;

  // Display mode
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;

  // Layout mode
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;

  // Reading mode (fullscreen)
  readingMode: boolean;
  setReadingMode: (enabled: boolean) => void;

  // Section overrides (language per section)
  sectionOverrides: SectionOverride;
  setSectionOverride: (sectionId: string, lang: LanguageCode) => void;
  clearSectionOverride: (sectionId: string) => void;
  clearAllOverrides: () => void;

  // Typography
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: 'serif' | 'sans-serif';
  setFontFamily: (family: 'serif' | 'sans-serif') => void;

  // Display preferences
  showRubrics: boolean;
  setShowRubrics: (show: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const MassViewContext = createContext<MassViewContextType | undefined>(undefined);

interface MassViewProviderProps {
  children: React.ReactNode;
}

export function MassViewProvider({ children }: MassViewProviderProps) {
  // Load preferences from localStorage
  const [primaryLang, setPrimaryLang] = useState<LanguageCode>('la');
  const [secondaryLang, setSecondaryLang] = useState<LanguageCode | null>('pt');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('both');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('double');
  const [readingMode, setReadingMode] = useState(false);
  const [sectionOverrides, setSectionOverrides] = useState<SectionOverride>({});
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans-serif'>('serif');
  const [showRubrics, setShowRubrics] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('missale-preferences');
      if (stored) {
        try {
          const prefs = JSON.parse(stored);
          if (prefs.primaryLanguage) setPrimaryLang(prefs.primaryLanguage);
          if (prefs.secondaryLanguage !== undefined) setSecondaryLang(prefs.secondaryLanguage);
          if (prefs.fontSize) setFontSize(prefs.fontSize);
          if (prefs.fontFamily) setFontFamily(prefs.fontFamily);
          if (prefs.showRubrics !== undefined) setShowRubrics(prefs.showRubrics);
          if (prefs.darkMode !== undefined) setDarkMode(prefs.darkMode);
          if (prefs.textPresentation) {
            // Map old textPresentation to new displayMode
            if (prefs.textPresentation === 'sideBySide') {
              setLayoutMode('double');
              setDisplayMode('both');
            } else if (prefs.textPresentation === 'single') {
              setLayoutMode('single');
              setDisplayMode('primary');
            }
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
        }
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefs = {
        primaryLanguage: primaryLang,
        secondaryLanguage: secondaryLang,
        fontSize,
        fontFamily,
        showRubrics,
        darkMode,
        textPresentation: layoutMode === 'double' ? 'sideBySide' : 'single',
      };
      localStorage.setItem('missale-preferences', JSON.stringify(prefs));
    }
  }, [primaryLang, secondaryLang, fontSize, fontFamily, showRubrics, darkMode, layoutMode]);

  // Apply dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  // Apply font family
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(
        '--font-family-text',
        fontFamily === 'serif' ? 'var(--font-crimson)' : 'var(--font-inter)'
      );
    }
  }, [fontFamily]);

  const setSectionOverride = (sectionId: string, lang: LanguageCode) => {
    setSectionOverrides(prev => ({ ...prev, [sectionId]: lang }));
  };

  const clearSectionOverride = (sectionId: string) => {
    setSectionOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[sectionId];
      return newOverrides;
    });
  };

  const clearAllOverrides = () => {
    setSectionOverrides({});
  };

  const value: MassViewContextType = {
    primaryLang,
    setPrimaryLang,
    secondaryLang,
    setSecondaryLang,
    displayMode,
    setDisplayMode,
    layoutMode,
    setLayoutMode,
    readingMode,
    setReadingMode,
    sectionOverrides,
    setSectionOverride,
    clearSectionOverride,
    clearAllOverrides,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    showRubrics,
    setShowRubrics,
    darkMode,
    setDarkMode,
  };

  return (
    <MassViewContext.Provider value={value}>
      {children}
    </MassViewContext.Provider>
  );
}

export function useMassView() {
  const context = useContext(MassViewContext);
  if (context === undefined) {
    throw new Error('useMassView must be used within a MassViewProvider');
  }
  return context;
}
