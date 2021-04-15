export default function CardProto({card}) {
  const { name, description, ty, inputs, outputs, constants } = card;
  return (
    <div>
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
