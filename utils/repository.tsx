import { Item } from "@/utils/_types";

export const allItems = (listId: string) => {
  return new Promise<Item[]>(async (resolve) => {
    const resp = await fetch(`api/items?id=${listId}`);
    let items: Item[] = await resp.json();
    items.sort((a, b) => {
      const d1 = new Date(a.createdAt);
      const d2 = new Date(b.createdAt);
      return d1.getTime() - d2.getTime();
    });
    resolve(items);
  });
};

export const createItem = (item: Item) => {
  return new Promise<Response>(async (resolve) => {
    const resp = await fetch("api/items", {
      method: "post",
      body: JSON.stringify(item),
    });
    resolve(resp);
  });
};

export const deleteItem = (key: string) => {
  return new Promise<Response>(async (resolve) => {
    const resp = await fetch(`api/items/${key}`, { method: "delete" });
    resolve(resp);
  });
};

export const updateItem = (item: Item) => {
  return new Promise<Response>(async (resolve) => {
    const resp = await fetch("api/items", {
      method: "put",
      body: JSON.stringify(item),
    });
    resolve(resp);
  });
};
