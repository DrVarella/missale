'use client';

import { useMassView } from '@/lib/contexts/MassViewContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Columns2, Columns, BookOpen, Settings2, Languages, Type, Eye } from 'lucide-react';
import type { LanguageCode } from '@/lib/types';

const LANGUAGES = [
  { code: 'la' as LanguageCode, name: 'Latina' },
  { code: 'pt' as LanguageCode, name: 'Português' },
  { code: 'es' as LanguageCode, name: 'Español' },
  { code: 'en' as LanguageCode, name: 'English' },
  { code: 'de' as LanguageCode, name: 'Deutsch' },
  { code: 'it' as LanguageCode, name: 'Italiano' },
];

export function MassToolbar() {
  const {
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
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    showRubrics,
    setShowRubrics,
    darkMode,
    setDarkMode,
  } = useMassView();

  return (
    <div className="sticky top-0 z-40 bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Left section: Layout controls */}
          <div className="flex items-center gap-1">
            {/* Layout mode toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={layoutMode === 'single' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutMode('single')}
                className="rounded-r-none"
                title="1 Coluna"
              >
                <Columns className="h-4 w-4" />
              </Button>
              <Button
                variant={layoutMode === 'double' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutMode('double')}
                className="rounded-l-none"
                title="2 Colunas"
              >
                <Columns2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Display mode toggle (language selection) */}
            {layoutMode === 'double' && (
              <div className="flex border rounded-md ml-2">
                <Button
                  variant={displayMode === 'primary' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDisplayMode('primary')}
                  className="rounded-r-none px-2"
                  title="Apenas idioma primário"
                >
                  P
                </Button>
                <Button
                  variant={displayMode === 'secondary' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDisplayMode('secondary')}
                  className="rounded-none border-l border-r px-2"
                  title="Apenas idioma secundário"
                  disabled={!secondaryLang}
                >
                  S
                </Button>
                <Button
                  variant={displayMode === 'both' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDisplayMode('both')}
                  className="rounded-l-none px-2"
                  title="Ambos os idiomas"
                  disabled={!secondaryLang}
                >
                  P+S
                </Button>
              </div>
            )}
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center gap-2">
            {/* Reading mode */}
            <Button
              variant={readingMode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setReadingMode(!readingMode)}
              title="Modo Leitura"
            >
              <BookOpen className="h-4 w-4" />
            </Button>

            {/* Quick settings */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" title="Configurações Rápidas">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Configurações Rápidas</SheetTitle>
                </SheetHeader>

                <div className="space-y-6 py-6">
                  {/* Primary Language */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      <label className="text-sm font-medium">Idioma Primário</label>
                    </div>
                    <Select value={primaryLang} onValueChange={(val) => setPrimaryLang(val as LanguageCode)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Secondary Language */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      <label className="text-sm font-medium">Idioma Secundário</label>
                    </div>
                    <Select
                      value={secondaryLang || 'none'}
                      onValueChange={(val) => setSecondaryLang(val === 'none' ? null : (val as LanguageCode))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {LANGUAGES.filter(l => l.code !== primaryLang).map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        <label className="text-sm font-medium">Tamanho da Fonte</label>
                      </div>
                      <span className="text-sm text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(val) => setFontSize(val[0])}
                      min={12}
                      max={24}
                      step={1}
                    />
                  </div>

                  {/* Font Family */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Fonte</label>
                    <Select value={fontFamily} onValueChange={(val) => setFontFamily(val as 'serif' | 'sans-serif')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Serif (Crimson Text)</SelectItem>
                        <SelectItem value="sans-serif">Sans-serif (Inter)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Show Rubrics */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <label className="text-sm font-medium">Mostrar Rubricas</label>
                    </div>
                    <Switch checked={showRubrics} onCheckedChange={setShowRubrics} />
                  </div>

                  {/* Dark Mode */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Modo Escuro</label>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
