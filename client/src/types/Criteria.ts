import { Ballot } from "./Ballot";

export type Criteria = {
  id: number;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  categoryId: number;
  ballots: Ballot[];
};
