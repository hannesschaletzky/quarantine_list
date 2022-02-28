import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { Button, ShareButton } from "@/styles/UI_Elements";
import { useEffect, useRef, useState } from "react";
import { Virus, moveInCircles, rotateClockWise } from "@/styles/virus";

import Items from "@/components/List";
import Form from "@/components/Form";

import { Item } from "@/utils/_types";
import { allItems } from "@/utils/repository";

const createRandomID = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const Home: NextPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const refListId = useRef("");

  const [Virus1, setVirus1] = useState<JSX.Element>();
  const [Virus2, setVirus2] = useState<JSX.Element>();
  const [Virus3, setVirus3] = useState<JSX.Element>();
  const [Virus4, setVirus4] = useState<JSX.Element>();
  const [Virus5, setVirus5] = useState<JSX.Element>();

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

  const createList = () => {
    const id = createRandomID(4);
    console.log(`Creating list with ID: ${id}`);
    window.location.href = `?id=${id}`;
  };

  const readListId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id != null) {
      refListId.current = id;
    }
  };

  const loadItems = () => {
    setLoading(true);
    allItems(refListId.current).then((items) => {
      setItems(items);
      setLoading(false);
    });
  };

  const shareList = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Quarantine Shopping List",
          text: "Please buy me these things for my corona quarantine ❤️",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  useEffect(() => {
    // spawn virus
    setVirus1(spawnVirus(() => setVirus1(<div></div>), 3, 10));
    setVirus2(spawnVirus(() => setVirus2(<div></div>), 2, 8));
    setVirus3(spawnVirus(() => setVirus3(<div></div>), 3, 11, false));
    setVirus4(spawnVirus(() => setVirus4(<div></div>), 3.5, 12, false));
    setVirus5(spawnVirus(() => setVirus5(<div></div>), 4, 13));

    readListId();
    loadItems();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center h-full overflow-x-hidden">
      <Head>
        <title>Quarantine Shopping</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="Quarantine 🦠 Shopping"
          content="Let your friends know what they should buy for you ❤️"
        />
        <meta name="keywords" content="Corona, Quarantine, List, Buying, Fun" />
        <meta property="og:title" content="Quarantine 🦠 Shopping" />
        <meta
          property="og:description"
          content="Let your friends know what they should buy for you ❤️"
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
      <h2
        className="text-2xl font-Marker"
        onClick={() => (window.location.href = `/`)}
      >
        Quarantine{" "}
        {loading ? <span className="loader">🦠</span> : <span>🦠</span>}{" "}
        Shopping
      </h2>
      <br />

      {/* ITEMS && FORM */}
      {refListId.current != "" && (
        <>
          <Items items={items} reload={() => loadItems()} />
          <Form listId={refListId.current} reload={() => loadItems()} />
          <br />
          {items.length > 0 && navigator.share && (
            <div onClick={() => shareList()}>
              <ShareButton>Share</ShareButton>
            </div>
          )}
        </>
      )}

      {/* CREATE LIST */}
      {refListId.current == "" && (
        <div className="className=flex flex-col gap-2 mt-2 mx-24">
          <div className="font-IndieFlower text-xl text-center">
            Create a list and let your friends know what they need to buy for
            you. 🛒
          </div>
          <br />
          <Button onClick={() => createList()}>Create List</Button>
        </div>
      )}

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
