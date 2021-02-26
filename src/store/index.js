import { applyMiddleware, createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import auth from "./auth";
import game from "./game";
import prog from "./programming";

const rootReducer = combineReducers({
    auth,
    game,
    prog,
});

export default function configureStore(preloadedState) {
    const middlewares = [];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const enhancers = [middlewareEnhancer];
    const composedEnhancers = composeWithDevTools(...enhancers);

    const store = createStore(rootReducer, preloadedState, composedEnhancers);
    return store;
}
