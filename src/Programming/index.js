export const reducer = (state, action) => {
    switch (action.type) {
        case "APPEND_MY_PROGRAMS":
            throw "Unimplemented";
        case "SET_SCHEMA":
            throw "Unimplemented";
        case "CLEAR_PROGRAM": {
            throw "Unimplemented";
        }
        case "LOAD_PROGRAM": {
            throw "Unimplemented";
        }
        case "SET_COMPILATION_ERROR":
            return { ...state, compilationError: action.payload };
        case "SET_PROGRAM_NAME":
            return { ...state, programName: action.payload };
        default:
            return state;
    }
};

export const init = {
    myProgramList: [],
    schema: [],
    program: {
        nodes: [],
    },
    compilationError: null,
};
