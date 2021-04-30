import { DndContext } from "@dnd-kit/core";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Compiler from "./Compiler";
import Lane from "./Lane";
import styles from "./Scripting.module.css";

import { getLaneCards } from "../../store/script";

export const LANE_PREFIX = "lane-id-";
export const CARD_PREFIX = "card-id-";

const dragEndHandler = (dispatch) => (event) => {
  const { over, active } = event;
  const [sourceLaneId, cardId] = active.id
    .substring(CARD_PREFIX.length)
    .split("-");
  if (over?.id) {
    const targetLaneId = over.id.substring(LANE_PREFIX.length);
    if (sourceLaneId != targetLaneId) {
      // card was moved
      if (sourceLaneId == "__schema") {
        // copy a schema card to the lane
        dispatch({
          type: "SCRIPT.ADD_CARD",
          cardId: "card#".concat(Math.random().toString(36).substr(2, 12)),
          schemaId: cardId,
          laneId: targetLaneId,
        });
      } else {
        dispatch({
          type: "SCRIPT.MOVE_CARD",
          cardId,
          fromLane: sourceLaneId,
          toLane: targetLaneId,
        });
      }
    }
  } else {
    dispatch({
      type: "SCRIPT.REMOVE_CARD",
      cardId,
    });
  }
};

export default function Scripting() {
  const { schema, lanes, cards, ir } = useSelector(
    (state) => state?.script ?? {}
  );

  const dispatch = useDispatch();
  const onDragEnd = useCallback(dragEndHandler(dispatch));

  useEffect(() => {
    // init
    dispatch({
      type: "SCRIPT.ADD_LANE",
      laneId: "lane#main",
    });
  }, [dispatch]);

  if (schema) {
    return (
      <div className={styles.container}>
        <div className={styles.compiler}>
          <Compiler caoLangIR={ir} />
        </div>
        <div className={styles.lane_container}>
          <DndContext onDragEnd={onDragEnd}>
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
          <div className={styles.lane}>
            <button
              onClick={() =>
                dispatch({
                  type: "SCRIPT.ADD_LANE",
                  laneId: "lane#".concat(
                    Math.random().toString(36).substr(2, 12)
                  ),
                })
              }
            >
              Add lane
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return "Failed to load schema!";
  }
}
