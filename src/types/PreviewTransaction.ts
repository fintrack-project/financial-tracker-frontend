import { OverviewTransaction } from './OverviewTransaction';

export interface PreviewTransaction extends OverviewTransaction {
  markDelete: boolean; // Field to indicate if the transaction is marked for deletion
}