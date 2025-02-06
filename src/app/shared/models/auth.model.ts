export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  phone: string;
  dateOfBirth: string;
  profileImage?: string;
  role: 'collecteur' | 'particulier';
  points: number;
}