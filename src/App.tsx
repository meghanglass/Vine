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
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="pt-10 pb-8 border-b border-stone-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                Vine
              </h1>
              <p className="text-stone-400 text-sm mt-0.5">Wine cellar</p>
            </div>

            <motion.button
              onClick={openAdd}
              className="btn-primary flex items-center gap-2 text-sm"
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add Wine
            </motion.button>
          </div>
        </header>

        {/* Stats */}
        {wines.length > 0 && (
          <div className="mt-6 mb-6">
            <StatsBar stats={stats} />
          </div>
        )}

        {/* Filter & sort bar */}
        {wines.length > 0 && (
          <div className="mb-5">
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
            <p className="text-stone-400 text-sm">
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'wine' : 'wines'}
            </p>
            <div className="flex gap-0.5 p-1 rounded-lg bg-white border border-stone-200">
              {([['grid', Grid3X3], ['list', List], ['compact', LayoutGrid]] as [ViewMode, typeof Grid3X3][]).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === mode
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                  aria-label={`${mode} view`}
                >
                  <Icon size={14} />
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
            className={`grid gap-3 ${VIEW_COLS[viewMode]}`}
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

      <WineFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editingWine}
      />

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
