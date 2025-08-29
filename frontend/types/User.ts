export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  is_verified: boolean;
  department: number | null;
  department_name: string | null;
}
