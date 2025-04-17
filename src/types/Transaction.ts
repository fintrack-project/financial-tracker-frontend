export interface Transaction {
  transactionId?: string;
  accountId?: string;
  date: string;
  assetName: string;
  symbol: string;
  credit: number;
  debit: number;
  unit: string;
}