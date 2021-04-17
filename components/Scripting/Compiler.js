import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CaoLangCompiler = dynamic({
  loader: async () => ({ caoLangIR }) => {
    const [caoLang, setCaoLang] = useState(null);
    useEffect(() => {
      (async () => {
        // force loading on the client so nextjs stops complaining...
        // see: https://github.com/asyncapi/asyncapi-react/issues/177
        const caoLang = await import("@caolo-game/cao-lang-wasm");
        setCaoLang(caoLang);
      })();
    });
    if (!caoLang || !caoLangIR) return null;
    try {
      const res = caoLang.compile(caoLangIR);
      switch (res.ty) {
        case "program":
          return (
            <div>
              poggies<pre>{JSON.stringify(res.val.bytecode)}</pre>
            </div>
          );
        default:
          console.error(res);
          return JSON.stringify(res, null, 4);
      }
    } catch (err) {
      return (
        <pre>
          {JSON.stringify(caoLangIR, null, 4)} Compilation failed to start:{" "}
          {err}
        </pre>
      );
    }
  },
});

export default CaoLangCompiler;
