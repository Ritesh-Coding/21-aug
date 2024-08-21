
export interface AuthState {
    user: { username: string } | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated : boolean | null;
    role : string | null;
    userId : number | null;
    firstName : string | null;
    lastName: string | null;
    navTitle : string | null;
    profile : string | undefined;
  }
  
  export interface RootState {
    auth: AuthState;
  }
  