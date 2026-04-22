import { useState } from 'react';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-xl' };

export function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  const [hovered, setHovered] = useState(0);

  const display = hovered || value;

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${sizes[size]} transition-all duration-100 leading-none ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          style={{
            color: star <= display ? '#D97706' : '#E7E5E4',
            background: 'none',
            border: 'none',
            padding: 0,
          }}
          onMouseEnter={() => !readonly && setHovered(star)}
          onClick={() => onChange?.(star)}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
