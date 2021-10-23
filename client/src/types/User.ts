import { Assignment } from "./Assignment";
import { Project } from "./Project";
import { UserRole } from "./UserRole";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  categoryGroupId: number;
  isJudging: boolean;
  projects: Project[];
  assignments: Assignment[];
};
