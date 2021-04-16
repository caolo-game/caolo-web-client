export interface ScriptState {
  schema: any[];
  cards: { [cardId: string]: Card };
  lanes: { [laneId: string]: Lane };
}

export interface Lane {
  laneId: LaneId;
  name?: String;
  cards: CardId[];
}

export interface Card {
  cardId: CardId;
  schemaId: number;
  constants: any[];
}

export type CardId = string;
export type LaneId = string;

export const initialScriptState: ScriptState = {
  lanes: {},
  cards: {},
  schema: [],
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
        name: "",
        cards: [],
      };
      return { ...state, lanes: { ...lanes } };
    }
    case "SCRIPT.ADD_CARD": {
      const { cardId, schemaId, constants, laneId } = action;
      if (!cardId) {
        return state;
      }

      const cards = state?.cards ?? {};
      cards[cardId] = {
        cardId: cardId,
        schemaId: parseInt(schemaId),
        constants: constants ?? [],
      };

      const lanes = state?.lanes ?? {};
      lanes[laneId]?.cards?.push(cardId);

      return { ...state, lanes: { ...lanes }, cards: { ...cards } };
    }
    case "SCRIPT.REMOVE_CARD": {
      const { cardId } = action;
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
    default:
      return state;
  }
};
