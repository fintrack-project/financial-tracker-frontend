import { useState, useEffect, useCallback } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { UserDetails } from '../types/UserDetails';

const useUserDetails = (accountId: string) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUserDetails(accountId);

      setUserDetails(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load user details:', err);
      setError('Failed to load user details. Please try again later.');
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadUserDetails();
  }, [loadUserDetails]);

  return { userDetails, setUserDetails, loading, error, refreshUserDetails: loadUserDetails };
};

export default useUserDetails;