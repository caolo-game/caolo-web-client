export interface ScriptState {
  schema: CardPrototype[];
  cards: { [cardId: string]: Card };
  lanes: { [laneId: string]: Lane };
  /// intermediate representation, accepted by Cao-Lang
  ir?: CaoLangIR | null;
}

export interface Lane {
  laneId: LaneId;
  name?: String | null;
  cards: CardId[];
}

export interface Card {
  cardId: CardId;
  schemaId: SchemaId;
  constants: any;
}

export interface CardPrototype {
  name: string;
  description: string;
  inputs: CaoLangTypename[];
  outputs: CaoLangTypename[];
  constants: CaoLangTypename[];
}

export interface CaoLangIR {
  lanes: {
    name?: string;
    cards: {
      ty: string;
      val?: any;
    }[];
  };
}

export type SchemaId = number;
export type CaoLangTypename = string;
export type CardId = string;
export type LaneId = string;

export const initialScriptState: ScriptState = {
  lanes: {},
  cards: {},
  schema: [],
  ir: null,
};

export const scriptReducer = (
  state: ScriptState = initialScriptState,
  action: { type: String } | any
) => {
  switch (action.type) {
    case "SCRIPT.SET_SCHEMA":
      return { ...state, schema: action.schema };
    case "SCRIPT.REMOVE_LANE": {
      const lanes = state?.lanes ?? {};
      delete lanes[action.laneId];
      return { ...state, lanes: { ...lanes } };
    }
    case "SCRIPT.ADD_LANE": {
      const lanes = state?.lanes ?? {};
      lanes[action.laneId] = {
        laneId: action.laneId,
        name: null,
        cards: [],
      };
      return { ...state, lanes: { ...lanes } };
    }
    case "SCRIPT.ADD_CARD": {
      return addCard(state, action);
    }
    case "SCRIPT.REMOVE_CARD": {
      return removeCard(state, action);
    }
    default:
      return state;
  }
};

function removeCard(
  state: ScriptState,
  { cardId }: { cardId: string | CardId }
): ScriptState {
  if (!cardId) {
    return state;
  }

  const cards = state?.cards ?? {};
  delete cards[cardId];
  const lanes = state?.lanes ?? {};
  for (let lane of Object.values(lanes)) {
    const ind = lane.cards?.findIndex((c) => c == cardId);
    if (ind >= 0) lane.cards?.splice(ind, 1);
  }
  return { ...state, lanes: { ...lanes }, cards: { ...cards } };
}

function addCard(
  state: ScriptState,
  {
    cardId,
    schemaId,
    constants,
    laneId,
  }: {
    cardId: CardId;
    schemaId: SchemaId | string;
    constants?: any[];
    laneId: LaneId;
  }
): ScriptState {
  if (!cardId) {
    return state;
  }

  const cards = state?.cards ?? {};
  cards[cardId] = {
    cardId: cardId,
    schemaId: typeof schemaId === "string" ? parseInt(schemaId) : schemaId,
    constants: null,
  };

  const lanes = state?.lanes ?? {};
  lanes[laneId]?.cards?.push(cardId);

  return { ...state, lanes: { ...lanes }, cards: { ...cards } };
}
