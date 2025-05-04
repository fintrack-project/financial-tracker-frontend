import { useState, useEffect } from 'react';
import { fetchUserDetails } from '../services/userService';
import { UserDetails } from '../types/UserDetails';

const useUserDetails = (accountId: string) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDetails(accountId);

        console.log('Fetched user details:', data);

        setUserDetails(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load user details:', err);
        setError('Failed to load user details. Please try again later.');
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [accountId]);

  return { userDetails, setUserDetails, loading, error };
};

export default useUserDetails;