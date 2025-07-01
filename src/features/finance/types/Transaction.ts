export interface Transaction {
  transactionId?: string;
  accountId?: string;
  date: string;
  assetName: string;
  symbol: string;
  assetType: string;
  credit: number;
  debit: number;
  unit?: string;
}