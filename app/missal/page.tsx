'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Search, Home, ArrowRight } from 'lucide-react';
import { LiturgicalColorBadge } from '@/components/liturgical';

interface Mass {
  code: string;
  title: string;
  color: string;
  rank: string;
  category: string;
  season?: string;
}

export default function MissalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allMasses, setAllMasses] = useState<Mass[]>([]);
  const [filteredMasses, setFilteredMasses] = useState<Mass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMasses = async () => {
      try {
        const response = await fetch('/api/masses/all');
        if (response.ok) {
          const data = await response.json();
          setAllMasses(data.masses || []);
          setFilteredMasses(data.masses || []);
        }
      } catch (error) {
        console.error('Error fetching masses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMasses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allMasses.filter((mass) =>
        mass.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMasses(filtered);
    } else {
      setFilteredMasses(allMasses);
    }
  }, [searchQuery, allMasses]);

  const getCategoryMasses = (category: string) => {
    return filteredMasses.filter((m) => m.category === category);
  };

  const saintsCount = getCategoryMasses('SAINTS').length;
  const seasonsCount = getCategoryMasses('SEASONS').length;
  const commonsCount = getCategoryMasses('COMMONS').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Missal Romano</h1>
                <p className="text-sm text-muted-foreground">Navegue por todas as missas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/calendario">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendário
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Missa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Digite o nome da missa, santo, festa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Categories Tabs */}
          <Tabs defaultValue="saints" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="saints">
                Santos ({saintsCount})
              </TabsTrigger>
              <TabsTrigger value="seasons">
                Tempos ({seasonsCount})
              </TabsTrigger>
              <TabsTrigger value="commons">
                Comuns ({commonsCount})
              </TabsTrigger>
            </TabsList>

            {/* Saints */}
            <TabsContent value="saints" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Próprio dos Santos</CardTitle>
                  <CardDescription>
                    Missas específicas para celebrações de santos e festas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center text-muted-foreground">Carregando...</p>
                  ) : getCategoryMasses('SAINTS').length > 0 ? (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {getCategoryMasses('SAINTS').map((mass) => (
                        <Button
                          key={mass.code}
                          variant="outline"
                          className="w-full justify-between h-auto py-3 text-left"
                          onClick={() => router.push(`/missa/${mass.code}`)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{mass.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              <span>{mass.rank}</span>
                              <LiturgicalColorBadge color={mass.color as any} size="sm" />
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Nenhuma missa encontrada
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Seasons */}
            <TabsContent value="seasons" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Próprio dos Tempos Litúrgicos</CardTitle>
                  <CardDescription>
                    Missas para Advento, Natal, Quaresma, Páscoa e Tempo Comum
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center text-muted-foreground">Carregando...</p>
                  ) : getCategoryMasses('SEASONS').length > 0 ? (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {getCategoryMasses('SEASONS').map((mass) => (
                        <Button
                          key={mass.code}
                          variant="outline"
                          className="w-full justify-between h-auto py-3 text-left"
                          onClick={() => router.push(`/missa/${mass.code}`)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{mass.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              {mass.season && <Badge variant="secondary">{mass.season}</Badge>}
                              <span>{mass.rank}</span>
                              <LiturgicalColorBadge color={mass.color as any} size="sm" />
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Nenhuma missa encontrada
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commons */}
            <TabsContent value="commons" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comum</CardTitle>
                  <CardDescription>
                    Missas comuns para diferentes tipos de celebrações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center text-muted-foreground">Carregando...</p>
                  ) : getCategoryMasses('COMMONS').length > 0 ? (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {getCategoryMasses('COMMONS').map((mass) => (
                        <Button
                          key={mass.code}
                          variant="outline"
                          className="w-full justify-between h-auto py-3 text-left"
                          onClick={() => router.push(`/missa/${mass.code}`)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{mass.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              <span>{mass.rank}</span>
                              <LiturgicalColorBadge color={mass.color as any} size="sm" />
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Nenhuma missa encontrada
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
