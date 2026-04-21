import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Grid3X3, List, LayoutGrid } from 'lucide-react';
import { useWines } from './useWines';
import type { Wine } from './types';
import { WineCard } from './components/WineCard';
import { WineFormModal } from './components/WineFormModal';
import { WineDetailModal } from './components/WineDetailModal';
import { FilterBar } from './components/FilterBar';
import { StatsBar } from './components/StatsBar';
import { EmptyState } from './components/EmptyState';

type ViewMode = 'grid' | 'list' | 'compact';

const VIEW_COLS: Record<ViewMode, string> = {
  grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  list: 'grid-cols-1',
  compact: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};

export default function App() {
  const {
    filteredAndSorted,
    filters, setFilters,
    sortKey, setSortKey,
    sortDir, setSortDir,
    addWine, updateWine, deleteWine, toggleFavorite,
    stats, allCountries,
    wines,
  } = useWines();

  const [formOpen, setFormOpen] = useState(false);
  const [editingWine, setEditingWine] = useState<Wine | null>(null);
  const [viewingWine, setViewingWine] = useState<Wine | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const openAdd = () => {
    setEditingWine(null);
    setFormOpen(true);
  };

  const openEdit = (wine: Wine) => {
    setEditingWine(wine);
    setFormOpen(true);
  };

  const handleSave = (data: Omit<Wine, 'id' | 'dateAdded'>) => {
    if (editingWine) {
      updateWine(editingWine.id, data);
    } else {
      addWine(data);
    }
  };

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.minRating > 0 ||
    filters.countries.length > 0 ||
    filters.favorites ||
    !!filters.search;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #1a0a0c 0%, #0d0507 60%, #120810 100%)' }}>
      {/* Ambient background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(114,47,55,0.25) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="pt-10 pb-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">🍷</span>
                <h1
                  className="text-4xl sm:text-5xl font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    background: 'linear-gradient(135deg, #FAF3E0 30%, #C9A84C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Vine
                </h1>
              </div>
              <p className="text-wine-500 text-sm tracking-widest uppercase">Your Private Wine Cellar</p>
            </div>

            {/* Add button */}
            <motion.button
              onClick={openAdd}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={18} />
              Add Wine
            </motion.button>
          </div>
        </header>

        {/* Stats (only when there are wines) */}
        {wines.length > 0 && (
          <div className="mb-8">
            <StatsBar stats={stats} />
          </div>
        )}

        {/* Filter & sort bar */}
        {wines.length > 0 && (
          <div className="mb-6">
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              sortKey={sortKey}
              setSortKey={setSortKey}
              sortDir={sortDir}
              setSortDir={setSortDir}
              allCountries={allCountries}
              count={filteredAndSorted.length}
              total={wines.length}
            />
          </div>
        )}

        {/* View mode toggle + count */}
        {wines.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-wine-600 text-sm">
              {filteredAndSorted.length} wine{filteredAndSorted.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-1 p-1 rounded-xl bg-burgundy-dark/40 border border-wine-900/30">
              {([['grid', Grid3X3], ['list', List], ['compact', LayoutGrid]] as [ViewMode, typeof Grid3X3][]).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === mode
                      ? 'bg-gold/20 text-gold'
                      : 'text-wine-600 hover:text-cream'
                  }`}
                  aria-label={`${mode} view`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wine grid / empty state */}
        {filteredAndSorted.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onAdd={openAdd} />
        ) : (
          <motion.div
            layout
            className={`grid gap-4 ${VIEW_COLS[viewMode]}`}
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map((wine, i) => (
                <WineCard
                  key={wine.id}
                  wine={wine}
                  index={i}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteWine}
                  onEdit={openEdit}
                  onView={setViewingWine}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Add/Edit form modal */}
      <WineFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editingWine}
      />

      {/* Detail view modal */}
      <WineDetailModal
        wine={viewingWine}
        onClose={() => setViewingWine(null)}
        onEdit={wine => { setViewingWine(null); openEdit(wine); }}
        onDelete={id => { deleteWine(id); setViewingWine(null); }}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
