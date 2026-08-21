export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AppUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}
