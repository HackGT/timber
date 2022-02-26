import { Project } from "./Project";

export type TableGroup = {
  id: number;
  name: string;
  shortcode: string;
  color: string;
  hackathonId: number;
  projects: Project[];
};
