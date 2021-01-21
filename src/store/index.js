import { applyMiddleware, createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import auth from "./auth";
import game from "./game";
import prog from "./programming";

import rootSaga from "./saga";

const rootReducer = combineReducers({
    auth,
    game,
    prog,
});

export default function configureStore(preloadedState) {
    const sagaMiddleWare = createSagaMiddleware();
    const middlewares = [sagaMiddleWare];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const enhancers = [middlewareEnhancer];
    const composedEnhancers = composeWithDevTools(...enhancers);

    const store = createStore(rootReducer, preloadedState, composedEnhancers);
    sagaMiddleWare.run(rootSaga);

    return store;
}
