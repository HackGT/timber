import { Project } from "./Project";
import { Criteria } from "./Criteria";
import { CategoryGroup } from "./CategoryGroup";

export type Category = {
  id: number;
  name: string;
  isDefault: boolean;
  description: string;
  hexathon: string;
  projects: Project[];
  criterias: Criteria[];
  categoryGroups: CategoryGroup[];
};
