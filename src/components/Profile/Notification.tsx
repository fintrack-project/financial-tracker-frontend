import React, { useEffect, useState } from 'react';
import { fetchUserDetails, UserDetails  } from '../../services/userService';
import { fetchNotificationPreferences, updateNotificationPreference } from '../../services/userNotificationPrefService';
import { NotificationPreferences } from '../../types/NotificationPreferences';
import NotificationToggle from '../Toggle/NotificationToggle'; // Import the toggle component
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

  const handleToggle = async (type: keyof NotificationPreferences) => {
    if (!notificationPreferences) return;

    const newState = !notificationPreferences[type];

    // Update the local state for immediate feedback
    setNotificationPreferences((prev) => ({
      ...prev!,
      [type]: newState,
    }));

    try {
      // Call the backend API to persist the toggle state
      await updateNotificationPreference(accountId, type.toUpperCase(), newState);
      console.log(`Successfully updated ${type} to ${newState}`);
    } catch (err) {
      console.error(`Failed to update ${type}:`, err);
      setError(`Failed to update ${type}. Please try again.`);
      // Revert the state if the update fails
      setNotificationPreferences((prev) => ({
        ...prev!,
        [type]: !newState,
      }));
    }
  };

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

  return (
    <div className="notification">
      <h2>Notification Settings</h2>
      <div className="notification-preferences">
        <NotificationToggle
          label="Email"
          isEnabled={notificationPreferences.email}
          onToggle={() => handleToggle('email')}
        />
        <NotificationToggle
          label="SMS"
          isEnabled={notificationPreferences.sms}
          onToggle={() => handleToggle('sms')}
        />
        <NotificationToggle
          label="Push Notifications"
          isEnabled={notificationPreferences.push}
          onToggle={() => handleToggle('push')}
        />
      </div>
    </div>
  );
};

export default Notification;