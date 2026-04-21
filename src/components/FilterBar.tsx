import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Filters, SortKey, SortDir, WineType } from '../types';
import { typeConfig } from './WineTypeIcon';

interface Props {
  filters: Filters;
  setFilters: (f: Filters | ((prev: Filters) => Filters)) => void;
  sortKey: SortKey;
  setSortKey: (k: SortKey) => void;
  sortDir: SortDir;
  setSortDir: (d: SortDir) => void;
  allCountries: string[];
  count: number;
  total: number;
}

const WINE_TYPES: WineType[] = ['red', 'white', 'rosé', 'sparkling', 'dessert', 'fortified'];

export function FilterBar({
  filters, setFilters, sortKey, setSortKey, sortDir, setSortDir,
  allCountries, count, total,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggleType = (t: WineType) => {
    setFilters(f => ({
      ...f,
      types: f.types.includes(t) ? f.types.filter(x => x !== t) : [...f.types, t],
    }));
  };

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.minRating > 0 ||
    filters.countries.length > 0 ||
    filters.favorites;

  const clearFilters = () =>
    setFilters(f => ({ ...f, types: [], minRating: 0, countries: [], favorites: false }));

  return (
    <div className="space-y-3">
      {/* Search + controls row */}
      <div className="flex gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Search wines, wineries, regions..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="input-field pl-9 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(f => ({ ...f, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-wine-600 hover:text-cream"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 bg-burgundy-darker border border-wine-800 rounded-xl px-3 text-sm" style={{ background: '#2d0f13' }}>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="bg-transparent text-cream outline-none py-3 cursor-pointer"
          >
            <option value="dateAdded">Date Added</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="vintage">Vintage</option>
            <option value="winery">Winery</option>
          </select>
          <button
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
            className="text-gold hover:text-gold-light transition-colors ml-1"
            aria-label="Toggle sort direction"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${sortDir === 'asc' ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
            hasActiveFilters
              ? 'bg-gold/15 border-gold/50 text-gold'
              : 'border-wine-800 text-cream/70 hover:text-cream hover:border-wine-600'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="bg-gold text-burgundy-deeper text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {filters.types.length + (filters.minRating > 0 ? 1 : 0) + filters.countries.length + (filters.favorites ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-3 rounded-xl text-sm text-wine-400 hover:text-cream transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Expandable filters */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-burgundy-dark/40 border border-wine-900/40 rounded-2xl p-4 space-y-4">
              {/* Wine types */}
              <div>
                <p className="text-xs text-wine-500 uppercase tracking-wider mb-2">Wine Type</p>
                <div className="flex flex-wrap gap-2">
                  {WINE_TYPES.map(t => {
                    const cfg = typeConfig[t];
                    const active = filters.types.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                          active
                            ? 'border-transparent font-medium'
                            : 'border-wine-800 text-cream/60 hover:border-wine-600'
                        }`}
                        style={active ? { background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}44` } : {}}
                      >
                        {cfg.emoji} {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Min rating */}
              <div>
                <p className="text-xs text-wine-500 uppercase tracking-wider mb-2">Minimum Rating</p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => setFilters(f => ({ ...f, minRating: r }))}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        filters.minRating === r
                          ? 'bg-gold/20 border-gold/50 text-gold font-medium'
                          : 'border-wine-800 text-cream/60 hover:border-wine-600'
                      }`}
                    >
                      {r === 0 ? 'Any' : '★'.repeat(r)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries */}
              {allCountries.length > 0 && (
                <div>
                  <p className="text-xs text-wine-500 uppercase tracking-wider mb-2">Country</p>
                  <div className="flex flex-wrap gap-2">
                    {allCountries.map(country => {
                      const active = filters.countries.includes(country);
                      return (
                        <button
                          key={country}
                          onClick={() =>
                            setFilters(f => ({
                              ...f,
                              countries: active
                                ? f.countries.filter(c => c !== country)
                                : [...f.countries, country],
                            }))
                          }
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                            active
                              ? 'bg-wine-800/60 border-wine-600 text-cream font-medium'
                              : 'border-wine-800 text-cream/60 hover:border-wine-600'
                          }`}
                        >
                          {country}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Favorites */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilters(f => ({ ...f, favorites: !f.favorites }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                    filters.favorites
                      ? 'bg-wine-800/40 border-wine-500 text-wine-300 font-medium'
                      : 'border-wine-800 text-cream/60 hover:border-wine-600'
                  }`}
                >
                  ♥ Favorites only
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count */}
      {(hasActiveFilters || filters.search) && (
        <p className="text-xs text-wine-500">
          Showing <span className="text-gold font-medium">{count}</span> of {total} wines
        </p>
      )}
    </div>
  );
}
