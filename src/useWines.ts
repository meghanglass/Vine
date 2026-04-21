import { useState, useEffect, useCallback } from 'react';
import type { Wine, Filters, SortKey, SortDir } from './types';

const STORAGE_KEY = 'vine-catalog';

function loadWines(): Wine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWines(wines: Wine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
}

export function useWines() {
  const [wines, setWines] = useState<Wine[]>(loadWines);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    types: [],
    minRating: 0,
    countries: [],
    favorites: false,
  });
  const [sortKey, setSortKey] = useState<SortKey>('dateAdded');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    saveWines(wines);
  }, [wines]);

  const addWine = useCallback((wine: Omit<Wine, 'id' | 'dateAdded'>) => {
    const newWine: Wine = {
      ...wine,
      id: crypto.randomUUID(),
      dateAdded: new Date().toISOString(),
    };
    setWines(prev => [newWine, ...prev]);
    return newWine;
  }, []);

  const updateWine = useCallback((id: string, updates: Partial<Wine>) => {
    setWines(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  }, []);

  const deleteWine = useCallback((id: string) => {
    setWines(prev => prev.filter(w => w.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setWines(prev => prev.map(w => w.id === id ? { ...w, favorite: !w.favorite } : w));
  }, []);

  const filteredAndSorted = (() => {
    let result = [...wines];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.winery.toLowerCase().includes(q) ||
        w.region.toLowerCase().includes(q) ||
        w.country.toLowerCase().includes(q) ||
        w.grapes.toLowerCase().includes(q)
      );
    }

    if (filters.types.length > 0) {
      result = result.filter(w => filters.types.includes(w.type));
    }

    if (filters.minRating > 0) {
      result = result.filter(w => w.rating >= filters.minRating);
    }

    if (filters.countries.length > 0) {
      result = result.filter(w => filters.countries.includes(w.country));
    }

    if (filters.favorites) {
      result = result.filter(w => w.favorite);
    }

    result.sort((a, b) => {
      let va: string | number, vb: string | number;
      switch (sortKey) {
        case 'name': va = a.name; vb = b.name; break;
        case 'rating': va = a.rating; vb = b.rating; break;
        case 'vintage': va = a.vintage ?? 0; vb = b.vintage ?? 0; break;
        case 'winery': va = a.winery; vb = b.winery; break;
        default: va = a.dateAdded; vb = b.dateAdded;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  })();

  const stats = {
    total: wines.length,
    totalBottles: wines.reduce((s, w) => s + (w.bottlesOwned || 1), 0),
    avgRating: wines.length ? wines.reduce((s, w) => s + w.rating, 0) / wines.length : 0,
    countries: [...new Set(wines.map(w => w.country).filter(Boolean))].length,
    favorites: wines.filter(w => w.favorite).length,
    byType: {
      red: wines.filter(w => w.type === 'red').length,
      white: wines.filter(w => w.type === 'white').length,
      rosé: wines.filter(w => w.type === 'rosé').length,
      sparkling: wines.filter(w => w.type === 'sparkling').length,
      dessert: wines.filter(w => w.type === 'dessert').length,
      fortified: wines.filter(w => w.type === 'fortified').length,
    },
  };

  const allCountries = [...new Set(wines.map(w => w.country).filter(Boolean))].sort();

  return {
    wines,
    filteredAndSorted,
    filters,
    setFilters,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    addWine,
    updateWine,
    deleteWine,
    toggleFavorite,
    stats,
    allCountries,
  };
}
