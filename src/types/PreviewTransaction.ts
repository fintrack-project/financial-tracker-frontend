import { Transaction } from './Transaction';

export interface PreviewTransaction extends Transaction {
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  markDelete: boolean; // Field to indicate if the transaction is marked for deletion
}