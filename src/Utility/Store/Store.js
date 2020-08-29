import React, { createContext, useContext, useReducer } from "react";

export const StoreContext = createContext();

export const Store = ({ reducer, initialState, children }) => (
    <StoreContext.Provider value={useReducer(reducer, initialState)}>{children}</StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
