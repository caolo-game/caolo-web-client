const init = {
    myProgramList: [],
    schema: {},
    lanes: [],
    compilationError: null,
};

function unimpl(action) {
    throw new Error(`Unimplemented type ${action.type}`);
}

export default function ProgramReducer(state = init, action) {
    switch (action.type) {
        case "PROG.APPEND_MY_PROGRAMS":
            return unimpl(action);
        case "PROG.SET_SCHEMA":
            return {
                ...state,
                schema: action.payload,
            };
        case "PROG.CLEAR_PROGRAM": {
            return unimpl(action);
        }
        case "PROG.LOAD_PROGRAM": {
            return unimpl(action);
        }
        case "PROG.ADD_CARD2LANE": {
            const lanes = [...state.lanes];
            // TODO: get the card from the schema
            const { lane, cardId } = action.payload;
            if (cardId != null) {
                const card = state.schema.cards.find(({ name }) => name === cardId);
                if (card) lanes[lane].cards.push(card);
            }

            return {
                ...state,
                lanes,
            };
        }
        case "PROG.REMOVE_CARD_FROM_LANE": {
            const { lane, index } = action.payload;
            const lanes = [...state.lanes];
            lanes[lane].cards.splice(index, 1);
            return {
                ...state,
                lanes,
            };
        }
        case "PROG.ADD_LANE": {
            return {
                ...state,
                lanes: [...state.lanes, { cards: [], ...action.payload }],
            };
        }
        case "PROG.REMOVE_LANE": {
            const { lane } = action.payload;
            const lanes = [...state.lanes];
            lanes.splice(lane, 1);
            return {
                ...state,
                lanes,
            };
        }
        case "PROG.SET_COMPILATION_ERROR":
            return { ...state, compilationError: action.payload };
        case "PROG.SET_PROGRAM_NAME":
            return { ...state, programName: action.payload };
        default:
            return state;
    }
}
