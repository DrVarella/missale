'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Home, BookOpen, Settings } from 'lucide-react';
import { LanguageCode } from '@/lib/types';

export default function OrdinarioPage() {
  const [primaryLang, setPrimaryLang] = useState<LanguageCode>('la');
  const [secondaryLang, setSecondaryLang] = useState<LanguageCode>('pt');

  // Estrutura do Ordinário da Missa
  const ordinaryParts = [
    {
      id: 'ritos-iniciais',
      title: 'Ritos Iniciais',
      sections: [
        { id: 'entrada', title: 'Canto de Entrada', content: 'O sacerdote e os ministros dirigem-se ao altar...' },
        { id: 'saudacao', title: 'Saudação ao Altar e ao Povo', content: 'Em nome do Pai, e do Filho, e do Espírito Santo...' },
        { id: 'ato-penitencial', title: 'Ato Penitencial', content: 'Irmãos e irmãs, reconheçamos as nossas culpas...' },
        { id: 'kyrie', title: 'Senhor, tende piedade (Kyrie)', content: 'Senhor, tende piedade de nós...' },
        { id: 'gloria', title: 'Glória', content: 'Glória a Deus nas alturas...' },
        { id: 'oracao-coleta', title: 'Oração Coleta', content: 'Oremos... (do dia)' },
      ],
    },
    {
      id: 'liturgia-palavra',
      title: 'Liturgia da Palavra',
      sections: [
        { id: 'primeira-leitura', title: 'Primeira Leitura', content: 'Leitura do livro...' },
        { id: 'salmo', title: 'Salmo Responsorial', content: 'Sl...' },
        { id: 'segunda-leitura', title: 'Segunda Leitura', content: 'Leitura da carta...' },
        { id: 'aclamacao', title: 'Aclamação ao Evangelho', content: 'Aleluia, aleluia...' },
        { id: 'evangelho', title: 'Evangelho', content: 'O Senhor esteja convosco...' },
        { id: 'homilia', title: 'Homilia', content: 'O sacerdote faz a homilia...' },
        { id: 'credo', title: 'Profissão de Fé (Credo)', content: 'Creio em um só Deus...' },
        { id: 'oracao-fieis', title: 'Oração dos Fiéis', content: 'Oremos, irmãos e irmãs...' },
      ],
    },
    {
      id: 'liturgia-eucaristica',
      title: 'Liturgia Eucarística',
      sections: [
        { id: 'preparacao-dons', title: 'Preparação dos Dons', content: 'Bendito sejais, Senhor...' },
        { id: 'oracao-oferendas', title: 'Oração sobre as Oferendas', content: 'Orai, irmãos e irmãs...' },
        { id: 'prefacio', title: 'Prefácio', content: 'O Senhor esteja convosco...' },
        { id: 'santo', title: 'Santo', content: 'Santo, Santo, Santo...' },
        { id: 'oracao-eucaristica', title: 'Oração Eucarística', content: 'Escolher entre PE I-IV...' },
        { id: 'pai-nosso', title: 'Pai Nosso', content: 'Pai Nosso que estais nos céus...' },
        { id: 'abraco-paz', title: 'Abraço da Paz', content: 'Senhor Jesus Cristo...' },
        { id: 'cordeiro', title: 'Cordeiro de Deus', content: 'Cordeiro de Deus...' },
        { id: 'comunhao', title: 'Comunhão', content: 'Eis o Cordeiro de Deus...' },
        { id: 'oracao-comunhao', title: 'Oração depois da Comunhão', content: 'Oremos... (do dia)' },
      ],
    },
    {
      id: 'ritos-finais',
      title: 'Ritos Finais',
      sections: [
        { id: 'avisos', title: 'Avisos (se houver)', content: 'Breves avisos pastorais...' },
        { id: 'bencao', title: 'Bênção', content: 'O Senhor esteja convosco...' },
        { id: 'despedida', title: 'Despedida', content: 'Ide em paz, e o Senhor vos acompanhe...' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Ordinário da Missa</h1>
                <p className="text-sm text-muted-foreground">Ordo Missae</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/preferencias">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Language Selection Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Idiomas:</span>
                <div className="flex gap-2">
                  <select
                    value={primaryLang}
                    onChange={(e) => setPrimaryLang(e.target.value as LanguageCode)}
                    className="text-sm border rounded px-3 py-1 bg-background"
                  >
                    <option value="la">Latina</option>
                    <option value="pt">Português</option>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                  <span className="text-muted-foreground">+</span>
                  <select
                    value={secondaryLang}
                    onChange={(e) => setSecondaryLang(e.target.value as LanguageCode)}
                    className="text-sm border rounded px-3 py-1 bg-background"
                  >
                    <option value="pt">Português</option>
                    <option value="es">Español</option>
                    <option value="la">Latina</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different views */}
          <Tabs defaultValue="estrutura" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="estrutura">Estrutura</TabsTrigger>
              <TabsTrigger value="textos">Textos Fixos</TabsTrigger>
              <TabsTrigger value="rubricas">Rubricas</TabsTrigger>
            </TabsList>

            <TabsContent value="estrutura" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Estrutura da Santa Missa</h2>

                  <Accordion type="single" collapsible className="space-y-2">
                    {ordinaryParts.map((part) => (
                      <AccordionItem key={part.id} value={part.id}>
                        <AccordionTrigger className="text-lg font-semibold text-primary">
                          {part.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4">
                            {part.sections.map((section) => (
                              <div
                                key={section.id}
                                className="p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                              >
                                <h4 className="font-medium mb-1">{section.title}</h4>
                                <p className="text-sm text-muted-foreground italic">
                                  {section.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="textos" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Textos Fixos do Ordinário</h2>

                  <div className="space-y-6">
                    {/* Kyrie */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">Kyrie Eleison</h3>
                      <div className="space-y-2 text-sm">
                        <p className="response font-medium">Senhor, tende piedade de nós.</p>
                        <p className="text-muted-foreground">Senhor, tende piedade de nós.</p>
                        <p className="response font-medium">Cristo, tende piedade de nós.</p>
                        <p className="text-muted-foreground">Cristo, tende piedade de nós.</p>
                        <p className="response font-medium">Senhor, tende piedade de nós.</p>
                        <p className="text-muted-foreground">Senhor, tende piedade de nós.</p>
                      </div>
                    </div>

                    {/* Gloria */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">Glória</h3>
                      <div className="liturgical-text text-sm leading-relaxed">
                        <p>Glória a Deus nas alturas, e paz na terra aos homens por Ele amados.</p>
                        <p>Senhor Deus, Rei dos céus, Deus Pai todo-poderoso:</p>
                        <p>Nós Vos louvamos, nós Vos bendizemos, nós Vos adoramos, nós Vos glorificamos,</p>
                        <p>nós Vos damos graças por vossa imensa glória.</p>
                        <p className="mt-2">Senhor Jesus Cristo, Filho Unigênito,</p>
                        <p>Senhor Deus, Cordeiro de Deus, Filho de Deus Pai.</p>
                        <p>Vós que tirais o pecado do mundo, tende piedade de nós.</p>
                        <p>Vós que tirais o pecado do mundo, acolhei a nossa súplica.</p>
                        <p>Vós que estais à direita do Pai, tende piedade de nós.</p>
                        <p className="mt-2">Só Vós sois o Santo, só Vós, o Senhor, só Vós, o Altíssimo,</p>
                        <p>Jesus Cristo, com o Espírito Santo, na glória de Deus Pai. Amém.</p>
                      </div>
                    </div>

                    {/* Credo */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">Credo Niceno-Constantinopolitano</h3>
                      <div className="liturgical-text text-sm leading-relaxed">
                        <p>Creio em um só Deus, Pai todo-poderoso,</p>
                        <p>Criador do céu e da terra, de todas as coisas visíveis e invisíveis.</p>
                        <p className="mt-2">Creio em um só Senhor, Jesus Cristo, Filho Unigênito de Deus,</p>
                        <p>nascido do Pai antes de todos os séculos:</p>
                        <p>Deus de Deus, Luz da Luz, Deus verdadeiro de Deus verdadeiro;</p>
                        <p>gerado, não criado, consubstancial ao Pai.</p>
                        <p>Por Ele todas as coisas foram feitas.</p>
                        <p className="mt-2 italic">E por nós, homens, e para nossa salvação, desceu dos céus:</p>
                        <p className="italic">e encarnou pelo Espírito Santo, no seio da Virgem Maria,</p>
                        <p className="italic">e se fez homem.</p>
                        <p className="mt-2">Também por nós foi crucificado sob Pôncio Pilatos;</p>
                        <p>padeceu e foi sepultado.</p>
                        <p>Ressuscitou ao terceiro dia, conforme as Escrituras,</p>
                        <p>e subiu aos céus, onde está sentado à direita do Pai.</p>
                        <p>E de novo há de vir, em sua glória, para julgar os vivos e os mortos;</p>
                        <p>e o seu reino não terá fim.</p>
                        <p className="mt-2">Creio no Espírito Santo, Senhor que dá a vida,</p>
                        <p>e procede do Pai e do Filho;</p>
                        <p>e com o Pai e o Filho é adorado e glorificado:</p>
                        <p>Ele que falou pelos profetas.</p>
                        <p className="mt-2">Creio na Igreja, una, santa, católica e apostólica.</p>
                        <p>Professo um só batismo para remissão dos pecados.</p>
                        <p>E espero a ressurreição dos mortos</p>
                        <p>e a vida do mundo que há de vir. Amém.</p>
                      </div>
                    </div>

                    {/* Santo */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">Santo (Sanctus)</h3>
                      <div className="liturgical-text text-sm leading-relaxed">
                        <p className="response font-medium">Santo, Santo, Santo, Senhor Deus do universo!</p>
                        <p className="response font-medium">O céu e a terra proclamam a vossa glória.</p>
                        <p className="response font-medium">Hosana nas alturas!</p>
                        <p className="response font-medium mt-2">Bendito o que vem em nome do Senhor!</p>
                        <p className="response font-medium">Hosana nas alturas!</p>
                      </div>
                    </div>

                    {/* Pai Nosso */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">Pai Nosso (Pater Noster)</h3>
                      <div className="liturgical-text text-sm leading-relaxed">
                        <p>Pai Nosso que estais nos céus,</p>
                        <p>santificado seja o vosso nome,</p>
                        <p>venha a nós o vosso reino,</p>
                        <p>seja feita a vossa vontade assim na terra como no céu.</p>
                        <p className="mt-2">O pão nosso de cada dia nos dai hoje,</p>
                        <p>perdoai-nos as nossas ofensas</p>
                        <p>assim como nós perdoamos a quem nos tem ofendido,</p>
                        <p>e não nos deixeis cair em tentação,</p>
                        <p>mas livrai-nos do mal.</p>
                      </div>
                    </div>

                    {/* Cordeiro de Deus */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">Cordeiro de Deus (Agnus Dei)</h3>
                      <div className="liturgical-text text-sm leading-relaxed">
                        <p className="response font-medium">Cordeiro de Deus, que tirais o pecado do mundo,</p>
                        <p className="response font-medium">tende piedade de nós.</p>
                        <p className="response font-medium mt-2">Cordeiro de Deus, que tirais o pecado do mundo,</p>
                        <p className="response font-medium">tende piedade de nós.</p>
                        <p className="response font-medium mt-2">Cordeiro de Deus, que tirais o pecado do mundo,</p>
                        <p className="response font-medium">dai-nos a paz.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rubricas" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Rubricas e Instruções</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-semibold mb-2 text-primary">Cores Litúrgicas</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Branco:</span> Páscoa, Natal, festas do Senhor, da Virgem Maria, dos Santos não mártires</p>
                        <p><span className="font-medium">Vermelho:</span> Domingo de Ramos, Sexta-feira Santa, Pentecostes, festas dos mártires</p>
                        <p><span className="font-medium">Verde:</span> Tempo Comum</p>
                        <p><span className="font-medium">Roxo:</span> Advento e Quaresma</p>
                        <p><span className="font-medium">Rosa:</span> 3º Domingo do Advento (Gaudete) e 4º da Quaresma (Laetare)</p>
                        <p><span className="font-medium">Preto:</span> Missas de Defuntos (opcional)</p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-semibold mb-2 text-primary">Posturas Litúrgicas</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">De pé:</span> Procissão de entrada, Evangelho, Credo, Oração dos Fiéis, Prefácio, Pai Nosso</p>
                        <p><span className="font-medium">Sentados:</span> Leituras antes do Evangelho, Homilia, Preparação das Oferendas</p>
                        <p><span className="font-medium">De joelhos:</span> Consagração (Epiclese até a elevação)</p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-semibold mb-2 text-primary">Observações Importantes</h3>
                      <div className="space-y-1 text-sm">
                        <p>• O Glória não se diz no Advento e na Quaresma</p>
                        <p>• O Aleluia não se canta na Quaresma (substitui-se por aclamação apropriada)</p>
                        <p>• Em Missas de Defuntos omite-se o Glória e o Aleluia</p>
                        <p>• O Credo é obrigatório aos domingos e solenidades</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Card */}
          <Card className="mt-6 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Este é o Ordinário da Missa, contendo as partes fixas da celebração eucarística.
                Para os textos próprios de cada dia (antífonas, orações, leituras), consulte o Calendário Litúrgico.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
