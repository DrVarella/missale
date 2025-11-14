import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MassViewProvider } from '@/lib/contexts/MassViewContext';
import { MassToolbar } from '@/components/liturgical/MassToolbar';
import { MultiLangText } from '@/components/liturgical/MultiLangText';
import { LiturgicalColorBadge } from '@/components/liturgical/LiturgicalColorBadge';
import { ReadingModeWrapper } from '@/components/liturgical/ReadingModeWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Home } from 'lucide-react';
import Link from 'next/link';

interface MassPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getMass(id: string) {
  const mass = await prisma.mass.findUnique({
    where: { code: id },
    include: {
      title: true,
      entranceAntiphon: true,
      collect: true,
      prayerOverOfferings: true,
      communionAntiphon: true,
      postCommunion: true,
    },
  });

  return mass;
}

export default async function MassPage({ params }: MassPageProps) {
  const { id } = await params;
  const mass = await getMass(id);

  if (!mass) {
    notFound();
  }

  return (
    <MassViewProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Toolbar */}
        <MassToolbar />

        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/calendario">
                  <Button variant="ghost" size="icon">
                    <Home className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {mass.title.pt || mass.title.la}
                    </h1>
                    <LiturgicalColorBadge color={mass.color} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mass.rank.replace('_', ' ').toLowerCase()}
                    {mass.season && ` • ${mass.season}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" title="Dia anterior">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Link href="/calendario">
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendário
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" title="Próximo dia">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Mass Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Próprio da Missa</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {/* Entrance Antiphon */}
                  {mass.entranceAntiphon && (
                    <AccordionItem value="entrance">
                      <AccordionTrigger className="text-lg">
                        Antífona de Entrada
                      </AccordionTrigger>
                      <AccordionContent>
                        <MultiLangText
                          text={mass.entranceAntiphon}
                          sectionId="entrance"
                          className="mt-4"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Collect */}
                  {mass.collect && (
                    <AccordionItem value="collect">
                      <AccordionTrigger className="text-lg">
                        Oração Coleta
                      </AccordionTrigger>
                      <AccordionContent>
                        <MultiLangText
                          text={mass.collect}
                          sectionId="collect"
                          className="mt-4"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Readings Placeholder */}
                  <AccordionItem value="readings">
                    <AccordionTrigger className="text-lg">
                      Liturgia da Palavra
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="mt-4 p-6 bg-muted/30 rounded-lg text-center">
                        <p className="text-muted-foreground">
                          Lecionário em desenvolvimento
                        </p>
                        {mass.readingsRef && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Ref: {mass.readingsRef}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Prayer over Offerings */}
                  {mass.prayerOverOfferings && (
                    <AccordionItem value="offerings">
                      <AccordionTrigger className="text-lg">
                        Oração sobre as Oferendas
                      </AccordionTrigger>
                      <AccordionContent>
                        <MultiLangText
                          text={mass.prayerOverOfferings}
                          sectionId="offerings"
                          className="mt-4"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Preface */}
                  {mass.prefaceRef && (
                    <AccordionItem value="preface">
                      <AccordionTrigger className="text-lg">
                        Prefácio
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mt-4 p-6 bg-muted/30 rounded-lg text-center">
                          <p className="text-muted-foreground">
                            Prefácio: {mass.prefaceRef}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Consulte a seção de prefácios
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Communion Antiphon */}
                  {mass.communionAntiphon && (
                    <AccordionItem value="communion">
                      <AccordionTrigger className="text-lg">
                        Antífona de Comunhão
                      </AccordionTrigger>
                      <AccordionContent>
                        <MultiLangText
                          text={mass.communionAntiphon}
                          sectionId="communion"
                          className="mt-4"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Post Communion */}
                  {mass.postCommunion && (
                    <AccordionItem value="postcommunion">
                      <AccordionTrigger className="text-lg">
                        Oração depois da Comunhão
                      </AccordionTrigger>
                      <AccordionContent>
                        <MultiLangText
                          text={mass.postCommunion}
                          sectionId="postcommunion"
                          className="mt-4"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Informações Litúrgicas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <span className="font-medium">Código:</span> {mass.code}
                </div>
                <div>
                  <span className="font-medium">Categoria:</span> {mass.category}
                </div>
                <div>
                  <span className="font-medium">Rank:</span> {mass.rank}
                </div>
                <div>
                  <span className="font-medium">Precedência:</span> {mass.precedence}
                </div>
                {mass.season && (
                  <div>
                    <span className="font-medium">Tempo:</span> {mass.season}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </MassViewProvider>
  );
}
