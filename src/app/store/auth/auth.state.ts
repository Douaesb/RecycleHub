import { User } from "../../shared/models/auth.model";

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}