import React from "react";

//Consume a context and put a provider with the same value inside a new component tree
//this is necessary if we use different reconciler
//like the DOM render and the Pixi render
const ContextBridge = ({ render, Context, children }) => (
    <Context.Consumer>{(value) => render(<Context.Provider value={value}>{children}</Context.Provider>)}</Context.Consumer>
);

export default ContextBridge;
