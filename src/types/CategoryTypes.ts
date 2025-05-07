export interface CategoryResponse {
  categories: string[];
  subcategories: {
    [category: string]: string[];
  };
}

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
  categories: string[];
  subcategories: {
    [category: string]: string[];
  };
}