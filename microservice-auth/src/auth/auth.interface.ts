export interface AuthInterface {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  password: string;
  profession: string;
  email: string;
  isEmailVerified: boolean;
  refUrl: string;
  avatar: string;
  telegram: string;
  balance: number;
  role: string;
  subUserId: number;
}
