import { Criteria } from "./Criteria";
import { Project } from "./Project";
import { User } from "./User";

export type Ballot = {
  id: number;
  user: User;
  score: number;
  criteriaId: number;
  criteria: Criteria;
  projectId: number;
  userId: number;
  project: Project;
};
