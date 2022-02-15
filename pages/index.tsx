import type { NextPage } from "next";
import Head from "next/head";

import { Button } from "@/styles/UI_Elements";
import { FormEvent, useEffect, useState } from "react";

interface Item {
  key: string;
  name: string;
  isCompleted: boolean;
}

const Home: NextPage = () => {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const getItems = async () => {
    const resp = await fetch("api/items");
    const items: Item[] = await resp.json();
    setItems(items);
  };

  const createItem = async () => {
    const resp = await fetch("api/items", {
      method: "post",
      body: JSON.stringify({ name: newItem }),
    });
    await getItems();
  };

  const deleteItem = async (id: string) => {
    const resp = fetch(`api/items/${id}`, { method: "delete" });
    setTimeout(getItems, 200);
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createItem();
    return false;
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      <Head>
        <title>Quarantine List</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* <div className="bg-gray-100">I want following things:</div> */}

      <h3>Add Task</h3>

      <form onSubmit={(e) => submitForm(e)}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>

      <br />
      <div>
        {items.map((item, index) => (
          <div className="flex gap-5" key={item.key}>
            {index + 1}. {item.name}
            <div onClick={() => deleteItem(item.key)}>Delete</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
