import { UserRole } from "./UserRole";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
