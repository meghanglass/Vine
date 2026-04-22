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

  const activeCount =
    filters.types.length +
    (filters.minRating > 0 ? 1 : 0) +
    filters.countries.length +
    (filters.favorites ? 1 : 0);

  return (
    <div className="space-y-2">
      {/* Search + controls row */}
      <div className="flex gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search wines, wineries, regions…"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="input-field pl-8 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(f => ({ ...f, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-0.5 bg-white border border-stone-200 rounded-lg px-3 text-sm">
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="bg-transparent text-stone-700 outline-none py-2.5 cursor-pointer text-sm"
          >
            <option value="dateAdded">Date Added</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="vintage">Vintage</option>
            <option value="winery">Winery</option>
          </select>
          <button
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
            className="text-stone-400 hover:text-stone-600 transition-colors ml-0.5"
            aria-label="Toggle sort direction"
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${sortDir === 'asc' ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 ${
            hasActiveFilters || open
              ? 'bg-stone-900 border-stone-900 text-white'
              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
          }`}
        >
          <SlidersHorizontal size={13} strokeWidth={1.75} />
          Filters
          {activeCount > 0 && (
            <span className="bg-white text-stone-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold leading-none">
              {activeCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            <X size={12} /> Clear
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-4">
              {/* Wine types */}
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-2.5 font-medium">Wine Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {WINE_TYPES.map(t => {
                    const cfg = typeConfig[t];
                    const active = filters.types.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                          active ? 'font-medium' : 'border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                        style={active ? {
                          background: cfg.bg,
                          color: cfg.color,
                          borderColor: `${cfg.color}33`,
                        } : {}}
                      >
                        {cfg.emoji} {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Min rating */}
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-2.5 font-medium">Minimum Rating</p>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => setFilters(f => ({ ...f, minRating: r }))}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-150 ${
                        filters.minRating === r
                          ? 'bg-stone-900 border-stone-900 text-white font-medium'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
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
                  <p className="text-xs text-stone-400 uppercase tracking-wider mb-2.5 font-medium">Country</p>
                  <div className="flex flex-wrap gap-1.5">
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
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                            active
                              ? 'bg-stone-900 border-stone-900 text-white font-medium'
                              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
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
              <div>
                <button
                  onClick={() => setFilters(f => ({ ...f, favorites: !f.favorites }))}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm transition-all duration-150 ${
                    filters.favorites
                      ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
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
        <p className="text-xs text-stone-400">
          Showing <span className="text-stone-700 font-medium">{count}</span> of {total} wines
        </p>
      )}
    </div>
  );
}
