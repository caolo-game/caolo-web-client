import { ProtoCard, Card } from "./Card";
import styles from "./Lane.module.css";
import { useDroppable } from "@dnd-kit/core";
import { LANE_PREFIX } from "./Scripting";

function cardId(laneId, cardId) {
  return `${laneId}-${cardId}`;
}

export default function Lane({ laneId, cards, name, editable }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${LANE_PREFIX}${laneId}`,
  });

  const borderColor = isOver ? "lightgreen" : "red";

  return (
    <div className={styles.lane} ref={setNodeRef} style={{ borderColor }}>
      <div>{name}</div>
      <ul>
        {
          // note: yes this is duplicating some code, but this way we only perform this branch once.
          // does it count for something? no idea. is this premature optimization? no comment
          editable
            ? cards.map((c, i) => (
                <li key={i}>
                  <Card cardId={cardId(laneId, i)} card={c} />
                </li>
              ))
            : cards.map((c, i) => (
                <li key={i}>
                  <ProtoCard cardId={cardId(laneId, i)} card={c} />
                </li>
              ))
        }
      </ul>
    </div>
  );
}
