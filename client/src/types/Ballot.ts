import { User } from "./User";

export type Ballot = {
  id: number;
  user: User;
  score: number;
};
