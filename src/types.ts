export type WineType = 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert' | 'fortified';

export interface Wine {
  id: string;
  name: string;
  winery: string;
  vintage: number | null;
  type: WineType;
  grapes: string;
  region: string;
  country: string;
  rating: number; // 1-5
  price: number | null;
  currency: string;
  notes: string;
  pairings: string[];
  dateAdded: string;
  dateTasted: string | null;
  favorite: boolean;
  bottlesOwned: number;
  label?: string; // emoji or color code
}

export type SortKey = 'dateAdded' | 'name' | 'rating' | 'vintage' | 'winery';
export type SortDir = 'asc' | 'desc';

export interface Filters {
  search: string;
  types: WineType[];
  minRating: number;
  countries: string[];
  favorites: boolean;
}
