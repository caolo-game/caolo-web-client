export const initialScriptState = {};

export const scriptReducer = (state = initialScriptState, action) => {
  switch (action.type) {
    case "SCRIPT.SET_SCHEMA":
      return { ...state, schema: action.schema };
    default:
      return state;
  }
};
