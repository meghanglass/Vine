import { motion } from 'framer-motion';
import { Wine, Globe, Heart, Star, Package } from 'lucide-react';

interface Props {
  stats: {
    total: number;
    totalBottles: number;
    avgRating: number;
    countries: number;
    favorites: number;
  };
}

export function StatsBar({ stats }: Props) {
  const items = [
    { icon: Wine,    label: 'Wines',      value: stats.total },
    { icon: Package, label: 'Bottles',    value: stats.totalBottles },
    { icon: Star,    label: 'Avg Rating', value: stats.avgRating.toFixed(1) },
    { icon: Globe,   label: 'Countries',  value: stats.countries },
    { icon: Heart,   label: 'Favorites',  value: stats.favorites },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex flex-col items-center gap-1 bg-white border border-stone-200 rounded-xl py-3 px-2"
        >
          <item.icon size={14} className="text-stone-400" strokeWidth={1.5} />
          <span className="text-xl font-semibold text-stone-900 leading-none">
            {item.value}
          </span>
          <span className="text-xs text-stone-400">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
