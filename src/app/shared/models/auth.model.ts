export interface User {
    id?: string;
    email: string;
    fullName: string;
    address: string;
    phone: string;
    password: string;
    birthDate: string;
    photoUrl?: string;
    type: 'particulier' | 'collecteur';
    points?: number;
  }
  