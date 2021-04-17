import styles from "./Card.module.css";
import { useDraggable } from "@dnd-kit/core";
import { CARD_PREFIX } from "./Scripting";
import { useDispatch } from "react-redux";

export function ProtoCard({ cardId, card }) {
  const { properties } = card;

  const { transform, listeners, attributes, setNodeRef } = useDraggable({
    id: `${CARD_PREFIX}${cardId}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : null;

  return (
    <div
      className={styles.card}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <CardHeader {...card} />
      {properties?.length ? (
        <TypeField label="properties:" typeList={properties} />
      ) : null}
    </div>
  );
}

export function Card({ cardId, card }) {
  const { properties } = card;

  const { transform, listeners, attributes, setNodeRef } = useDraggable({
    id: `${CARD_PREFIX}${cardId}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : null;

  return (
    <div
      className={styles.card}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <CardHeader {...card} />
      {properties?.length
        ? properties.map(({ ty, val }, i) => (
            <PropertyField
              ty={ty}
              val={val}
              propertyIndex={i}
              key={i}
              cardId={card.cardId}
            />
          ))
        : null}
    </div>
  );
}

/// this part is shared between card types
function CardHeader({ name, description, ty, inputs, outputs }) {
  return (
    <>
      <div>
        <b>{name}</b>
      </div>
      <div>ty: {ty}</div>
      <div>description: {description}</div>

      <div>
        {inputs?.length ? (
          <TypeField label="Inputs:" typeList={inputs} />
        ) : null}
        {outputs?.length ? (
          <TypeField label="Outputs:" typeList={outputs} />
        ) : null}
      </div>
    </>
  );
}

function TypeField({ label, typeList }) {
  return (
    <>
      {label}
      <ul>{typeList?.map((n, i) => <li key={i}>{n}</li>) ?? null}</ul>
    </>
  );
}

function PropertyField({ ty, val, cardId, propertyIndex }) {
  const dispatch = useDispatch();

  const fireAction = (val) => {
    dispatch({
      type: "SCRIPT.UPDATE_PROPERTY",
      cardId,
      propertyIndex,
      val,
    });
  };

  switch (ty) {
    case "Integer":
      return (
        <input
          type="number"
          step="1"
          onChange={(e) => fireAction(parseInt(e?.target?.value ?? "0"))}
          value={val ?? 0}
        />
      );
    case "Float":
      return (
        <input
          type="number"
          step="0.1"
          onChange={(e) => fireAction(parseFloat(e?.target?.value ?? "0"))}
          value={val ?? 0}
        />
      );
    case "Text":
    case "Variable":
      return (
        <div>
          <label>{ty}: </label>
          <input
            type="text"
            onChange={(e) => fireAction(e?.target?.value ?? "")}
            value={val ?? ""}
          />
        </div>
      );

    default:
      console.error("Unimplemented type", ty);
      return <div>Unimplemented type: {ty}</div>;
  }
}
