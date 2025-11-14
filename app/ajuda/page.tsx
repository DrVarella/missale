import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Home, HelpCircle, BookOpen, Calendar, Settings, Cross } from 'lucide-react';

export default function AjudaPage() {
  const faqs = [
    {
      question: 'O que é o Missale Romanum?',
      answer: 'O Missale Romanum (Missal Romano) é o livro litúrgico oficial da Igreja Católica que contém as orações e instruções para a celebração da Santa Missa. Esta aplicação digital oferece acesso aos textos em 6 idiomas.'
    },
    {
      question: 'Quais idiomas estão disponíveis?',
      answer: 'A aplicação oferece textos litúrgicos em 6 idiomas: Latim (Latina), Português, Espanhol (Español), Inglês (English), Alemão (Deutsch) e Italiano (Italiano). Você pode escolher um idioma principal e um secundário para comparação lado a lado.'
    },
    {
      question: 'Como navegar pelo Missal?',
      answer: 'Use o menu principal para acessar: MISSALE (Ordinário da Missa), CALENDARIUM (Calendário Litúrgico com missas de cada dia), DILECTUS (Preferências) e AUXILIUM (esta página de ajuda).'
    },
    {
      question: 'O que são as cores litúrgicas?',
      answer: 'As cores litúrgicas indicam o tempo ou festa sendo celebrada:\n• Branco: Páscoa, Natal, festas do Senhor e Santos não-mártires\n• Vermelho: Paixão, Pentecostes, mártires\n• Verde: Tempo Comum\n• Roxo: Advento e Quaresma\n• Rosa: 3º Domingo do Advento e 4º da Quaresma\n• Preto: Missas de Defuntos (opcional)'
    },
    {
      question: 'O que são rubricas?',
      answer: 'Rubricas são as instruções litúrgicas que aparecem em vermelho (ou itálico), indicando como as orações devem ser realizadas, gestos, posturas e momentos específicos da celebração. Você pode ativar/desativar sua exibição nas Preferências.'
    },
    {
      question: 'Como personalizar a aparência?',
      answer: 'Acesse DILECTUS (Preferências) no menu principal. Lá você pode ajustar: idiomas, tamanho da fonte, tipo de fonte, modo escuro/claro, exibição de rubricas e outras opções de personalização.'
    },
    {
      question: 'Como funciona o Calendário Litúrgico?',
      answer: 'O Calendário calcula automaticamente os tempos litúrgicos (Advento, Natal, Quaresma, Páscoa, etc.) e festas móveis (como a Páscoa). Cada dia mostra a cor litúrgica correspondente e as missas disponíveis para aquela data.'
    },
    {
      question: 'O que é o Ordinário da Missa?',
      answer: 'O Ordinário contém as partes fixas da Missa que não mudam de dia para dia: Kyrie, Glória, Credo, Santo, Pai Nosso, Cordeiro de Deus, etc. Os textos próprios de cada dia (antífonas, leituras, orações) estão no Calendário.'
    },
    {
      question: 'Posso usar offline?',
      answer: 'Sim! Esta é uma Progressive Web App (PWA). Após carregar pela primeira vez, você pode instalá-la no seu dispositivo e usá-la mesmo sem conexão com a internet.'
    },
    {
      question: 'Como instalar no celular/tablet?',
      answer: 'No navegador do seu dispositivo móvel:\n• Chrome/Edge: Menu (⋮) > "Instalar app" ou "Adicionar à tela inicial"\n• Safari (iOS): Botão Compartilhar > "Adicionar à Tela de Início"\n• Firefox: Menu > "Instalar"\nApós instalado, funciona como um aplicativo nativo.'
    },
    {
      question: 'Meus dados são sincronizados?',
      answer: 'Atualmente, as preferências são salvas apenas localmente no seu navegador. A funcionalidade de contas de usuário e sincronização entre dispositivos será adicionada em futuras atualizações.'
    },
    {
      question: 'Como citar este Missal?',
      answer: 'Para citações acadêmicas ou referências, use: "Missale Romanum - Edição Digital Multilíngue, baseada no Missal Romano (3ª edição típica), disponível em [URL]".'
    }
  ];

  const sections = [
    {
      icon: Cross,
      title: 'MISSALE',
      description: 'Ordinário da Missa',
      details: 'Contém as partes fixas da celebração eucarística: Ritos Iniciais, Liturgia da Palavra, Liturgia Eucarística e Ritos Finais. Inclui textos como Kyrie, Glória, Credo, Santo, Pai Nosso e Cordeiro de Deus em todos os idiomas disponíveis.',
      link: '/ordinario'
    },
    {
      icon: Calendar,
      title: 'CALENDARIUM',
      description: 'Calendário Litúrgico',
      details: 'Visualize o ano litúrgico completo com cálculo automático dos tempos litúrgicos e festas móveis. Cada dia indica a cor litúrgica e as celebrações disponíveis. Acesse as missas próprias de cada dia, santos e festas.',
      link: '/calendario'
    },
    {
      icon: Settings,
      title: 'DILECTUS',
      description: 'Preferências',
      details: 'Personalize sua experiência: escolha idiomas primário e secundário, ajuste tamanho e tipo de fonte, ative modo escuro, controle exibição de rubricas e configure o modo de apresentação dos textos (lado a lado, alternado ou único).',
      link: '/preferencias'
    },
    {
      icon: HelpCircle,
      title: 'AUXILIUM',
      description: 'Ajuda',
      details: 'Esta página contém perguntas frequentes, guia de uso, explicações sobre liturgia e informações sobre o funcionamento da aplicação. Consulte sempre que tiver dúvidas.',
      link: '/ajuda'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Ajuda</h1>
                <p className="text-sm text-muted-foreground">Auxilium</p>
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Bem-vindo ao Missale Romanum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Esta aplicação oferece acesso completo ao Missal Romano em 6 idiomas, com interface moderna
                e funcionalidades para facilitar o acompanhamento da Santa Missa e o estudo dos textos litúrgicos.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>1.042+ Celebrações Litúrgicas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>6 Idiomas Completos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span>Calendário Litúrgico Automático</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  <span>Funciona Offline (PWA)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Guia de Navegação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.title} className="flex gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{section.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                      <p className="text-sm leading-relaxed">{section.details}</p>
                      <Link href={section.link}>
                        <Button variant="link" className="px-0 mt-2">
                          Acessar {section.title} →
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Liturgical Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Glossário Litúrgico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Antífona</h4>
                  <p className="text-xs text-muted-foreground">Breve texto que acompanha a Entrada ou Comunhão</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Coleta</h4>
                  <p className="text-xs text-muted-foreground">Oração que "coleta" as intenções da assembleia</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Prefácio</h4>
                  <p className="text-xs text-muted-foreground">Oração de ação de graças antes do Santo</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Oração Eucarística</h4>
                  <p className="text-xs text-muted-foreground">Centro da Missa, inclui a Consagração</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Lecionário</h4>
                  <p className="text-xs text-muted-foreground">Livro com as leituras bíblicas da Missa</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Próprio</h4>
                  <p className="text-xs text-muted-foreground">Textos específicos de cada dia/festa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Sobre o Projeto</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Este Missale Romanum digital foi desenvolvido para facilitar o acesso aos textos litúrgicos
                da Igreja Católica, preservando a fidelidade aos textos oficiais enquanto oferece uma
                experiência moderna e acessível.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-background rounded">Next.js 14</span>
                <span className="px-2 py-1 bg-background rounded">TypeScript</span>
                <span className="px-2 py-1 bg-background rounded">shadcn/ui</span>
                <span className="px-2 py-1 bg-background rounded">PWA</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Ad maiorem Dei gloriam ✝️
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
