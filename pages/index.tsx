import { Button, ShareButton } from "@/styles/UI_Elements";
import { Virus, moveInCircles, rotateClockWise } from "@/styles/virus";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import Form from "@/components/Form";
import Items from "@/components/List";

import { allItems } from "@/utils/repository";
import { Item } from "@/utils/types";

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

  const [Virus1, setVirus1] = useState<React.JSX.Element>();
  const [Virus2, setVirus2] = useState<React.JSX.Element>();
  const [Virus3, setVirus3] = useState<React.JSX.Element>();
  const [Virus4, setVirus4] = useState<React.JSX.Element>();
  const [Virus5, setVirus5] = useState<React.JSX.Element>();

  const spawnVirus = (
    remove: () => void,
    rotS: number,
    moveS: number,
    clockWise: boolean = true,
  ) => {
    return (
      <Virus
        $rotS={rotS}
        $rotKF={rotateClockWise(clockWise)}
        $moveS={moveS}
        $moveKF={moveInCircles(clockWise)}
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

      {/* SPACER: auf der Startseite Titel, Text und Button senkrecht mittig */}
      {refListId.current == "" && <div className="flex-1"></div>}

      {/* HEADER */}
      <br />
      <h2
        className={`font-Marker cursor-pointer text-center ${
          refListId.current == "" ? "text-3xl sm:text-4xl px-4" : "text-2xl"
        }`}
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
          {items.length > 0 && "share" in navigator && (
            <div onClick={() => shareList()}>
              <ShareButton>Share</ShareButton>
            </div>
          )}
        </>
      )}

      {/* CREATE LIST */}
      {refListId.current == "" && (
        <div className="flex flex-col items-center gap-8 mt-4 px-4 max-w-xs">
          <div className="font-IndieFlower text-xl text-center">
            Create a list and let your friends know what they need to buy for
            your quarantine 🛒 <br /> Also, shoot the virus to save the planet!!
            ❤️
          </div>
          <div className="w-fit">
            <Button
              onClick={() => createList()}
              style={{ fontSize: "18px", padding: "16px 32px" }}
            >
              Create List
            </Button>
          </div>
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
