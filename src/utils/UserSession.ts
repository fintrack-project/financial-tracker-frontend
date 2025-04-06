class UserSession {
  private static instance: UserSession;
  private userId: string | null = null;

  private constructor() {
    // Load userId from localStorage when the session is initialized
    this.userId = localStorage.getItem('userId');
  }

  // Get the singleton instance
  public static getInstance(): UserSession {
    if (!UserSession.instance) {
      UserSession.instance = new UserSession();
    }
    return UserSession.instance;
  }

  // Log in a user
  public login(userId: string): boolean {
    if (this.userId) {
      console.error('A user is already logged in.');
      return false; // Prevent multiple users from logging in
    }
    this.userId = userId;
    return true;
  }

  // Log out the current user
  public logout(): void {
    this.userId = null;
    localStorage.removeItem('userId'); // Remove from localStorage
  }

  // Get the current logged-in user ID
  public getUserId(): string | null {
    return this.userId;
  }

  // Set the user ID (e.g., after registration)
  public setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('userId', userId); // Save to localStorage
  }

  // Check if a user is logged in
  public isLoggedIn(): boolean {
    return this.userId !== null;
  }
}

export default UserSession;