import { Item } from "@/utils/_types";
import { deleteItem, updateItem } from "@/utils/repository";

const Items = (props: { items: Item[]; reload: () => void }) => {
  const deleteClick = (key: string) => {
    deleteItem(key).then(() => props.reload());
  };

  const toggleCart = (item: Item) => {
    item.inCart = !item.inCart;
    updateItem(item).then(() => props.reload());
  };

  return (
    <>
      {props.items.length == 0 && (
        <div className="font-IndieFlower text-xl text-center">
          Add your stuff ✏️
        </div>
      )}
      {props.items.map((item, index) => (
        <div
          className="flex gap-5 px-5 font-IndieFlower text-xl"
          key={item.key}
        >
          <div onClick={() => deleteClick(item.key!)}>❌</div>
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
    </>
  );
};

export default Items;
