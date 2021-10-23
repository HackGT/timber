import { Category } from "./Category";
import { User } from "./User";

export type CategoryGroup = {
  id: number;
  name: string;
  categories: Category[];
  users: User[];
};
