import { LiturgicalColor, LITURGICAL_COLOR_VALUES } from '@/lib/types';

interface LiturgicalColorBadgeProps {
  color: LiturgicalColor;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const COLOR_LABELS: Record<LiturgicalColor, string> = {
  GREEN: 'Verde',
  PURPLE: 'Roxo',
  WHITE: 'Branco',
  RED: 'Vermelho',
  ROSE: 'Rosa',
  BLACK: 'Preto',
  GOLD: 'Dourado',
};

export function LiturgicalColorBadge({
  color,
  size = 'md',
  showLabel = false,
}: LiturgicalColorBadgeProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-full border-2 border-border ${sizeClasses[size]}`}
        style={{
          backgroundColor: LITURGICAL_COLOR_VALUES[color],
        }}
        title={COLOR_LABELS[color]}
      />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{COLOR_LABELS[color]}</span>
      )}
    </div>
  );
}
