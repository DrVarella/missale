import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  HelpCircle,
  Settings,
  Cross
} from "lucide-react";

export default function Home() {
  const menuItems = [
    {
      title: "Missale",
      titleLatin: "MISSALE",
      description: "Ordinário da Missa",
      href: "/ordinario",
      icon: Cross,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Missale II",
      titleLatin: "MISSALE II",
      description: "Ordinário da Missa (2º idioma)",
      href: "/ordinario?lang=secondary",
      icon: Cross,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Calendarium",
      titleLatin: "CALENDARIUM",
      description: "Calendário Litúrgico",
      href: "/calendario",
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Auxilium",
      titleLatin: "AUXILIUM",
      description: "Ajuda e Documentação",
      href: "/ajuda",
      icon: HelpCircle,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Dilectus",
      titleLatin: "DILECTUS",
      description: "Preferências",
      href: "/preferencias",
      icon: Settings,
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Missale Romanum</h1>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Missal Romano em 6 idiomas
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} href={item.href}>
                <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`${item.color} p-3 bg-background rounded-lg`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-1">
                          {item.titleLatin}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-muted-foreground">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Idiomas disponíveis:</strong>
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Português', 'Español', 'Latina', 'English', 'Deutsch', 'Italiano'].map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-background rounded-full text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
