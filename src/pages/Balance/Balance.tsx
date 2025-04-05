import React, { useState } from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import AddAssetForm from 'components/AddAssetForm/AddAssetForm';
import './Balance.css';

interface Asset {
  name: string;
  amount: number;
  unit: string;
  reason?: string;
}

const Balance: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  const handleAddAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
  };

  const handleBulkAddAssets = (bulkAssets: Asset[]) => {
    setAssets([...assets, ...bulkAssets]);
  };

  return (
    <div className="balance-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Balance</h1>
      <div className="content">
      </div>
    </div>
  );
};

export default Balance;