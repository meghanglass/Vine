import type { WineType } from '../types';

interface Props {
  type: WineType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const typeConfig: Record<WineType, { emoji: string; label: string; color: string; bg: string }> = {
  red:       { emoji: '🍷', label: 'Red',       color: '#B91C1C', bg: '#FEF2F2' },
  white:     { emoji: '🥂', label: 'White',     color: '#92400E', bg: '#FFFBEB' },
  rosé:      { emoji: '🌸', label: 'Rosé',      color: '#9D174D', bg: '#FDF2F8' },
  sparkling: { emoji: '✨', label: 'Sparkling', color: '#1D4ED8', bg: '#EFF6FF' },
  dessert:   { emoji: '🍯', label: 'Dessert',   color: '#B45309', bg: '#FFFBEB' },
  fortified: { emoji: '🏺', label: 'Fortified', color: '#C2410C', bg: '#FFF7ED' },
};

const sizes = { sm: '0.7rem', md: '0.75rem', lg: '0.8rem' };

export function WineTypeIcon({ type, size = 'md', showLabel = false }: Props) {
  const cfg = typeConfig[type];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontSize: sizes[size],
        border: `1px solid ${cfg.color}22`,
      }}
    >
      <span>{cfg.emoji}</span>
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
}

export { typeConfig };
