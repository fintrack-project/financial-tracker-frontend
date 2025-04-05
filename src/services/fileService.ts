import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface Transaction {
  date: string;
  assetName: string;
  credit: number;
  debit: number;
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  unit: string;
}

// Required columns for validation
const REQUIRED_COLUMNS = [
  'date',
  'assetName',
  'credit',
  'debit',
  'totalBalanceBefore',
  'totalBalanceAfter',
  'unit',
];

// Validate columns
const validateColumns = (columns: string[]): boolean => {
  return REQUIRED_COLUMNS.every((requiredColumn) => columns.includes(requiredColumn));
};

// Parse CSV file
export const parseCSVFile = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedTransactions = results.data.map((row: any) => ({
            date: row.date || '',
            assetName: row.assetName || '',
            credit: Number(row.credit || 0),
            debit: Number(row.debit || 0),
            totalBalanceBefore: Number(row.totalBalanceBefore || 0),
            totalBalanceAfter: Number(row.totalBalanceAfter || 0),
            unit: row.unit || '',
          }));
          resolve(parsedTransactions);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
};

// Parse XLSX file
export const parseXLSXFile = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedTransactions = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
          date: row.date || '',
          assetName: row.assetName || '',
          credit: Number(row.credit || 0),
          debit: Number(row.debit || 0),
          totalBalanceBefore: Number(row.totalBalanceBefore || 0),
          totalBalanceAfter: Number(row.totalBalanceAfter || 0),
          unit: row.unit || '',
        }));
        resolve(parsedTransactions);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Export data to CSV
export const exportToCSV = (data: Transaction[], filename: string) => {
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

// Export data to XLSX
export const exportToXLSX = (data: Transaction[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Balance');
  XLSX.writeFile(workbook, filename);
};