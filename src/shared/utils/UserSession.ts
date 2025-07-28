import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // User ID (subject)
  iat?: number; // Issued at
  exp?: number; // Expiration time
  type?: string; // Token type (for refresh tokens)
}

class UserSession {
  private static instance: UserSession;

  private constructor() {}

  // Get the singleton instance
  public static getInstance(): UserSession {
    if (!UserSession.instance) {
      UserSession.instance = new UserSession();
    }
    return UserSession.instance;
  }

  // Get the current logged-in user ID from the JWT
  public getUserId(): string | null {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.sub; // Return the user ID from the JWT
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  // Check if a user is logged in
  public isLoggedIn(): boolean {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if the token is expired
      if (decoded.exp && decoded.exp <= currentTime) {
        // Token is expired, try to refresh
        this.refreshTokenIfNeeded();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return false;
    }
  }

  // Check if access token is expired
  public isTokenExpired(): boolean {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return true;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp ? decoded.exp <= currentTime : true;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return true;
    }
  }

  // Check if refresh token is expired
  public isRefreshTokenExpired(): boolean {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      return true;
    }

    try {
      const decoded: JwtPayload = jwtDecode(refreshToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp ? decoded.exp <= currentTime : true;
    } catch (error) {
      console.error('Failed to decode refresh JWT:', error);
      return true;
    }
  }

  // Attempt to refresh token if needed
  private async refreshTokenIfNeeded(): Promise<void> {
    if (this.isRefreshTokenExpired()) {
      // Refresh token is expired, user needs to login again
      this.logout();
      return;
    }

    // Try to refresh the access token
    const { refreshToken } = await import('../../features/auth/services/authService');
    const success = await refreshToken();
    
    if (!success) {
      this.logout();
    }
  }

  // Log out the current user
  public logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    console.log('User logged out. JWT removed from sessionStorage.');
  }
}

export default UserSession;