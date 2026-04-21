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

const typeColors: Record<string, string> = {
  red: 'from-wine-950 via-burgundy-dark to-wine-900',
  white: 'from-amber-950 via-stone-900 to-amber-900',
  rosé: 'from-pink-950 via-rose-900 to-pink-800',
  sparkling: 'from-slate-950 via-slate-900 to-indigo-950',
  dessert: 'from-amber-950 via-amber-900 to-yellow-900',
  fortified: 'from-red-950 via-red-900 to-red-800',
};

const glowColors: Record<string, string> = {
  red: '180, 30, 60',
  white: '201, 168, 76',
  rosé: '244, 168, 185',
  sparkling: '147, 197, 253',
  dessert: '232, 201, 110',
  fortified: '171, 24, 69',
};

export function WineCard({ wine, onToggleFavorite, onDelete, onEdit, onView, index }: Props) {
  const gradient = typeColors[wine.type] ?? typeColors.red;
  const glow = glowColors[wine.type] ?? glowColors.red;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: `0 4px 24px rgba(${glow}, 0.15)`,
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(${glow}, 0.35)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px rgba(${glow}, 0.15)`;
      }}
    >
      {/* Background: photo or gradient */}
      {wine.photo ? (
        <>
          <img
            src={wine.photo}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* scrim so text stays readable */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)`,
            }}
          />
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(${glow},0.4) 0%, transparent 60%)`,
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative p-5 flex flex-col h-full min-h-[220px]" onClick={() => onView(wine)}>
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <WineTypeIcon type={wine.type} size="sm" showLabel />
          <div className="flex items-center gap-1">
            {wine.bottlesOwned > 1 && (
              <span className="flex items-center gap-0.5 text-xs text-cream/60 bg-black/20 rounded-full px-2 py-0.5">
                <Package size={10} />
                {wine.bottlesOwned}
              </span>
            )}
          </div>
        </div>

        {/* Wine name */}
        <div className="flex-1 mb-3">
          <h3
            className="text-lg font-semibold leading-tight mb-1 text-cream group-hover:text-gold transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {wine.name}
          </h3>
          <p className="text-sm text-cream/80 font-medium">{wine.winery}</p>
        </div>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          {(wine.region || wine.country) && (
            <div className="flex items-center gap-1 text-xs text-cream/75">
              <MapPin size={11} />
              <span>{[wine.region, wine.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {wine.vintage && (
            <div className="flex items-center gap-1 text-xs text-cream/75">
              <Calendar size={11} />
              <span>{wine.vintage}</span>
            </div>
          )}
        </div>

        {/* Bottom: rating + actions */}
        <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <StarRating value={wine.rating} readonly size="sm" />

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onToggleFavorite(wine.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle favorite"
            >
              <Heart
                size={15}
                className={wine.favorite ? 'text-wine-400 fill-wine-400' : 'text-cream/60'}
              />
            </button>
            <button
              onClick={() => onEdit(wine)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Edit wine"
            >
              <Edit3 size={15} className="text-cream/60" />
            </button>
            <button
              onClick={() => onDelete(wine.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
              aria-label="Delete wine"
            >
              <Trash2 size={15} className="text-cream/60 hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Favorite indicator */}
      {wine.favorite && (
        <div className="absolute top-3 right-3">
          <Heart size={14} className="text-wine-400 fill-wine-400" />
        </div>
      )}

      {/* Price badge */}
      {wine.price && (
        <div className="absolute bottom-5 right-5 text-xs font-medium text-gold/70">
          {wine.currency}{wine.price}
        </div>
      )}
    </motion.div>
  );
}
