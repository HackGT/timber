import { Project } from "./Project";

export type TableGroup = {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  hackathonId: number;
  tableCapacity:number;
  projects: Project[];
};
