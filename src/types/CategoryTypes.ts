export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface CategoryAndSubcategories {
  categories: Category[];
  subcategories: { [categoryId: string]: Subcategory[] };
} 