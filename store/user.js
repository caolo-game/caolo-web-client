import { initialScriptState } from "./script";

export const initialUserState = {};

if (process?.browser && localStorage) {
  initialUserState.token = localStorage.getItem("auth-token");
}

export const userReducer = (state = initialScriptState, action) => {
  switch (action.type) {
    case "USER.SET_TOKEN":
      if (process?.browser && localStorage) {
        localStorage.setItem("auth-token", action.token);
      }
      return { ...state, token: action.token };
    case "USER.SET_USER_DATA":
      if (action.payload) {
        const { user_id, username, displayname, email } = action.payload;
        return { ...state, userId: user_id, username, displayname, email };
      }
      return state;
    default:
      return state;
  }
};
