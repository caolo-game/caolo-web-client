import { useSelector } from "react-redux";

export default function UserScriptList() {
  const scriptList = useSelector(
    (state) => state?.script?.userScriptList ?? []
  );

  return (
    <ul>
      {scriptList.map((x) => (
        <li>{x.name}</li>
      ))}
    </ul>
  );
}
