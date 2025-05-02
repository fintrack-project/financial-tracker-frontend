import React, { useEffect, useState } from 'react';
import { fetchUserDetails, UserDetails, fetchNotificationPreferences, NotificationPreferences } from '../../services/userService';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import './Notification.css'; // Add styles for the notification section

interface NotificationProps {
  accountId: string; // Account ID to fetch user details
}

const Notification: React.FC<NotificationProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
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
        setError('Failed to load notification details. Please try again later.');
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    const loadNotificationPreferences = async () => {
      try {
        setLoading(true);
        const preferences = await fetchNotificationPreferences(accountId);
        setNotificationPreferences(preferences);
        setError(null);
      } catch (err) {
        setError('Failed to load notification preferences. Please try again later.');
        setNotificationPreferences(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
    loadNotificationPreferences();
  }, [accountId]);

  if (loading) {
    return <p>Loading notification details...</p>;
  }

  if (error) {
    return <p className="notification-error">{error}</p>;
  }

  if (!userDetails) {
    return <p>No notification details available.</p>;
  }

  if (!notificationPreferences) {
    return <p>No notification preferences available.</p>;
  }
  
  const tableData = [
    {
      label: 'Notification Preferences',
      value: (
        <ul>
          <li>Email: {notificationPreferences.email ? 'Enabled' : 'Disabled'}</li>
          <li>SMS: {notificationPreferences.sms ? 'Enabled' : 'Disabled'}</li>
          <li>Push Notifications: {notificationPreferences.push ? 'Enabled' : 'Disabled'}</li>
        </ul>
      ),
    },
    { label: 'Timezone', value: userDetails.timezone || 'N/A' },
  ];

  return (
    <div className="notification">
      <h2>Notification Settings</h2>
      <ProfileTable data={tableData} />
    </div>
  );
};

export default Notification;