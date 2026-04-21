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
    { icon: Wine, label: 'Wines', value: stats.total },
    { icon: Package, label: 'Bottles', value: stats.totalBottles },
    { icon: Star, label: 'Avg Rating', value: stats.avgRating.toFixed(1) },
    { icon: Globe, label: 'Countries', value: stats.countries },
    { icon: Heart, label: 'Favorites', value: stats.favorites },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex flex-col items-center gap-1 bg-burgundy-dark/60 border border-wine-900/40 rounded-2xl py-4 px-2"
        >
          <item.icon size={18} className="text-gold" />
          <span className="font-display text-2xl font-semibold text-cream" style={{ fontFamily: "'Playfair Display', serif" }}>
            {item.value}
          </span>
          <span className="text-xs text-wine-400 tracking-wider uppercase">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
