import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";

import { Button, Input } from "@/styles/UI_Elements";
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
    setNewItem("");
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
    // <div>HALLO</div>
    <div className="flex flex-col justify-center items-center">
      <Head>
        <title>Quarantine List</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* <div className="absolute top-0 left-0 bottom-0 right-0 bg-gray-200 -z-10"></div> */}
      <br />
      <div className="text-2xl font-GochiHand">Quarantine 🦠 List</div>
      <br />

      {items.map((item, index) => (
        <div className="flex gap-5 px-5" key={item.key}>
          <div onClick={() => deleteItem(item.key)}>🗑</div>
          <div className="break-all">
            {index + 1}. {item.name}
          </div>
        </div>
      ))}

      <form
        className="flex flex-col gap-2 mt-2"
        onSubmit={(e) => submitForm(e)}
        autoComplete="off"
      >
        <Input
          id="name"
          type="text"
          required
          placeholder="Just type...✏️"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button type="submit">Append</Button>
      </form>

      <a
        href="https://github.com/hannesschaletzky/quarantine_list"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="fixed bottom-5 left-5">
          <Image src="/github.png" alt="GitHub" width={40} height={40} />
        </div>
      </a>
    </div>
  );
};

export default Home;
