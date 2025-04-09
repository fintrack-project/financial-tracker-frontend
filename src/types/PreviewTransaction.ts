import { Transaction } from './Transaction';

export interface PreviewTransaction extends Transaction {
  markDelete: boolean; // Field to indicate if the transaction is marked for deletion
}