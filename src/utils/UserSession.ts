import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // User ID (subject)
  iat?: number; // Issued at
  exp?: number; // Expiration time
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
      return decoded.exp ? decoded.exp > currentTime : true; // Check if the token is expired
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return false;
    }
  }

  // Log out the current user
  public logout(): void {
    sessionStorage.removeItem('authToken'); // Remove the JWT from sessionStorage
    console.log('User logged out. JWT removed from sessionStorage.');
  }
}

export default UserSession;