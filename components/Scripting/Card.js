import styles from "./Card.module.css";
import { useDraggable } from "@dnd-kit/core";
import { CARD_PREFIX } from "./Scripting";

export default function CardProto({ cardId, card }) {
  const { name, description, ty, inputs, outputs, constants } = card;

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
      <div>
        <b>{name}</b>
      </div>
      <div>ty: {ty}</div>

      <div>
        {inputs?.length ? (
          <>
            Inputs:
            <ul>
              {inputs.map((n, i) => (
                <TypeField key={i} name={n} />
              ))}
            </ul>
          </>
        ) : null}
        {outputs?.length ? (
          <>
            Outputs:
            <ul>
              {outputs.map((n, i) => (
                <TypeField key={i} name={n} />
              ))}
            </ul>
          </>
        ) : null}
        {constants?.length ? (
          <>
            Constants:
            <ul>
              {constants.map((n, i) => (
                <TypeField key={i} name={n} />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function TypeField({ name }) {
  return <li>{name}</li>;
}
