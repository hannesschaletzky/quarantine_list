export interface Item {
  key?: string; // set in database
  inCart: boolean;
  name: string;
  createdAt: Date;
  listId: string;
}
