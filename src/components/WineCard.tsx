import { motion } from 'framer-motion';
import { Heart, Trash2, Edit3, MapPin, Calendar, Package } from 'lucide-react';
import type { Wine } from '../types';
import { WineTypeIcon } from './WineTypeIcon';
import { StarRating } from './StarRating';

interface Props {
  wine: Wine;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (wine: Wine) => void;
  onView: (wine: Wine) => void;
  index: number;
}

const typeHeaderBg: Record<string, string> = {
  red:       '#FEF2F2',
  white:     '#FEFCE8',
  rosé:      '#FDF2F8',
  sparkling: '#F0F9FF',
  dessert:   '#FFFBEB',
  fortified: '#FFF7ED',
};

export function WineCard({ wine, onToggleFavorite, onDelete, onEdit, onView, index }: Props) {
  const headerBg = typeHeaderBg[wine.type] ?? typeHeaderBg.red;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group wine-card cursor-pointer"
      onClick={() => onView(wine)}
    >
      {/* Header image / color area */}
      <div
        className="relative overflow-hidden"
        style={{ height: 156, background: wine.photo ? undefined : headerBg }}
      >
        {wine.photo ? (
          <>
            <img
              src={wine.photo}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)' }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-20 select-none" aria-hidden>
              {wine.type === 'red' ? '🍷' :
               wine.type === 'white' ? '🥂' :
               wine.type === 'rosé' ? '🌸' :
               wine.type === 'sparkling' ? '✨' :
               wine.type === 'dessert' ? '🍯' : '🏺'}
            </span>
          </div>
        )}

        {/* Favorite indicator */}
        {wine.favorite && (
          <div className="absolute top-2.5 right-2.5">
            <Heart size={13} className="text-red-400 fill-red-400" />
          </div>
        )}

        {/* Price (only shown on photo cards at bottom) */}
        {wine.photo && wine.price && (
          <div className="absolute bottom-2.5 right-2.5 text-xs font-medium text-white/90 bg-black/30 rounded-md px-1.5 py-0.5 backdrop-blur-sm">
            {wine.currency}{wine.price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type badge + bottle count */}
        <div className="flex items-center justify-between mb-2.5">
          <WineTypeIcon type={wine.type} size="sm" showLabel />
          <div className="flex items-center gap-1.5">
            {wine.bottlesOwned > 1 && (
              <span className="flex items-center gap-0.5 text-xs text-stone-400">
                <Package size={10} />
                {wine.bottlesOwned}
              </span>
            )}
            {!wine.photo && wine.price && (
              <span className="text-xs text-stone-500 font-medium">
                {wine.currency}{wine.price}
              </span>
            )}
          </div>
        </div>

        {/* Name + winery */}
        <h3 className="text-sm font-semibold text-stone-900 leading-snug mb-0.5 line-clamp-2">
          {wine.name}
        </h3>
        {wine.winery && (
          <p className="text-xs text-stone-500 mb-2.5 truncate">{wine.winery}</p>
        )}

        {/* Meta */}
        <div className="space-y-1 mb-3">
          {(wine.region || wine.country) && (
            <div className="flex items-center gap-1 text-xs text-stone-400">
              <MapPin size={10} strokeWidth={1.5} />
              <span className="truncate">{[wine.region, wine.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {wine.vintage && (
            <div className="flex items-center gap-1 text-xs text-stone-400">
              <Calendar size={10} strokeWidth={1.5} />
              <span>{wine.vintage}</span>
            </div>
          )}
        </div>

        {/* Footer: rating + actions */}
        <div
          className="flex items-center justify-between pt-3 border-t border-stone-100"
          onClick={e => e.stopPropagation()}
        >
          <StarRating value={wine.rating} readonly size="sm" />

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onToggleFavorite(wine.id)}
              className="p-1.5 rounded-md hover:bg-stone-100 transition-colors"
              aria-label="Toggle favorite"
            >
              <Heart
                size={13}
                className={wine.favorite ? 'text-red-400 fill-red-400' : 'text-stone-400'}
              />
            </button>
            <button
              onClick={() => onEdit(wine)}
              className="p-1.5 rounded-md hover:bg-stone-100 transition-colors"
              aria-label="Edit wine"
            >
              <Edit3 size={13} className="text-stone-400" />
            </button>
            <button
              onClick={() => onDelete(wine.id)}
              className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
              aria-label="Delete wine"
            >
              <Trash2 size={13} className="text-stone-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
