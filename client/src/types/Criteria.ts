import { Ballot } from "./Ballot";

export type Criteria = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  ballots: Ballot[];
};
