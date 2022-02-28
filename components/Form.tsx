import { useState, FormEvent } from "react";
import { Item } from "@/utils/_types";
import { Button, Input } from "@/styles/UI_Elements";
import { createItem } from "@/utils/repository";

const Form = (props: { listId: string; reload: () => void }) => {
  const [newItem, setNewItem] = useState("");

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const item: Item = {
      name: newItem,
      createdAt: new Date(),
      inCart: false,
      listId: props.listId,
    };
    createItem(item).then(() => {
      setNewItem("");
      props.reload();
    });
    return false;
  };

  return (
    <>
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
    </>
  );
};

export default Form;
