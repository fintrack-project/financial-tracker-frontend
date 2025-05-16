import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Transaction } from '../types/Transaction';
import { OverviewTransaction } from '../types/OverviewTransaction';

// Required columns for validation
const REQUIRED_COLUMNS = [
  'date',
  'assetName',
  'assetType',
  'symbol',
  'credit',
  'debit',
];

// Generic function to parse CSV file
export const parseCSVFile = <T extends Transaction | OverviewTransaction>(
  file: File
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data.map((row: any) => ({
            date: row.date || '',
            assetName: row.assetName || '',
            assetType: row.assetType || '',
            symbol: row.symbol || '',
            credit: Number(row.credit || 0),
            debit: Number(row.debit || 0),
            ...(row.totalBalanceBefore !== undefined && {
              totalBalanceBefore: Number(row.totalBalanceBefore || 0),
            }),
            ...(row.totalBalanceAfter !== undefined && {
              totalBalanceAfter: Number(row.totalBalanceAfter || 0),
            }),
          }));
          resolve(parsedData as T[]);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
};

// Generic function to parse XLSX file
export const parseXLSXFile = <T extends Transaction | OverviewTransaction>(
  file: File
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
          date: row.date || '',
          assetName: row.assetName || '',
          assetType: row.assetType || '',
          symbol: row.symbol || '',
          credit: Number(row.credit || 0),
          debit: Number(row.debit || 0),
          ...(row.totalBalanceBefore !== undefined && {
            totalBalanceBefore: Number(row.totalBalanceBefore || 0),
          }),
          ...(row.totalBalanceAfter !== undefined && {
            totalBalanceAfter: Number(row.totalBalanceAfter || 0),
          }),
        }));
        resolve(parsedData as T[]);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Generic function to export data to CSV
export const exportToCSV = <T extends Transaction | OverviewTransaction>(
  data: T[],
  filename: string
) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generic function to export data to XLSX
export const exportToXLSX = <T extends Transaction | OverviewTransaction>(
  data: T[],
  filename: string
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Balance');
  XLSX.writeFile(workbook, filename);
};