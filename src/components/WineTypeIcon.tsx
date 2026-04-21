import type { WineType } from '../types';

interface Props {
  type: WineType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const typeConfig: Record<WineType, { emoji: string; label: string; color: string; bg: string }> = {
  red:       { emoji: '🍷', label: 'Red',       color: '#ec7592', bg: 'rgba(236,117,146,0.15)' },
  white:     { emoji: '🥂', label: 'White',     color: '#f5e6bc', bg: 'rgba(245,230,188,0.15)' },
  rosé:      { emoji: '🌸', label: 'Rosé',      color: '#f4a8b9', bg: 'rgba(244,168,185,0.15)' },
  sparkling: { emoji: '✨', label: 'Sparkling', color: '#C9A84C', bg: 'rgba(201,168,76,0.15)'  },
  dessert:   { emoji: '🍯', label: 'Dessert',   color: '#e8c96e', bg: 'rgba(232,201,110,0.15)' },
  fortified: { emoji: '🏺', label: 'Fortified', color: '#e8856a', bg: 'rgba(232,133,106,0.15)' },
};

const sizes = { sm: '0.65rem', md: '0.75rem', lg: '0.875rem' };

export function WineTypeIcon({ type, size = 'md', showLabel = false }: Props) {
  const cfg = typeConfig[type];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontSize: sizes[size],
        border: `1px solid ${cfg.color}33`,
      }}
    >
      <span>{cfg.emoji}</span>
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
}

export { typeConfig };
