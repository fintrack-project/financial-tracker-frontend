import React, { useState } from 'react';
import Papa from 'papaparse'; // For CSV parsing
import * as XLSX from 'xlsx'; // For XLSX parsing
import './AddAssetForm.css';

interface AddAssetFormProps {
  onAddAsset: (asset: {
    name: string;
    amount: number;
    unit: string;
    reason?: string;
  }) => void;
  onBulkAddAssets: (assets: {
    name: string;
    amount: number;
    unit: string;
    reason?: string;
  }[]) => void;
}

const AddAssetForm: React.FC<AddAssetFormProps> = ({ onAddAsset, onBulkAddAssets }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !unit) {
      alert('Please fill in all required fields.');
      return;
    }
    onAddAsset({ name, amount: Number(amount), unit, reason });
    setName('');
    setAmount('');
    setUnit('');
    setReason('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedAssets = results.data.map((row: any) => ({
            name: row.name,
            amount: Number(row.amount),
            unit: row.unit,
            reason: row.reason || '',
          }));
          onBulkAddAssets(parsedAssets);
        },
      });
    } else if (fileExtension === 'xlsx') {
      // Parse XLSX file
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedAssets = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
          name: row.name,
          amount: Number(row.amount),
          unit: row.unit,
          reason: row.reason || '',
        }));
        onBulkAddAssets(parsedAssets);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file format. Please upload a CSV or XLSX file.');
    }
  };

  return (
    <div className="add-asset-form">
      <form onSubmit={handleSubmit}>
        <h2>Add Asset (Manual)</h2>
        <div>
          <label>Asset Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Unit:</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reason (Optional):</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <button type="submit">Add Asset</button>
      </form>

      <div className="file-upload">
        <h2>Upload CSV/XLSX</h2>
        <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />
      </div>
    </div>
  );
};

export default AddAssetForm;