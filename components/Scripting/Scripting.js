import { DndContext } from "@dnd-kit/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Compiler from "./Compiler";
import Lane from "./Lane";
import styles from "./Scripting.module.css";

import { getLaneCards } from "../../store/script";

export const LANE_PREFIX = "lane-id-";
export const CARD_PREFIX = "card-id-lane-";

export default function Scripting() {
  const schema = useSelector((state) => state?.script?.schema);
  const lanes = useSelector((state) => state?.script?.lanes ?? {});
  const cards = useSelector((state) => state?.script?.cards ?? {});
  const ir = useSelector((state) => state?.script?.ir);

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
                  <Lane
                    editable={true}
                    laneId={laneId}
                    cards={laneCards}
                    name={name}
                  />
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
