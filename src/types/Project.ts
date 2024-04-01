import { Assignment } from "./Assignment";
import { Ballot } from "./Ballot";
import { Category } from "./Category";
import { User } from "./User";

export type Project = {
  id: number;
  name: string;
  description: string;
  devpostUrl: string;
  githubUrl: string;
  roomUrl: string;
  expo: number;
  round: number;
  table: number;
  categories: Category[];
  assignment: Assignment[];
  ballots: Ballot[];
  tableGroup: any;
  hexathon: string;
  members: User[];
};
