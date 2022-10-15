import { Project } from "./Project";

export type TableGroup = {
  id: number;
  name: string;
  shortCode: string;
  color: string;
  hexathon: string;
  tableCapacity: number;
  projects: Project[];
};
