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
  /*
    tableGroup: TableGroup?;
    hackathon: Hackathon?;
    members: User[];
    categories: Category[];
    ballots: Ballot[];
    assignment: Assignment[];
    */
};
