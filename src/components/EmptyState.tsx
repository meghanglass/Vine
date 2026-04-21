import { motion } from 'framer-motion';

interface Props {
  hasFilters: boolean;
  onAdd: () => void;
}

export function EmptyState({ hasFilters, onAdd }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      {hasFilters ? (
        <>
          <span className="text-5xl mb-4 opacity-50">🔍</span>
          <h3
            className="text-xl font-semibold text-cream/80 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No wines match your filters
          </h3>
          <p className="text-sm text-wine-400">Try adjusting your search or filters</p>
        </>
      ) : (
        <>
          {/* Decorative wine bottle */}
          <div className="relative mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl"
            >
              🍷
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-2 text-2xl"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              ✨
            </motion.div>
          </div>

          <h3
            className="text-2xl font-semibold text-cream mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your cellar awaits
          </h3>
          <p className="text-wine-400 text-sm mb-8 max-w-xs">
            Start building your personal wine collection. Add wines you've tasted, own, or want to remember.
          </p>
          <button onClick={onAdd} className="btn-primary">
            Add Your First Wine
          </button>
        </>
      )}
    </motion.div>
  );
}
