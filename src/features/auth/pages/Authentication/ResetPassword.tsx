import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { validateResetToken, resetPassword } from '../../services/authService';
import AuthBasePage from './AuthBasePage';
import './Login.css'; // Use login styles for consistency

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query parameters
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token');
        setValidatingToken(false);
        return;
      }

      try {
        const isValid = await validateResetToken(token);
        setValidToken(isValid);
      } catch (err) {
        setError('The reset link is invalid or has expired');
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!newPassword.trim() || !confirmPassword.trim()) {
        throw new Error('Please fill in all fields');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Make sure we have a token
      if (!token) {
        throw new Error('Invalid or missing reset token');
      }

      // Call the resetPassword service
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    const loadingContent = (
      <div className="login-container">
        <div className="loading-content">
          <p className="auth-description">Validating your reset link...</p>
        </div>
      </div>
    );

    return (
      <AuthBasePage title="Reset Password">
        {loadingContent}
      </AuthBasePage>
    );
  }

  if (!validToken && !validatingToken) {
    const invalidTokenContent = (
      <div className="login-container">
        <div className="error-content">
          <p className="auth-description">
            {error || 'The password reset link is invalid or has expired.'}
          </p>
          <div className="login-actions">
            <Link to="/request-password-reset" className="login-button">
              Request a new reset link
            </Link>
          </div>
          <div className="auth-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    );

    return (
      <AuthBasePage title="Invalid Reset Link">
        {invalidTokenContent}
      </AuthBasePage>
    );
  }

  const content = (
    <div className="login-container">
      {success ? (
        <div className="success-message">
          <p>Your password has been reset successfully.</p>
          <button 
            className="primary-button auth-btn mt-4" 
            onClick={() => navigate('/login')}
          >
            Proceed to Login
          </button>
        </div>
      ) : (
        <div>
          <p className="auth-description">
            Please enter your new password below.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-fields">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>
            
            {/* Error message container */}
            <div className="message-container">
              {error && (
                <div className="message login-error-message visible">
                  {error}
                </div>
              )}
            </div>
            
            <div className="login-actions">
              <button 
                type="submit" 
                className="primary-button auth-btn" 
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
          <div className="login-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AuthBasePage title="Reset Password">
      {content}
    </AuthBasePage>
  );
};

export default ResetPassword; 