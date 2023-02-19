import { Category } from "./Category";

export type CategoryGroup = {
  id: number;
  name: string;
  hexathon: string;
  categories: Category[];
};
