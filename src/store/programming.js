const init = {
    myProgramList: [],
    schema: {},
    lanes: [],
    compilationError: null,
    cardStates: {},
};

function unimpl(action) {
    throw new Error(`Unimplemented type ${action.type}`);
}

export default function ProgramReducer(state = init, action) {
    switch (action.type) {
        case "PROG.SET_CARD":
            const { cardId, payload } = action.payload;
            const cardStates = { ...state.cardStates };
            cardStates[cardId] = payload;
            return {
                ...state,
                cardStates,
            };
        case "PROG.APPEND_MY_PROGRAMS":
            return unimpl(action);
        case "PROG.SET_SCHEMA":
            return {
                ...state,
                schema: action.payload,
            };
        case "PROG.CLEAR_PROGRAM": {
            return {
                ...state,

                lanes: [],
                compilationError: null,
                cardStates: {},
            };
        }
        case "PROG.LOAD_PROGRAM": {
            return unimpl(action);
        }
        case "PROG.ADD_CARD2LANE": {
            const lanes = [...state.lanes];
            const { lane, cardId, cardName } = action.payload;
            if (cardName != null) {
                const card = state.schema.cards.find(({ name }) => name === cardName);
                if (cardId != null) {
                    card.cardId = cardId;
                } else {
                    card.cardId = makeid(32);
                }
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
        case "PROG.SET_LANE_NAME": {
            const { lane, name } = action.payload;
            const lanes = [...state.lanes];
            lanes[lane].name = name;
            return {
                ...state,
                lanes,
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

function makeid(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
