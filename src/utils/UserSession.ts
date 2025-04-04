class UserSession {
  private static instance: UserSession;
  private userId: string | null = null;

  private constructor() {}

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
  }

  // Get the current logged-in user ID
  public getUserId(): string | null {
    return this.userId;
  }

  // Check if a user is logged in
  public isLoggedIn(): boolean {
    return this.userId !== null;
  }
}

export default UserSession;