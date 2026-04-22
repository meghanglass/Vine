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
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-2xl overflow-hidden modal-scroll"
            style={{
              maxHeight: '90vh',
              border: '1px solid #E7E5E4',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.07)',
            }}
          >
            {/* Hero section */}
            <div
              className="relative"
              style={{
                background: wine.photo ? undefined : cfg.bg,
                borderBottom: '1px solid #E7E5E4',
              }}
            >
              {wine.photo ? (
                <>
                  <img
                    src={wine.photo}
                    alt=""
                    aria-hidden
                    className="w-full object-cover"
                    style={{ height: 200 }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
                    }}
                  />
                </>
              ) : (
                <div className="relative px-6 pt-6 pb-5">
                  {/* Decorative emoji */}
                  <div
                    className="absolute top-4 right-8 text-5xl opacity-10 pointer-events-none select-none"
                    style={{ transform: 'rotate(8deg)' }}
                    aria-hidden
                  >
                    {cfg.emoji}
                  </div>
                </div>
              )}

              {/* Action bar overlaid on hero */}
              <div className={`flex items-center justify-between px-5 ${wine.photo ? 'absolute bottom-0 left-0 right-0 pb-4' : 'pb-0'}`}>
                {wine.photo ? (
                  <div className="flex-1" />
                ) : null}
                <div className="flex items-center gap-0.5 ml-auto">
                  <button
                    onClick={() => onToggleFavorite(wine.id)}
                    className={`p-2 rounded-lg transition-colors ${wine.photo ? 'hover:bg-white/20 text-white/80 hover:text-white' : 'hover:bg-black/5 text-stone-500 hover:text-stone-800'}`}
                  >
                    <Heart
                      size={16}
                      className={wine.favorite ? 'text-red-400 fill-red-400' : ''}
                    />
                  </button>
                  <button
                    onClick={() => { onClose(); setTimeout(() => onEdit(wine), 50); }}
                    className={`p-2 rounded-lg transition-colors ${wine.photo ? 'hover:bg-white/20 text-white/80 hover:text-white' : 'hover:bg-black/5 text-stone-500 hover:text-stone-800'}`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`p-2 rounded-lg transition-colors ${wine.photo ? 'hover:bg-red-500/30 text-white/70 hover:text-red-300' : 'hover:bg-red-50 text-stone-500 hover:text-red-500'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ml-0.5 ${wine.photo ? 'hover:bg-white/20 text-white/80 hover:text-white' : 'hover:bg-black/5 text-stone-500 hover:text-stone-800'}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Title section */}
            <div className="px-6 pt-5 pb-4 border-b border-stone-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <WineTypeIcon type={wine.type} showLabel size="md" />
              </div>
              <h1 className="text-xl font-semibold text-stone-900 mb-0.5 leading-snug">
                {wine.name}
              </h1>
              {wine.winery && (
                <p className="text-sm text-stone-500 mb-3">{wine.winery}</p>
              )}
              <StarRating value={wine.rating} readonly size="md" />
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto modal-scroll scrollbar-light" style={{ maxHeight: '50vh' }}>
              {/* Key facts grid */}
              <div className="grid grid-cols-2 gap-2">
                {wine.vintage && (
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                      <Calendar size={11} strokeWidth={1.5} /> Vintage
                    </div>
                    <p className="text-stone-900 font-semibold text-lg leading-none">{wine.vintage}</p>
                  </div>
                )}
                {(wine.region || wine.country) && (
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                      <MapPin size={11} strokeWidth={1.5} /> Origin
                    </div>
                    <p className="text-stone-800 font-medium text-sm">
                      {[wine.region, wine.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                {wine.grapes && (
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                      <Wine size={11} strokeWidth={1.5} /> Grapes
                    </div>
                    <p className="text-stone-800 font-medium text-sm">{wine.grapes}</p>
                  </div>
                )}
                {wine.bottlesOwned > 0 && (
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                      <Package size={11} strokeWidth={1.5} /> Cellar
                    </div>
                    <p className="text-stone-900 font-semibold text-lg leading-none">
                      {wine.bottlesOwned}
                      <span className="text-sm font-normal text-stone-400 ml-1">
                        bottle{wine.bottlesOwned !== 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Price */}
              {wine.price && (
                <div className="flex items-center justify-between py-3 border-t border-b border-stone-100">
                  <span className="text-sm text-stone-500">Price</span>
                  <span className="text-stone-900 font-semibold">
                    {wine.currency} {wine.price.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Tasting notes */}
              {wine.notes && (
                <div>
                  <h3 className="text-xs text-stone-400 uppercase tracking-wider mb-2 font-medium">Tasting Notes</h3>
                  <p className="text-stone-600 text-sm leading-relaxed italic">
                    "{wine.notes}"
                  </p>
                </div>
              )}

              {/* Pairings */}
              {wine.pairings.length > 0 && (
                <div>
                  <h3 className="text-xs text-stone-400 uppercase tracking-wider mb-2 font-medium">Food Pairings</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {wine.pairings.map(p => (
                      <span
                        key={p}
                        className="px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-600"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <Clock size={11} strokeWidth={1.5} />
                  Added {new Date(wine.dateAdded).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                {wine.dateTasted && (
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Clock size={11} strokeWidth={1.5} />
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
