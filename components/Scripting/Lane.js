import { ProtoCard, Card } from "./Card";
import styles from "./Lane.module.css";
import { useDroppable } from "@dnd-kit/core";
import { LANE_PREFIX } from "./Scripting";
import { useDispatch } from "react-redux";

function cardId(laneId, cardId) {
  return `${laneId}-${cardId}`;
}

export default function Lane({ laneId, cards, name, editable }) {
  const dispatch = useDispatch();
  const { isOver, setNodeRef } = useDroppable({
    id: `${LANE_PREFIX}${laneId}`,
  });

  const borderColor = isOver ? "lightgreen" : "red";

  return (
    <div className={styles.lane} ref={setNodeRef} style={{ borderColor }}>
      {editable ? (
        <div>
          <input
            type="text"
            value={name ?? ""}
            onChange={(e) =>
              dispatch({
                type: "SCRIPT.UPDATE_LANE_NAME",
                laneId,
                name: e?.target?.value,
              })
            }
          />

          <button
            onClick={() => dispatch({ type: "SCRIPT.REMOVE_LANE", laneId })}
          >
            Remove
          </button>
        </div>
      ) : (
        <div>{name}</div>
      )}
      <ul>
        {
          // note: yes this is duplicating some code, but this way we only perform this branch once.
          // does it count for something? no idea. is this premature optimization? no comment
          editable
            ? cards.map((c, i) => (
                <li key={i}>
                  <Card cardId={cardId(laneId, c.cardId)} card={c} />
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
