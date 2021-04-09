import { useMemo } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

let store;
const initialState = {
  game: {},
};

const gameReducer = (state = {}, action) => {
  switch (action.type) {
    case "GAME.RESET":
      return { ...state, terrain: null, entities: null, time: null };
    case "GAME.SELECT_ROOM":
      return { ...state, roomId: action.roomId };
    case "GAME.SELECT_ENTITY":
      return {
        ...state,
        selectedEntityId: action.entityId,
        selectedEntity: (state?.entityById ?? {})[action.entityId],
      };
    case "GAME.SET_ROOMS":
      return { ...state, rooms: action.rooms };
    case "GAME.SET_ROOM_LAYOUT":
      return { ...state, roomLayout: action.roomLayout };
    case "GAME.SET_TERRAIN":
      return { ...state, terrain: action.terrain };
    case "GAME.SET_ENTITIES":
      const { entities } = action;
      const entityById = {};
      for (const key of Object.keys(entities ?? {})) {
        for (const e of entities[key] ?? []) {
          entityById[e.id] = e;
        }
      }
      return {
        ...state,
        entities,
        entityById,
        selectedEntity: state.selectedEntityId
          ? entityById[state.selectedEntityId]
          : null,
      };
    case "GAME.SET_TIME":
      return { ...state, time: action.time };
    default:
      return state;
  }
};

const rootReducer = combineReducers({ game: gameReducer });

// from https://github.com/vercel/next.js/blob/canary/examples/with-redux/store.js
export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

function initStore(preloadedState = initialState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  );
}
