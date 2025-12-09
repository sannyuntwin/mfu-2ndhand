import { User } from './user';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => Promise<void>;
  loading: boolean;
}