import React, { useState } from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import AddAssetForm from 'components/AddAssetForm/AddAssetForm';
import HoldingsTable from 'components/HoldingsTable/HoldingsTable';
import './AssetManagement.css'; // Import the CSS file

interface Asset {
  name: string;
  amount: number;
  unit: string;
  reason?: string;
}

const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  const handleAddAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
  };

  const handleBulkAddAssets = (bulkAssets: Asset[]) => {
    setAssets([...assets, ...bulkAssets]);
  };

  return (
    <div className="asset-management-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Asset Management</h1>
      <div className="content">
        <div className="left-section"> 
          <h2>Holdings</h2>
          <HoldingsTable />
        </div>
        <div className="right-section">
          <h2>Assets</h2>
          <AddAssetForm onAddAsset={handleAddAsset} onBulkAddAssets={handleBulkAddAssets} />
        </div>
      </div>
    </div>
  );
};

export default AssetManagement;