'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { LiturgicalColorBadge } from '@/components/liturgical';
import {
  getLiturgicalSeason,
  getSeasonColor,
  calculateEaster,
  getLiturgicalDates,
  formatLiturgicalDate,
} from '@/lib/liturgical-calendar';
import { LiturgicalSeason } from '@/lib/types';

export default function CalendarioPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const season = getLiturgicalSeason(selectedDate);
  const color = getSeasonColor(season);
  const year = currentMonth.getFullYear();
  const liturgicalDates = getLiturgicalDates(year);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Calendarium</h1>
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
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calendar Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
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

                  return (
                    <button
                      key={day}
                      onClick={() => selectDate(day)}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-sm
                        transition-all hover:scale-105 relative
                        ${isSelected(day) ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-accent'}
                        ${isToday(day) ? 'ring-2 ring-primary' : ''}
                      `}
                    >
                      <span>{day}</span>
                      {/* Small color indicator */}
                      <div
                        className="absolute bottom-1 w-1 h-1 rounded-full"
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
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecione uma celebração para ver os textos litúrgicos completos.
                  </p>
                  <Button className="w-full" disabled>
                    Ver Missa do Dia
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    (Funcionalidade em desenvolvimento)
                  </p>
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
