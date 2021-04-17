export const initialScriptState = {
  lanes: {},
  cards: {},
  schema: [],
  ir: null,
};

export function getLaneCards({ schema, lanes, cards, laneId }) {
  const laneCards = lanes[laneId]?.cards
    ?.map((cId) => cards[cId]) // find our cards by the stored cardIds
    ?.map(({ cardId, schemaId, properties }) => ({
      // map the cardMetadata to card properties
      ...schema[schemaId],
      cardId,
      properties,
    }));

  return laneCards ?? [];
}

/**
 * Whenever script state is updated calculate the new CaoLang IR
 */
export const caoIrMiddleWare = (store) => (next) => (action) => {
  let result = next(action);
  const state = store.getState();
  const dispatch = store.dispatch;

  const [actionTyPrefix, actionTy] = action.type.split(".");
  if (actionTyPrefix == "SCRIPT" && actionTy != "SET_IR") {
    const { schema, lanes, cards } = state.script;
    const ir = {
      lanes: Object.values(lanes).map(({ name, laneId }) => ({
        name,
        cards:
          getLaneCards({ schema, lanes, cards, laneId }).map(
            ({ name, ty, properties }) => {
              switch (ty) {
                case "Call":
                  return {
                    ty: "CallNative",
                    val: name,
                  };
                default:
                  return {
                    ty: name,
                    val: transformProperties(name, properties),
                  };
              }
            }
          ) ?? [],
      })),
    };
    dispatch({ type: "SCRIPT.SET_IR", ir });
  }

  return result;
};

function transformProperties(name, properties) {
  if (properties?.length == 1) return properties[0].val;
  switch (name) {
    default:
      return properties;
  }
}

export const scriptReducer = (state = initialScriptState, action) => {
  switch (action.type) {
    case "SCRIPT.SET_IR":
      return { ...state, ir: action.ir };
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
    case "SCRIPT.UPDATE_PROPERTY":
      const { cardId, propertyIndex, val } = action;
      const cards = state.cards;
      cards[cardId].properties[propertyIndex].val = val;
      return {
        ...state,
        cards: { ...cards },
      };
    default:
      return state;
  }
};

function removeCard(state, { cardId }) {
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

function addCard(state, { cardId, schemaId, properties, laneId }) {
  if (!cardId) {
    return state;
  }

  if (!properties) {
    properties = state?.schema[schemaId]?.properties;
  }

  const cards = state?.cards ?? {};
  cards[cardId] = {
    cardId: cardId,
    schemaId: typeof schemaId === "string" ? parseInt(schemaId) : schemaId,
    properties: properties?.map((ty) => ({ ty, val: null })) ?? [],
  };

  const lanes = state?.lanes ?? {};
  lanes[laneId]?.cards?.push(cardId);

  return { ...state, lanes: { ...lanes }, cards: { ...cards } };
}
