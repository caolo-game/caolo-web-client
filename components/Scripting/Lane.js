import CardProto from "./Card";
import styles from "./Lane.module.css";
import { useDroppable } from "@dnd-kit/core";
import { LANE_PREFIX } from "./Scripting";

export default function Lane({ laneId, cards, name }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${LANE_PREFIX}${laneId}`,
  });

  const borderColor = isOver ? "lightgreen" : "red";

  return (
    <div className={styles.lane} ref={setNodeRef} style={{ borderColor }}>
      <div>{name}</div>
      <ul>
        {cards.map((c, i) => (
          <li key={i}>
            <CardProto cardId={`${laneId}-${i}`} card={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}
