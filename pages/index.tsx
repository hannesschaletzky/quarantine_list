import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";

import { Button, Input } from "@/styles/UI_Elements";
import { FormEvent, useEffect, useState } from "react";

interface Item {
  key?: string; // set in database
  name: string;
  isCompleted: boolean;
  createdAt: Date;
}

const Home: NextPage = () => {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const getItems = async () => {
    const resp = await fetch("api/items");
    let items: Item[] = await resp.json();
    items.sort((a, b) => {
      const d1 = new Date(a.createdAt);
      const d2 = new Date(b.createdAt);
      return d1.getTime() - d2.getTime();
    });
    setItems(items);
  };

  const createItem = async () => {
    const item: Item = {
      name: newItem,
      isCompleted: false,
      createdAt: new Date(),
    };
    const resp = await fetch("api/items", {
      method: "post",
      body: JSON.stringify(item),
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
    <div className="flex flex-col justify-start items-center h-full">
      <Head>
        <title>Quarantine List</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="Quarantine 🦠 List"
          content="Add your stuff and I'll buy it. Cheers ❤️"
        />
        <meta name="keywords" content="Corona, Quarantine, List, Buying, Fun" />
        <meta property="og:title" content="Quarantine 🦠 List" />
        <meta
          property="og:description"
          content="Add your stuff and I'll buy it. Cheers ❤️"
        />
        <meta property="og:type" content="website" />
      </Head>

      {/* HEADER */}
      <br />
      <h2 className="text-2xl font-Marker">Quarantine 🦠 List</h2>
      <br />

      {/* ITEMS */}
      {items.map((item, index) => (
        <div
          className="flex gap-5 px-5 font-IndieFlower text-xl"
          key={item.key}
        >
          <div onClick={() => deleteItem(item.key!)}>🗑</div>
          <div className="break-all">
            {index + 1}. {item.name}
          </div>
        </div>
      ))}

      {/* FORM */}
      <form
        className="flex flex-col gap-2 mt-2"
        onSubmit={(e) => submitForm(e)}
        autoComplete="off"
      >
        <Input
          id="name"
          type="text"
          required
          placeholder="Item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
      <br />

      {/* SPACER */}
      <div className="flex-1"></div>

      {/* FOOTER */}
      <div className="flex gap-3 items-center">
        <div className="text-sm font-Marker">
          Made with ❤️ (and 🦠) by{" "}
          <a
            href="https://www.hschaletzky.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hannes
          </a>
        </div>
        <a
          href="https://github.com/hannesschaletzky/quarantine_list"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="">
            <Image src="/github.png" alt="GitHub" width={25} height={25} />
          </div>
        </a>
      </div>

      <br />
    </div>
  );
};

export default Home;
