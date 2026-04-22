import { motion } from 'framer-motion';

interface Props {
  hasFilters: boolean;
  onAdd: () => void;
}

export function EmptyState({ hasFilters, onAdd }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      {hasFilters ? (
        <>
          <span className="text-4xl mb-4 opacity-40">🔍</span>
          <h3 className="text-base font-medium text-stone-700 mb-1">
            No wines match your filters
          </h3>
          <p className="text-sm text-stone-400">Try adjusting your search or filters</p>
        </>
      ) : (
        <>
          <motion.span
            className="text-5xl mb-5 block"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🍷
          </motion.span>

          <h3 className="text-base font-medium text-stone-800 mb-1.5">
            Your cellar awaits
          </h3>
          <p className="text-sm text-stone-400 mb-7 max-w-xs">
            Start building your personal wine collection. Add wines you've tasted, own, or want to remember.
          </p>
          <button onClick={onAdd} className="btn-primary">
            Add your first wine
          </button>
        </>
      )}
    </motion.div>
  );
}
