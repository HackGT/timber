import { Assignment } from "./Assignment";
import { Project } from "./Project";
import { CategoryGroup } from "./CategoryGroup";

export type User = {
  id: string;
  name: string;
  email: string;
  categoryGroupId: number;
  isJudging: boolean;
  isSponsor: boolean;
  projects: Project[];
  assignments: Assignment[];
  categoryGroup: CategoryGroup;
  roles: {
    admin: boolean;
    exec: boolean;
    member: boolean;
  };
};
