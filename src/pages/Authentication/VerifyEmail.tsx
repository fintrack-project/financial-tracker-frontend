import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../services/authService'; // Backend service for email verification

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token)
        .then(() => {
          setStatus('Your email has been verified! You can now log in.');
          setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
        })
        .catch(() => {
          setStatus('Verification failed. The token may be invalid or expired.');
        });
    } else {
      setStatus('Invalid verification link.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="verify-email-container">
      <h1>Email Verification</h1>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmail;