const initialState = {
    alma: 5,
};

export default function AuthReducer(state = initialState, action) {
    switch (action.type) {
        case "AUTH.LOGIN": {
            return {
                ...state,
                ...action.payload,
            };
        }
        default: {
            return state;
        }
    }
}
