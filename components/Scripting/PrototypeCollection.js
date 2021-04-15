import { useSelector } from "react-redux";
import CardProto from "./Card";

export default function PrototypeCollection() {
  const schema = useSelector((state) => state?.script?.schema);
  if (schema) {
    return (
      <ul>
        {schema.map((c, i) => (
          <li key={i}>
            <CardProto card={c} />
          </li>
        ))}
      </ul>
    );
  } else {
    return "no pogs :(";
  }
}
