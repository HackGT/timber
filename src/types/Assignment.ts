import { AssignmentStatus } from "./AssignmentStatus";
import { Project } from "./Project";
import { User } from "./User";

export type Assignment = {
  id: number;
  user: User;
  project: Project;
  priority: number;
  userId: number;
  projectId: number;
  status: AssignmentStatus;
};
