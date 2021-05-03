import { useSelector } from "react-redux";

export default function UserScriptList() {
  const scriptList = useSelector(
    (state) => state?.script?.userScriptList ?? []
  );

  return (
    <div>
      <b>Scripts</b>
      <ul>
        {scriptList.map((x) => (
          <li>{x.name}</li>
        ))}
      </ul>
    </div>
  );
}
