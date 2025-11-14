'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarIcon, Home, ChevronLeft, ChevronRight, ArrowRight, Settings2, BookOpen, Languages, Type, Eye } from 'lucide-react';
import { LiturgicalColorBadge } from '@/components/liturgical';
import { useMassView } from '@/lib/contexts/MassViewContext';
import type { LanguageCode } from '@/lib/types';
import {
  getLiturgicalSeason,
  getSeasonColor,
  getLiturgicalDates,
  formatLiturgicalDate,
} from '@/lib/liturgical-calendar';
import { LiturgicalSeason } from '@/lib/types';

interface MassPreview {
  code: string;
  title: string;
  color: string;
  rank: string;
}

const LANGUAGES = [
  { code: 'la' as LanguageCode, name: 'Latina' },
  { code: 'pt' as LanguageCode, name: 'Português' },
  { code: 'es' as LanguageCode, name: 'Español' },
  { code: 'en' as LanguageCode, name: 'English' },
  { code: 'de' as LanguageCode, name: 'Deutsch' },
  { code: 'it' as LanguageCode, name: 'Italiano' },
];

export default function CalendarioPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [massesForDay, setMassesForDay] = useState<MassPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayMass, setTodayMass] = useState<MassPreview | null>(null);

  const {
    primaryLang,
    setPrimaryLang,
    secondaryLang,
    setSecondaryLang,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    showRubrics,
    setShowRubrics,
    darkMode,
    setDarkMode,
  } = useMassView();

  const season = getLiturgicalSeason(selectedDate);
  const color = getSeasonColor(season);
  const year = currentMonth.getFullYear();
  const liturgicalDates = getLiturgicalDates(year);

  // Fetch today's mass on mount
  useEffect(() => {
    const fetchTodayMass = async () => {
      try {
        const response = await fetch('/api/masses/today');
        if (response.ok) {
          const data = await response.json();
          if (data.masses && data.masses.length > 0) {
            setTodayMass(data.masses[0]); // Get the first (highest precedence) mass
          }
        }
      } catch (error) {
        console.error('Error fetching today\'s mass:', error);
      }
    };
    fetchTodayMass();
  }, []);

  // Fetch masses for selected day
  useEffect(() => {
    const fetchMassesForDay = async () => {
      setLoading(true);
      try {
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateCode = `${month}${day}`;

        const response = await fetch(`/api/masses/by-date?date=${dateCode}`);
        if (response.ok) {
          const data = await response.json();
          setMassesForDay(data.masses || []);
        } else {
          setMassesForDay([]);
        }
      } catch (error) {
        console.error('Error fetching masses:', error);
        setMassesForDay([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMassesForDay();
  }, [selectedDate]);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const selectDate = (day: number) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const seasonNames: Record<LiturgicalSeason, string> = {
    ADVENT: 'Advento',
    CHRISTMAS: 'Natal',
    ORDINARY_TIME: 'Tempo Comum',
    LENT: 'Quaresma',
    HOLY_WEEK: 'Semana Santa',
    EASTER: 'Páscoa',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Top row: Title and Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Missale Romanum</h1>
                  <p className="text-sm text-muted-foreground">Calendário Litúrgico</p>
                </div>
              </div>

              {/* Settings Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Configurações</SheetTitle>
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

            {/* Action buttons row */}
            <div className="flex gap-2">
              {todayMass && (
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={() => router.push(`/missa/${todayMass.code}`)}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Missa de Hoje
                </Button>
              )}
              <Link href="/missal" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Missal Romano
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calendar Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <CardTitle>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Hoje
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Actual days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const daySeason = getLiturgicalSeason(date);
                  const dayColor = getSeasonColor(daySeason);
                  const today = isToday(day);
                  const selected = isSelected(day);

                  return (
                    <button
                      key={day}
                      onClick={() => selectDate(day)}
                      className={`
                        aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                        transition-all hover:scale-105 relative group
                        ${selected ? 'bg-primary text-primary-foreground font-bold shadow-lg' : 'hover:bg-accent'}
                        ${today ? 'ring-2 ring-primary ring-offset-2' : ''}
                      `}
                    >
                      {today && (
                        <Badge variant="secondary" className="absolute -top-1 -right-1 text-[10px] px-1 py-0">
                          HOJE
                        </Badge>
                      )}
                      <span className={today ? 'font-bold text-lg' : ''}>{day}</span>
                      {/* Color indicator */}
                      <div
                        className="mt-1 w-2 h-2 rounded-full"
                        style={{ backgroundColor: `var(--liturgical-${dayColor.toLowerCase()})` }}
                      />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{formatLiturgicalDate(selectedDate)}</span>
                  <LiturgicalColorBadge color={color} size="lg" showLabel />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Tempo Litúrgico</h3>
                  <p className="text-muted-foreground">{seasonNames[season]}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Missa do Dia</h3>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  ) : massesForDay.length > 0 ? (
                    <div className="space-y-2">
                      {massesForDay.map((mass) => (
                        <Button
                          key={mass.code}
                          variant="outline"
                          className="w-full justify-between h-auto py-3"
                          onClick={() => router.push(`/missa/${mass.code}`)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{mass.title}</div>
                            <div className="text-xs text-muted-foreground">{mass.rank}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma celebração específica encontrada para este dia.
                      Consulte o Ordinário da Missa para o Tempo {seasonNames[season]}.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Important Liturgical Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Datas Litúrgicas Importantes de {year}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent">
                    <span>Início do Advento</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.adventStart.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent">
                    <span>Natal</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.christmas.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent">
                    <span>Epifania</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.epiphany.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent">
                    <span>Quarta-feira de Cinzas</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.ashWednesday.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent">
                    <span>Domingo de Ramos</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.palmSunday.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent font-semibold">
                    <span>Páscoa</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.easter.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent">
                    <span>Ascensão</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.ascension.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-accent">
                    <span>Pentecostes</span>
                    <span className="text-muted-foreground">
                      {liturgicalDates.pentecost.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
