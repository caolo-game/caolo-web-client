import { useDispatch, useSelector } from "react-redux";
import { DndContext } from "@dnd-kit/core";
import { useEffect, useState } from "react";

import styles from "./Scripting.module.css";

import Lane from "./Lane";
import Compiler from "./Compiler";

export const LANE_PREFIX = "lane-id-";
export const CARD_PREFIX = "card-id-lane-";

export default function Scripting() {
  const schema = useSelector((state) => state?.script?.schema);
  const lanes = useSelector((state) => state?.script?.lanes ?? {});
  const cards = useSelector((state) => state?.script?.cards ?? {});
  const [ir, setIR] = useState(null);

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

  // On script data changes rebuild the CaoLangIR
  useEffect(() => {
    const ir = {
      lanes: Object.values(lanes).map(({ name, laneId }) => ({
        name,
        cards:
          getLaneCards({ schema, lanes, cards, laneId }).map(
            ({ name, ty, constants }) => {
              switch (ty) {
                case "Call":
                  return {
                    ty: "CallNative",
                    val: name,
                  };
                default:
                  return {
                    ty: name,
                    val: constants,
                  };
              }
            }
          ) ?? [],
      })),
    };
    setIR(ir);
  }, [lanes, cards, schema, setIR]);

  useEffect(() => {
    // init
    for (let i = 0; i < 3; ++i)
      dispatch({
        type: "SCRIPT.ADD_LANE",
        laneId: i,
      });
  }, [dispatch]);

  if (schema) {
    return (
      <div className={styles.container}>
        <div className={styles.compiler}>
          <Compiler caoLangIR={ir} />
        </div>
        <div className={styles.lane_container}>
          <DndContext onDragEnd={handleDragEnd}>
            <div className={styles.lane}>
              <Lane laneId="__schema" cards={schema} />
            </div>
            {Object.values(lanes).map(({ laneId, name }, i) => {
              const laneCards = getLaneCards({ schema, lanes, cards, laneId });
              return (
                <div className={styles.lane} key={i}>
                  <Lane laneId={laneId} cards={laneCards} name={name} />
                </div>
              );
            })}
          </DndContext>
        </div>
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
