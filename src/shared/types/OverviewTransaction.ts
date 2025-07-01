import { Transaction } from './Transaction';

export interface OverviewTransaction extends Transaction {
  totalBalanceBefore: number;
  totalBalanceAfter: number;
}