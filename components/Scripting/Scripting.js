import { useDispatch, useSelector } from "react-redux";
import { DndContext } from "@dnd-kit/core";
import Lane from "./Lane";
import styles from "./Scripting.module.css";
import { useEffect } from "react";

export const LANE_PREFIX = "lane-id-";
export const CARD_PREFIX = "card-id-lane-";

export default function Scripting() {
  const schema = useSelector((state) => state?.script?.schema);
  const lanes = useSelector((state) => state?.script?.lanes ?? {});
  const cards = useSelector((state) => state?.script?.cards ?? {});
  const dispatch = useDispatch();

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over?.id && active?.id) {
      const targetLaneId = over.id.substring(LANE_PREFIX.length);
      const [sourceLaneId, cardId] = active.id
        .substring(CARD_PREFIX.length)
        .split("-");
      if (sourceLaneId == "__schema" && sourceLaneId != targetLaneId) {
        // copy a schema card to the lane
        dispatch({
          type: "SCRIPT.ADD_CARD",
          cardId: Math.random().toString(36).substr(2, 12),
          schemaId: cardId,
          laneId: targetLaneId,
        });
      }
    }
  };


  useEffect(() => {
    // init
    dispatch({
      type: "SCRIPT.ADD_LANE",
      laneId: 0,
    });
  }, [dispatch]);

  if (schema) {
    return (
      <div className={styles.container}>
        <DndContext onDragEnd={handleDragEnd}>
          <div className={styles.lane}>
            <Lane laneId="__schema" cards={schema} />
          </div>
          {Object.values(lanes).map(({ laneId }, i) => {
            const laneCards = getLaneCards({ schema, lanes, cards, laneId });
            return (
              <div className={styles.lane} key={i}>
                <Lane laneId={laneId} cards={laneCards} />
              </div>
            );
          })}
        </DndContext>
      </div>
    );
  } else {
    return "no pogs :(";
  }
}

/**
 * @returns List of Card Props
 */
function getLaneCards({ schema, lanes, cards, laneId }) {
  const laneCards = lanes[laneId]?.cards
    ?.map((cId) => cards[cId]) // find our cards by the stored cardIds
    ?.map(({ cardId, schemaId, constants }) => ({
      // map the cardMetadata to card properties
      ...schema[schemaId],
      cardId,
      constants,
    }));

  return laneCards ?? [];
}
