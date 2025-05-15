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

export interface CategoryAndSubcategoriesNamesMap {
  categories: string[];
  subcategories: {
    [category: string]: string[];
  };
}

export enum CategoryColor {
  RED = "#FF0000",
  GREEN = "#00FF00",
  BLUE = "#0000FF",
  ORANGE = "#FFA500",
  PURPLE = "#800080",
  CYAN = "#00FFFF",
  DARK_CYAN = "#008B8B",
  TEAL = "#008080",
  DARK_OLIVE_GREEN = "#556B2F",
  STEEL_BLUE = "#4682B4",
  MEDIUM_SLATE_BLUE = "#7B68EE",
  INDIAN_RED = "#CD5C5C",
  GOLDENROD = "#DAA520",
  SIENNA = "#A0522D",
  DARK_KHAKI = "#BDB76B",
  CADET_BLUE = "#5F9EA0"
}

export interface CategoryProps {
  value: string;
  isEditing: boolean;
  onChange?: (newValue: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRemove: () => void;
  children?: React.ReactNode;
  showActions?: boolean;
  isSubcategory?: boolean;
  color?: CategoryColor;
  accountId?: string | null;
  categoryName?: string;
  resetHasFetched?: () => void;
}

export interface CategoryDisplayCellProps extends CategoryProps {}

export interface CategoryDropdownCellProps extends Omit<CategoryProps, 'onChange'> {
  options: string[];
  onChange: (newValue: string) => void;
}

export interface CategoryInputCellProps extends Omit<CategoryProps, 'onChange'> {
  placeholder?: string;
  onChange: (newValue: string) => void;
}