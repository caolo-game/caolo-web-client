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
        return (caoMath = cao);
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

export function cardToCaoLang(cardStates) {
    const cardToCaoLang = (card) => {
        if (!cardStates[card.cardId]) {
            return null;
        }
        const { constants } = cardStates[card.cardId];
        switch (card.ty) {
            case "Function":
                return {
                    Call: card.name,
                };
            case "Instruction":
                const result = {};
                switch (card.name) {
                    case "Pass":
                    case "Add":
                    case "Sub":
                    case "Mul":
                    case "Div":
                    case "Exit":
                    case "CopyLast":
                    case "Less":
                    case "LessOrEq":
                    case "Equals":
                    case "NotEquals":
                    case "Pop":
                    case "ClearStack":
                        result[card.name] = null;
                        break;
                    case "ScalarInt":
                        // TODO:
                        // upgrade cao-lang and uncomment
                        // case "ScalarArray":
                        result[card.name] = Math.floor(Number(constants[0])) || 0;
                        break;
                    case "ScalarFloat":
                        result[card.name] = Number(constants[0]) || 0.0;
                        break;
                    case "StringLiteral":
                        result[card.name] = constants[0] || "";
                        break;
                    default:
                        console.warn(`Instruction ${card.name} is not implemented`);
                        return null;
                }
                return result;
            case "Branch": {
                const result = {};
                result[card.name] = constants[0];
                break;
            }
            default:
                console.warn(`${card.ty} is not implemented`);
                return null;
        }
    };

    return cardToCaoLang;
}
