export interface AuthState {
    user: { email: string; fullName: string | null } | null;
    loading: boolean;
    error: string | null;
    message: string | null;
  }
  
  export const initialAuthState: AuthState = {
    user: null,
    loading: false,
    error: null,
    message: null
  };
  