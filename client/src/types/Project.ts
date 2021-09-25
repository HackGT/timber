import { Category } from "./Category";

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
  /*
    tableGroup: TableGroup?;
    hackathon: Hackathon?;
    members: User[];
    
    ballots: Ballot[];
    assignment: Assignment[];
    */
};
