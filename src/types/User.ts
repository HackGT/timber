import { Assignment } from "./Assignment";
import { Project } from "./Project";
import { CategoryGroup } from "./CategoryGroup";

export type User = {
  id: string;
  name: string;
  email: string;
  isJudging: boolean;
  isSponsor: boolean;
  projects: Project[];
  assignments: Assignment[];
  categoryGroups: CategoryGroup[];
  roles: {
    admin: boolean;
    exec: boolean;
    member: boolean;
  };
};
