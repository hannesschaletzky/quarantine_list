import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";

import styled, { css, Keyframes, keyframes } from "styled-components";

import {
  Button,
  Input,
  VirusLeft,
  VirusTop,
  VirusRight,
  VirusBottom,
} from "@/styles/UI_Elements";
import { FormEvent, useEffect, useState } from "react";

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

  useEffect(() => {
    getItems();
  }, []);

  const getRndPct = (min: number, max: number): string => {
    return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
  };

  enum Side {
    left,
    top,
    right,
    bottom,
  }

  const get = (
    side: Side,
    per: string,
    val: string = getRndPct(0, 95)
  ): string => {
    switch (side) {
      case Side.left:
        return `${per}% {
        top: ${val};
        left: 0;
      }`;
      case Side.top:
        return `${per}% {
        top: 0;
        left: ${val};
      }`;
      case Side.right:
        return `${per}% {
        top: ${val};
        left: 95%;
      }`;
      case Side.bottom:
        return `${per}% {
        top: 93%;
        left: ${val};
      }`;
    }
  };

  const moveInCircles = (side: Side, start: string) => {
    //start = getRndPct(0, 95);
    console.log(start);
    switch (side) {
      case Side.left:
        return keyframes`
        ${get(Side.left, "0", start)}
        ${get(Side.top, "25")}
        ${get(Side.right, "50")}
        ${get(Side.bottom, "75")}
        ${get(Side.left, "100", start)}
      `;
      case Side.top:
        return keyframes`
        ${get(Side.top, "0", start)}
        ${get(Side.right, "25")}
        ${get(Side.bottom, "50")}
        ${get(Side.left, "75")}
        ${get(Side.top, "100", start)}
      `;
      case Side.right:
        return keyframes`
        ${get(Side.right, "0", start)}
        ${get(Side.bottom, "25")}
        ${get(Side.left, "50")}
        ${get(Side.top, "75")}
        ${get(Side.right, "100", start)}
      `;
      case Side.bottom:
        return keyframes`
        ${get(Side.bottom, "0", start)}
        ${get(Side.left, "25")}
        ${get(Side.top, "50")}
        ${get(Side.right, "75")}
        ${get(Side.bottom, "100", start)}
      `;
    }
  };

  const rotate = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  const TEST = styled.div`
    background-color: red;
  `;

  interface Props {
    start: string;
    kf: Keyframes;
  }

  const Virus = styled.div<Props>`
    position: absolute;
    font-size: 45px;
    z-index: -1;
  `;

  const VirusTEST = styled(Virus)`
    animation: ${rotate} 2s linear infinite,
      ${({ kf }) => kf} 10s linear infinite;
  `;

  return (
    <div className="flex flex-col justify-start items-center h-full">
      {/* <div>TEST</div>
      <TEST>TEST1</TEST>

      <VirusTEST start={"25%"} kf={moveInCircles(Side.left, "20%")}>
        A
      </VirusTEST>
      <VirusTEST start={"25%"} kf={moveInCircles(Side.left, "40%")}>
        B
      </VirusTEST> */}

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
      <VirusLeft>🦠</VirusLeft>
      <VirusTop>🦠</VirusTop>
      <VirusRight>🦠</VirusRight>
      <VirusBottom>🦠</VirusBottom>

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
