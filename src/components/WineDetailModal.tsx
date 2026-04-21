import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Edit3, Trash2, MapPin, Calendar, Package, Wine, Clock } from 'lucide-react';
import type { Wine as WineType } from '../types';
import { WineTypeIcon, typeConfig } from './WineTypeIcon';
import { StarRating } from './StarRating';

interface Props {
  wine: WineType | null;
  onClose: () => void;
  onEdit: (wine: WineType) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function WineDetailModal({ wine, onClose, onEdit, onDelete, onToggleFavorite }: Props) {
  if (!wine) return null;
  const cfg = typeConfig[wine.type];

  const handleDelete = () => {
    onDelete(wine.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {wine && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="w-full max-w-md rounded-3xl overflow-hidden modal-scroll"
            style={{
              background: '#1a0a0c',
              maxHeight: '90vh',
              border: '1px solid rgba(114,47,55,0.4)',
            }}
          >
            {/* Hero section */}
            <div
              className="relative px-6 pt-8 pb-6"
              style={{
                background: wine.photo
                  ? undefined
                  : `linear-gradient(135deg, ${cfg.bg.replace('0.15', '0.4')}, transparent)`,
                borderBottom: '1px solid rgba(114,47,55,0.3)',
              }}
            >
              {/* Photo background */}
              {wine.photo && (
                <>
                  <img
                    src={wine.photo}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ borderRadius: 0 }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(170deg, rgba(10,3,5,0.45) 0%, rgba(10,3,5,0.15) 35%, rgba(10,3,5,0.85) 100%)',
                    }}
                  />
                </>
              )}

              {/* Decorative wine glass illustration (only without photo) */}
              {!wine.photo && (
                <div
                  className="absolute top-4 right-12 text-6xl opacity-10 pointer-events-none select-none"
                  style={{ transform: 'rotate(10deg)' }}
                  aria-hidden
                >
                  {cfg.emoji}
                </div>
              )}

              {/* Top actions */}
              <div className="flex items-center justify-between mb-4">
                <WineTypeIcon type={wine.type} showLabel size="md" />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleFavorite(wine.id)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={wine.favorite ? 'text-wine-400 fill-wine-400' : 'text-cream/40'}
                    />
                  </button>
                  <button
                    onClick={() => { onClose(); setTimeout(() => onEdit(wine), 50); }}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-cream/40 hover:text-cream"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl hover:bg-red-500/20 transition-colors text-cream/40 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-cream/40 hover:text-cream ml-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1
                className="text-2xl font-semibold text-cream mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {wine.name}
              </h1>
              {wine.winery && (
                <p className="text-wine-300 font-medium mb-4">{wine.winery}</p>
              )}

              {/* Rating */}
              <StarRating value={wine.rating} readonly size="lg" />
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto modal-scroll" style={{ maxHeight: '55vh' }}>
              {/* Key facts grid */}
              <div className="grid grid-cols-2 gap-3">
                {wine.vintage && (
                  <div className="bg-burgundy-dark/40 rounded-xl p-3 border border-wine-900/30">
                    <div className="flex items-center gap-1.5 text-xs text-wine-500 mb-1">
                      <Calendar size={12} /> Vintage
                    </div>
                    <p className="text-cream font-semibold text-lg">{wine.vintage}</p>
                  </div>
                )}
                {(wine.region || wine.country) && (
                  <div className="bg-burgundy-dark/40 rounded-xl p-3 border border-wine-900/30">
                    <div className="flex items-center gap-1.5 text-xs text-wine-500 mb-1">
                      <MapPin size={12} /> Origin
                    </div>
                    <p className="text-cream font-medium text-sm">
                      {[wine.region, wine.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                {wine.grapes && (
                  <div className="bg-burgundy-dark/40 rounded-xl p-3 border border-wine-900/30">
                    <div className="flex items-center gap-1.5 text-xs text-wine-500 mb-1">
                      <Wine size={12} /> Grapes
                    </div>
                    <p className="text-cream font-medium text-sm">{wine.grapes}</p>
                  </div>
                )}
                {wine.bottlesOwned > 0 && (
                  <div className="bg-burgundy-dark/40 rounded-xl p-3 border border-wine-900/30">
                    <div className="flex items-center gap-1.5 text-xs text-wine-500 mb-1">
                      <Package size={12} /> Cellar
                    </div>
                    <p className="text-cream font-semibold text-lg">
                      {wine.bottlesOwned}
                      <span className="text-sm font-normal text-wine-400 ml-1">
                        bottle{wine.bottlesOwned !== 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Price */}
              {wine.price && (
                <div className="flex items-center justify-between py-3 border-t border-b border-wine-900/30">
                  <span className="text-wine-500 text-sm">Price</span>
                  <span className="text-gold font-semibold text-lg">
                    {wine.currency} {wine.price.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Tasting notes */}
              {wine.notes && (
                <div>
                  <h3 className="text-xs text-wine-500 uppercase tracking-wider mb-2">Tasting Notes</h3>
                  <p className="text-cream/80 text-sm leading-relaxed italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    "{wine.notes}"
                  </p>
                </div>
              )}

              {/* Pairings */}
              {wine.pairings.length > 0 && (
                <div>
                  <h3 className="text-xs text-wine-500 uppercase tracking-wider mb-2">Food Pairings</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {wine.pairings.map(p => (
                      <span
                        key={p}
                        className="px-2.5 py-1 bg-gold/10 border border-gold/25 rounded-full text-xs text-gold"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-wine-900/30">
                <div className="flex items-center gap-2 text-xs text-wine-600">
                  <Clock size={11} />
                  Added {new Date(wine.dateAdded).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                {wine.dateTasted && (
                  <div className="flex items-center gap-2 text-xs text-wine-600">
                    <Clock size={11} />
                    Tasted {new Date(wine.dateTasted).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
