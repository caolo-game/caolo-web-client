const initialState = {
    selectedId: null,
    selectedRoom: { q: 15, r: 16 },
    selectedRoomObject: null,
    roomObjects: {},
    roomTerrainCoordinates: null,
    rawTerrain: null,
    terrain: null,
};

function zip(list0, list1) {
    if (!list0 || list0?.length !== list1?.length) {
        throw Error(`The two lists are of different lengths. A: ${list0?.length} B: ${list1?.length}`);
    }

    return list0.map((c, i) => [c, list1[i]]);
}

export default function GameReducer(state = initialState, action) {
    switch (action.type) {
        case "GAME.SET_ROOM_TERRAIN":
            if (!action.payload) {
                return {
                    ...state,
                    rawTerrain: null,
                    terrain: null,
                };
            }
            if (!state.roomTerrainCoordinates) {
                return {
                    ...state,
                    rawTerrain: action.payload,
                    terrain: null,
                };
            }
            const terrain = zip(state.roomTerrainCoordinates, action.payload);
            return {
                ...state,
                rawTerrain: null,
                terrain,
            };
        case "GAME.SET_ROOM_TERRAIN_COORDINATES":
            if (state.rawTerrain) {
                const terrain = zip(action.payload, state.rawTerrain);
                return {
                    ...state,
                    rawTerrain: null,
                    terrain,
                    roomTerrainCoordinates: action.payload,
                };
            }
            return {
                ...state,
                roomTerrainCoordinates: action.payload,
            };
        case "GAME.SELECT": {
            const selectedId = action.payload;
            const selectedRoomObjects = state.roomObjects[JSON.stringify(state.selectedRoom)].payload;
            const merged = [].concat.apply([], Object.values(selectedRoomObjects));
            const selectedRoomObject = merged.find((obj) => obj.__id === selectedId);
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
