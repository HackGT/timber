import { Category } from "./Category";

export type CategoryGroup = {
  id: number;
  name: string;
  hackathonId: number;
  categories: Category[];
};
