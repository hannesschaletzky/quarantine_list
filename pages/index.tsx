import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, Input } from "@/styles/UI_Elements";
import { Virus, moveInCircles, rotateClockWise } from "@/styles/virus";

interface Item {
  key?: string; // set in database
  inCart: boolean;
  name: string;
  isCompleted: boolean;
  createdAt: Date;
}

const Home: NextPage = () => {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [Virus1, setVirus1] = useState<JSX.Element>();
  const [Virus2, setVirus2] = useState<JSX.Element>();
  const [Virus3, setVirus3] = useState<JSX.Element>();
  const [Virus4, setVirus4] = useState<JSX.Element>();
  const [Virus5, setVirus5] = useState<JSX.Element>();

  const getItems = async () => {
    const resp = await fetch("api/items");
    let items: Item[] = await resp.json();
    items.sort((a, b) => {
      const d1 = new Date(a.createdAt);
      const d2 = new Date(b.createdAt);
      return d1.getTime() - d2.getTime();
    });
    setItems(items);
    setLoading(false);
  };

  const createItem = async () => {
    setLoading(true);
    const item: Item = {
      name: newItem,
      isCompleted: false,
      createdAt: new Date(),
      inCart: false,
    };
    const resp = await fetch("api/items", {
      method: "post",
      body: JSON.stringify(item),
    });
    setNewItem("");
    await getItems();
  };

  const deleteItem = async (key: string) => {
    setLoading(true);
    fetch(`api/items/${key}`, { method: "delete" }).then(() => {
      getItems();
    });
  };

  const updateItem = async (item: Item) => {
    setLoading(true);
    const resp = await fetch("api/items", {
      method: "put",
      body: JSON.stringify(item),
    });
    await getItems();
  };

  const toggleCart = (item: Item) => {
    item.inCart = !item.inCart;
    updateItem(item);
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createItem();
    return false;
  };

  const spawnVirus = (
    remove: () => void,
    rotS: number,
    moveS: number,
    clockWise: boolean = true
  ) => {
    return (
      <Virus
        rotS={rotS}
        rotKF={rotateClockWise(clockWise)}
        moveS={moveS}
        moveKF={moveInCircles(clockWise)}
        onClick={() => remove()}
      >
        🦠
      </Virus>
    );
  };

  useEffect(() => {
    let virus: JSX.Element[] = [];

    setVirus1(spawnVirus(() => setVirus1(<div></div>), 3, 10));
    setVirus2(spawnVirus(() => setVirus2(<div></div>), 2, 8));
    setVirus3(spawnVirus(() => setVirus3(<div></div>), 3, 11, false));
    setVirus4(spawnVirus(() => setVirus4(<div></div>), 3.5, 12, false));
    setVirus5(spawnVirus(() => setVirus5(<div></div>), 4, 13));

    getItems();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center h-full overflow-x-hidden">
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

      {/* FLYING VIRUS */}
      {Virus1}
      {Virus2}
      {Virus3}
      {Virus4}
      {Virus5}

      {/* HEADER */}
      <br />
      <h2 className="text-2xl font-Marker">
        Quarantine{" "}
        {loading ? <span className="loader">🦠</span> : <span>🦠</span>} List
      </h2>
      <br />

      {/* ITEMS */}
      {items.length == 0 && !loading && (
        <div className="font-IndieFlower text-xl text-center">
          Add your stuff and I&apos;ll buy it. <br /> Cheers ❤️
        </div>
      )}
      {items.map((item, index) => (
        <div
          className="flex gap-5 px-5 font-IndieFlower text-xl"
          key={item.key}
        >
          <div onClick={() => deleteItem(item.key!)}>❌</div>
          <div className="break-all">
            {item.inCart && (
              <s>
                {index + 1}. {item.name}
              </s>
            )}
            {!item.inCart && (
              <div>
                {index + 1}. {item.name}
              </div>
            )}
          </div>
          <div className="" onClick={() => toggleCart(item)}>
            🛒
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
          <Image src="/github.png" alt="GitHub" width={25} height={25} />
        </a>
      </div>
      <br />
    </div>
  );
};

export default Home;
