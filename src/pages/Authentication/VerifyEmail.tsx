import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../services/authService'; // Backend service for email verification
import FinTrackLogo from '../../assets/logo/FinTrackLogo.png'; // Import the FinTrack logo
import './VerifyEmail.css'; // Import the CSS file for styling

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
      <div className="verify-email-card">
        {/* Add the FinTrack logo */}
        <img src={FinTrackLogo} alt="FinTrack Logo" className="fintrack-logo" />
        <h1>Email Verification</h1>
        <p className={`status-message ${status.includes('failed') || status.includes('Invalid') ? 'error' : 'success'}`}>
          {status}
        </p>
        {status.includes('failed') || status.includes('Invalid') ? (
          <button className="retry-button" onClick={() => navigate('/register')}>
            Go Back to Register
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default VerifyEmail;