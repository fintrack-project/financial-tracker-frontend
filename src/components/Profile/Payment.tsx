import React, { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { UserDetails } from '../../types/UserDetails';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import './Payment.css'; // Add styles for the payment section

interface PaymentProps {
  accountId: string; // Account ID to fetch user details
}

const Payment: React.FC<PaymentProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDetails(accountId); // Use the service to fetch user details
        setUserDetails(data);
        setError(null);
      } catch (err) {
        setError('Failed to load payment details. Please try again later.');
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [accountId]);

  if (loading) {
    return <p>Loading payment details...</p>;
  }

  if (error) {
    return <p className="payment-error">{error}</p>;
  }

  if (!userDetails) {
    return <p>No payment details available.</p>;
  }

  const tableData = [
    { label: 'Payment Method', value: userDetails.paymentMethod || 'N/A' },
    { label: 'Billing Address', value: userDetails.billingAddress || 'N/A' },
    { label: 'Last Payment Date', value: userDetails.lastPaymentDate || 'N/A' },
    { label: 'Next Billing Date', value: userDetails.nextBillingDate || 'N/A' },
    { label: 'Payment Status', value: userDetails.paymentStatus || 'N/A' },
    { label: 'Subscription Start Date', value: userDetails.subscriptionStartDate || 'N/A' },
    { label: 'Subscription End Date', value: userDetails.subscriptionEndDate || 'N/A' },
    { label: 'Active Subscription', value: userDetails.isActiveSubscription ? 'Yes' : 'No' },
  ];

  return (
    <div className="payment">
      <h2>Payment Details</h2>
      <ProfileTable data={tableData} />
    </div>
  );
};

export default Payment;