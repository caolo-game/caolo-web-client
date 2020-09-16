const initialState = {
    selectedId: null,
    selectedRoom: { q: 15, r: 14 },
    selectedRoomObject: null,
    roomObjects: {},
};

export default function GameReducer(state = initialState, action) {
    switch (action.type) {
        case "GAME.SELECT": {
            const selectedId = action.payload;
            const selectedRoomObjects = state.roomObjects[JSON.stringify(state.selectedRoom)];
            const merged = [].concat.apply([], Object.values(selectedRoomObjects));
            const selectedRoomObject = merged.find((obj) => obj.id === selectedId);
            return {
                ...state,
                selectedRoomObject,
                selectedId,
            };
        }
        case "GAME.SELECT_ROOM": {
            return {
                ...state,
                selectedRoom: action.payload,
            };
        }
        case "GAME.FETCH_ROOM_OBJECTS_SUCCESS": {
            const { room, data } = action.payload;
            let roomObjects = { ...state.roomObjects };
            roomObjects[JSON.stringify(room)] = data;
            return {
                ...state,
                roomObjects,
            };
        }
        default: {
            return state;
        }
    }
}
