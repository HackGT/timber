import { Project } from "./Project";
import { Criteria } from "./Criteria";

export type Category = {
  id: number;
  name: string;
  isDefault: boolean;
  description: string;
  hackathonId: number;
  projects: Project[];
  criterias: Criteria[];
};
