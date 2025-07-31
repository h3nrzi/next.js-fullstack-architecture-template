export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}
