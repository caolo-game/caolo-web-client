import CardProto from "./Card";
import styles from "./Lane.module.css";
import { useDroppable } from "@dnd-kit/core";
import { LANE_PREFIX } from "./Scripting";

export default function Lane({ laneId, cards }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${LANE_PREFIX}${laneId}`,
  });

  return (
    <ul className={styles.lane} ref={setNodeRef}>
      {cards.map((c, i) => (
        <li key={i}>
          <CardProto cardId={`${laneId}-${i}`} card={c} />
        </li>
      ))}
    </ul>
  );
}
