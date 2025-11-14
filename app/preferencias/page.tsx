'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Home, Settings, Save, RotateCcw } from 'lucide-react';
import { LanguageCode, LANGUAGE_NAMES } from '@/lib/types';

interface Preferences {
  primaryLanguage: LanguageCode;
  secondaryLanguage: LanguageCode | null;
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif';
  showRubrics: boolean;
  showBackground: boolean;
  darkMode: boolean;
  textPresentation: 'sideBySide' | 'alternating' | 'single';
}

const DEFAULT_PREFERENCES: Preferences = {
  primaryLanguage: 'la',
  secondaryLanguage: 'pt',
  fontSize: 16,
  fontFamily: 'serif',
  showRubrics: true,
  showBackground: false,
  darkMode: false,
  textPresentation: 'sideBySide',
};

export default function PreferenciasPage() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('missale-preferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('missale-preferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Apply dark mode immediately
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply font family
    document.body.style.fontFamily = preferences.fontFamily === 'serif'
      ? 'var(--font-crimson), serif'
      : 'var(--font-inter), sans-serif';
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem('missale-preferences');
    document.documentElement.classList.remove('dark');
    document.body.style.fontFamily = 'var(--font-crimson), serif';
  };

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Preferências</h1>
                <p className="text-sm text-muted-foreground">Dilectus</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Language Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Idiomas</CardTitle>
              <CardDescription>
                Escolha os idiomas para exibição dos textos litúrgicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Idioma Principal</label>
                <Select
                  value={preferences.primaryLanguage}
                  onValueChange={(value) => updatePreference('primaryLanguage', value as LanguageCode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Idioma Secundário (opcional)</label>
                <Select
                  value={preferences.secondaryLanguage || 'none'}
                  onValueChange={(value) =>
                    updatePreference('secondaryLanguage', value === 'none' ? null : value as LanguageCode)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Modo de Apresentação</label>
                <Select
                  value={preferences.textPresentation}
                  onValueChange={(value) => updatePreference('textPresentation', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sideBySide">Lado a Lado</SelectItem>
                    <SelectItem value="alternating">Alternado</SelectItem>
                    <SelectItem value="single">Apenas um idioma</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {preferences.textPresentation === 'sideBySide' && 'Os textos aparecem lado a lado (requer idioma secundário)'}
                  {preferences.textPresentation === 'alternating' && 'Os textos aparecem alternados (requer idioma secundário)'}
                  {preferences.textPresentation === 'single' && 'Apenas o idioma principal é exibido'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Typography Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
              <CardDescription>
                Ajuste o tamanho e a fonte dos textos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Tamanho da Fonte</label>
                  <span className="text-sm text-muted-foreground">{preferences.fontSize}px</span>
                </div>
                <Slider
                  value={[preferences.fontSize]}
                  onValueChange={([value]) => updatePreference('fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Pequeno</span>
                  <span>Médio</span>
                  <span>Grande</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Família da Fonte</label>
                <Select
                  value={preferences.fontFamily}
                  onValueChange={(value) => updatePreference('fontFamily', value as 'serif' | 'sans-serif')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serif">
                      <span style={{ fontFamily: 'var(--font-crimson)' }}>Serif (Crimson Text)</span>
                    </SelectItem>
                    <SelectItem value="sans-serif">
                      <span style={{ fontFamily: 'var(--font-inter)' }}>Sans-serif (Inter)</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {preferences.fontFamily === 'serif' && 'Fonte serifada, tradicional para textos litúrgicos'}
                  {preferences.fontFamily === 'sans-serif' && 'Fonte moderna, melhor legibilidade em telas'}
                </p>
              </div>

              {/* Preview */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-xs font-medium mb-2">Prévia:</p>
                <p
                  style={{
                    fontSize: `${preferences.fontSize}px`,
                    fontFamily: preferences.fontFamily === 'serif'
                      ? 'var(--font-crimson), serif'
                      : 'var(--font-inter), sans-serif'
                  }}
                >
                  Glória a Deus nas alturas, e paz na terra aos homens por Ele amados.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Exibição</CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Modo Escuro</label>
                  <p className="text-xs text-muted-foreground">
                    Tema escuro para melhor leitura noturna
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => updatePreference('darkMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Exibir Rubricas</label>
                  <p className="text-xs text-muted-foreground">
                    Mostrar instruções litúrgicas em vermelho
                  </p>
                </div>
                <Switch
                  checked={preferences.showRubrics}
                  onCheckedChange={(checked) => updatePreference('showRubrics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Imagem de Fundo</label>
                  <p className="text-xs text-muted-foreground">
                    Fundo decorativo (pode afetar legibilidade)
                  </p>
                </div>
                <Switch
                  checked={preferences.showBackground}
                  onCheckedChange={(checked) => updatePreference('showBackground', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={savePreferences}
              className="flex-1"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {saved ? 'Salvo!' : 'Salvar Preferências'}
            </Button>
            <Button
              onClick={resetPreferences}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>

          {/* Info Card */}
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> As preferências são salvas localmente no seu navegador.
                Para sincronizar entre dispositivos, será necessário criar uma conta (funcionalidade futura).
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
