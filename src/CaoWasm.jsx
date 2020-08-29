import { useState } from "react";

export var caoLang = null;
const caoLangImport = import("@caolo-game/cao-lang-wasm").then((cao) => (caoLang = cao));

export const useCaoLang = () => {
    const [cao, setCao] = useState(caoLang);
    const [err, setErr] = useState(null);
    caoLangImport
        .then((c) => setCao(c))
        .catch((e) => {
            console.error("Failed to load cao lang", e);
            setErr(e);
        });
    return [cao, err];
};

export var caoMath = null;
const caoMathImport = import("@caolo-game/cao-math")
    .then((cao) => {
        cao.init_error_handling();
        caoMath = cao;
        return cao;
    })
    .catch(console.error);

export const useCaoMath = () => {
    const [cao, setCao] = useState(caoMath);
    const [err, setErr] = useState(null);
    caoMathImport
        .then((c) => setCao(c))
        .catch((e) => {
            console.error("Failed to load cao math", e);
            setErr(e);
        });
    return [cao, err];
};
