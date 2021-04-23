export const initialGameState = {};

export const gameReducer = (state = initialGameState, action) => {
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
      const { entities, time } = action;
      const entityById = {};
      for (const entityByCategory of Object.values(entities ?? {})) {
        for (const e of entityByCategory) {
          entityById[e.id] = e;
        }
      }
      return {
        ...state,
        time,
        entities,
        entityById,
        selectedEntity: state.selectedEntityId
          ? entityById[state.selectedEntityId]
          : null,
      };
    default:
      return state;
  }
};
