'use client';

import { Mass, UserPreferences, LanguageCode } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiLangText } from './MultiLangText';
import { LiturgicalColorBadge } from './LiturgicalColorBadge';
import { Separator } from '@/components/ui/separator';

interface MassViewerProps {
  mass: Mass;
  preferences: UserPreferences;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export function MassViewer({ mass, preferences }: MassViewerProps) {
  const {
    primaryLanguage,
    secondaryLanguage,
    textPresentation,
    showRubrics,
  } = preferences;

  const renderSection = (
    title: string,
    content?: Mass['entranceAntiphon'],
    rubric?: string
  ) => {
    if (!content) return null;

    return (
      <div className="space-y-2">
        <h3 className="prayer-title flex items-center justify-between">
          <span>{title}</span>
          <LiturgicalColorBadge color={mass.color} size="sm" />
        </h3>
        {showRubrics && rubric && (
          <p className="rubric">{rubric}</p>
        )}
        <MultiLangText
          text={content}
          primaryLanguage={primaryLanguage}
          secondaryLanguage={secondaryLanguage}
          presentation={textPresentation}
        />
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl">
            <MultiLangText
              text={mass.title}
              primaryLanguage={primaryLanguage}
              secondaryLanguage={secondaryLanguage}
              presentation={textPresentation}
            />
          </CardTitle>
          <LiturgicalColorBadge color={mass.color} size="lg" showLabel />
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground mt-2">
          <span className="capitalize">{mass.rank.toLowerCase().replace('_', ' ')}</span>
          {mass.season && (
            <>
              <span>•</span>
              <span className="capitalize">{mass.season.toLowerCase().replace('_', ' ')}</span>
            </>
          )}
          {mass.date && (
            <>
              <span>•</span>
              <span>{new Date(mass.date).toLocaleDateString('pt-BR')}</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {mass.entranceAntiphon && (
          <>
            {renderSection(
              'Antífona de Entrada',
              mass.entranceAntiphon,
              'Canta-se ou recita-se enquanto o sacerdote se dirige ao altar.'
            )}
            <Separator />
          </>
        )}

        {mass.collect && (
          <>
            {renderSection(
              'Oração Coleta',
              mass.collect,
              'O sacerdote, de braços estendidos, diz:'
            )}
            <Separator />
          </>
        )}

        {mass.readingsRef && (
          <>
            <div className="space-y-2">
              <h3 className="prayer-title">Liturgia da Palavra</h3>
              <p className="text-sm text-muted-foreground">
                Ver leituras: <span className="font-mono">{mass.readingsRef}</span>
              </p>
            </div>
            <Separator />
          </>
        )}

        {mass.prayerOverOfferings && (
          <>
            {renderSection(
              'Oração sobre as Oferendas',
              mass.prayerOverOfferings,
              'Depois de colocar o pão e o vinho sobre o altar:'
            )}
            <Separator />
          </>
        )}

        {mass.prefaceRef && (
          <>
            <div className="space-y-2">
              <h3 className="prayer-title">Prefácio</h3>
              {showRubrics && (
                <p className="rubric">
                  Na Oração Eucarística, usa-se o seguinte prefácio:
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Ver prefácio: <span className="font-mono">{mass.prefaceRef}</span>
              </p>
            </div>
            <Separator />
          </>
        )}

        {mass.communionAntiphon && (
          <>
            {renderSection(
              'Antífona da Comunhão',
              mass.communionAntiphon,
              'Enquanto o sacerdote e os fiéis recebem o Corpo de Cristo:'
            )}
            <Separator />
          </>
        )}

        {mass.postCommunion && (
          <>
            {renderSection(
              'Oração depois da Comunhão',
              mass.postCommunion,
              'Terminada a distribuição da Comunhão:'
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
