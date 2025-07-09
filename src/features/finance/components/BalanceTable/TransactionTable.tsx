import React, { ReactNode } from 'react';
import { format } from 'date-fns';
import './TransactionTable.css';
import { formatNumber } from '../../../../shared/utils/FormatNumber';
import IconButton from '../../../../shared/components/Button/IconButton';
import { FaExchangeAlt } from 'react-icons/fa';
import Icon from '../../../../shared/components/Card/Icon';

interface EmptyStateProps {
  icon: ReactNode;
  text: string;
  subtext: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, text, subtext }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <div className="empty-state-text">{text}</div>
    {subtext && <div className="empty-state-subtext">{subtext}</div>}
  </div>
);

interface TransactionTableRow {
  date: string;
  assetName: string;
  symbol: string;
  assetType: string;
  credit: number;
  debit: number;
  unit?: string;
  totalBalanceBefore?: number;
  totalBalanceAfter?: number;
  isHighlighted?: boolean;
  isMarkedForDeletion?: boolean;
  actions?: React.ReactNode;
}

interface TransactionTableProps<T> {
  transactions: T[];
  isHighlighted?: (transaction: T) => boolean;
  isMarkedForDeletion?: (transaction: T) => boolean;
  onDeleteClick?: (transaction: T) => void;
  onDeleteAllClick?: () => void;
}

const TransactionTable = <T extends {
  transactionId?: string;
  accountId?: string;
  date: string;
  assetName: string;
  symbol: string;
  assetType: string;
  credit: number;
  debit: number;
  unit?: string;
  totalBalanceBefore?: number;
  totalBalanceAfter?: number;
}>({
  transactions,
  isHighlighted = () => false,
  isMarkedForDeletion = () => false,
  onDeleteClick,
  onDeleteAllClick,
}: TransactionTableProps<T>) => {
  
  // Transform transactions into row data
  const tableData: TransactionTableRow[] = transactions.map(transaction => {
    const isHighlightedRow = isHighlighted(transaction);
    const isMarkedForDeletionRow = isMarkedForDeletion(transaction);
    
    return {
      date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      assetName: transaction.assetName,
      symbol: transaction.symbol,
      assetType: transaction.assetType,
      credit: transaction.credit,
      debit: transaction.debit,
      unit: transaction.unit,
      totalBalanceBefore: transaction.totalBalanceBefore,
      totalBalanceAfter: transaction.totalBalanceAfter,
      isHighlighted: isHighlightedRow,
      isMarkedForDeletion: isMarkedForDeletionRow,
      actions: onDeleteClick && (
        <IconButton 
          type="delete" 
          onClick={() => onDeleteClick(transaction)} 
          label="Delete Row"
        />
      )
    };
  });

  const renderHeader = () => (
    <tr>
      <th>Date</th>
      <th>Asset Name</th>
      <th>Symbol</th>
      <th>Asset Type</th>
      <th>Credit (Increase)</th>
      <th>Debit (Decrease)</th>
      <th>Total Balance Before</th>
      <th>Total Balance After</th>
      <th>Unit</th>
      {onDeleteClick && (
        <th
          className="delete-column-header"
          onClick={onDeleteAllClick}
          style={{ cursor: 'pointer', color: '#dc2626' }}
        >
          Delete All
        </th>
      )}
    </tr>
  );

  const renderRow = (row: TransactionTableRow) => (
    <tr
      className={`
        ${row.isHighlighted ? 'highlight-row' : ''}
        ${row.isMarkedForDeletion ? 'marked-for-deletion' : ''}
      `}
    >
      <td>{row.date}</td>
      <td>{row.assetName}</td>
      <td>{row.symbol}</td>
      <td>{row.assetType}</td>
      <td className="credit-column">{formatNumber(row.credit)}</td>
      <td className="debit-column">
        {row.debit !== 0 ? `(${formatNumber(row.debit)})` : formatNumber(row.debit)}
      </td>
      {row.totalBalanceBefore !== undefined && (
        <td>{formatNumber(row.totalBalanceBefore)}</td>
      )}
      {row.totalBalanceAfter !== undefined && (
        <td>{formatNumber(row.totalBalanceAfter)}</td>
      )}
      <td>{row.unit}</td>
      {row.actions && <td>{row.actions}</td>}
    </tr>
  );

  if (transactions.length === 0) {
    return (
      <div className="transaction-table-container">
        <div className="table-container">
          <div className="scrollable-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset Name</th>
                  <th>Symbol</th>
                  <th>Asset Type</th>
                  <th>Credit (Increase)</th>
                  <th>Debit (Decrease)</th>
                  <th>Total Balance Before</th>
                  <th>Total Balance After</th>
                  <th>Unit</th>
                  {onDeleteClick && <th>Delete All</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9 + (onDeleteClick ? 1 : 0)}>
                    <EmptyState
                      icon={<Icon icon={FaExchangeAlt} className="empty-state-icon" aria-hidden={true} />}
                      text="No Transactions Found"
                      subtext="Upload transactions or add new entries to start tracking your balance"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-table-container">
      <div className="table-wrapper">
        <table className="transaction-table">
          <colgroup>
            <col className="col-date" />
            <col className="col-asset-name" />
            <col className="col-symbol" />
            <col className="col-asset-type" />
            <col className="col-credit" />
            <col className="col-debit" />
            <col className="col-total-before" />
            <col className="col-total-after" />
            <col className="col-unit" />
            {onDeleteClick && <col className="col-delete" />}
          </colgroup>
          <thead>
            {renderHeader()}
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <React.Fragment key={index}>
                {renderRow(row)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;