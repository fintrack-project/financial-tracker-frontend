export interface HoldingsCategories {
  [category: string]: {
    [assetName: string]: string | null;
  };
}
