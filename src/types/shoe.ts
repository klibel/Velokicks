export interface Shoe {
  id: number;
  brand: string;
  name: string;
  category: string;
  featured: number;
  gender: 'MEN' | 'WOMEN';
  imageURL: string;
  is_in_inventory: boolean;
  items_left: number;
  price: number;
  slug: string;
}

export interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFloating?: boolean;
}