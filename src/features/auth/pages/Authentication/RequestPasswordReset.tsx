import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../services/authService';
import AuthBasePage from './AuthBasePage';
import './Login.css'; // Use login styles for consistency

const RequestPasswordReset: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      if (!identifier.trim()) {
        throw new Error('Please enter your email or user ID');
      }

      await requestPasswordReset(identifier);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your request';
      
      // Check if it's a "not found" error and show as warning instead
      if (errorMessage.toLowerCase().includes('no account found') || 
          errorMessage.toLowerCase().includes('not found')) {
        setWarning(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="login-container">
      {success ? (
        <div className="success-message">
          <p>Password reset instructions have been sent to your email.</p>
          <p>Please check your inbox and follow the instructions to reset your password.</p>
          <button 
            className="primary-button auth-btn mt-4" 
            onClick={() => navigate('/login')}
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div>
          <p className="auth-description">
            Enter your email address or user ID and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-fields">
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or user ID"
                required
              />
            </div>
            
            {/* Message container */}
            <div className="message-container">
              {error && (
                <div className="message login-error-message visible">
                  {error}
                </div>
              )}
              {warning && (
                <div className="message login-warning-message visible">
                  {warning}
                </div>
              )}
            </div>
            
            <div className="login-actions">
              <button 
                type="submit" 
                className="primary-button auth-btn" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
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

export default RequestPasswordReset; 