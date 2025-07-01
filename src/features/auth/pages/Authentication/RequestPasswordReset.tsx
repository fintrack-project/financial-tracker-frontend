import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../services/authService';
import './AuthPages.css';

const RequestPasswordReset: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!identifier.trim()) {
        throw new Error('Please enter your email or user ID');
      }

      await requestPasswordReset(identifier);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>
        
        {success ? (
          <div className="success-message">
            <p>Password reset instructions have been sent to your email.</p>
            <p>Please check your inbox and follow the instructions to reset your password.</p>
            <button 
              className="primary-button mt-4" 
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <>
            <p className="auth-description">
              Enter your email address or user ID and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="identifier">Email or User ID</label>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or user ID"
                  required
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                type="submit" 
                className="primary-button" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            
            <div className="auth-links">
              <Link to="/login">Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestPasswordReset; 