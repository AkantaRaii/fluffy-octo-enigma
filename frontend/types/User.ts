export interface User {
  id: number;
  email: string;
  role: string;
  phone: string;
  is_verified: boolean;
  department: number | null;
  department_name: string | null;
}
