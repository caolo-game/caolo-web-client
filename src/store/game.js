const initialState = {
    selectedId: null,
    selectedRoom: { q: 15, r: 16 },
    selectedRoomObject: null,
    roomObjects: {},
    // list of coordinates that correspond to terrain tiles
    // when fetching a room terrain from the back-end `roomTerrainCoordinates[i]` is the position of `terrain[i]`
    roomTerrainCoordinates: null,
    terrain: null,
    // room id of `terrain`
    currentTerrainRoom: null,
    _rawTerrain: null,
};

function zip(list0, list1) {
    if (!list0 || list0?.length !== list1?.length) {
        throw Error(`The two lists are of different lengths. A: ${list0?.length} B: ${list1?.length}`);
    }

    return list0.map((x, i) => [x, list1[i]]);
}

export default function GameReducer(state = initialState, action) {
    switch (action.type) {
        case "GAME.SET_ROOM_TERRAIN":
            if (!action.payload || !action.payload.terrain?.length) {
                return {
                    ...state,
                    _rawTerrain: null,
                    terrain: null,
                    currentTerrainRoom: null,
                };
            }
            if (!state.roomTerrainCoordinates) {
                // the room positions template is not yet available
                // store the payload for later processing
                return {
                    ...state,
                    _rawTerrain: action.payload,
                    terrain: null,
                    currentTerrainRoom: null,
                };
            }
            const terrain = zip(state.roomTerrainCoordinates, action.payload.terrain);
            const currentTerrainRoom = action.payload.room;
            return {
                ...state,
                _rawTerrain: null,
                terrain,
                currentTerrainRoom,
            };
        case "GAME.SET_ROOM_TERRAIN_COORDINATES":
            if (state._rawTerrain?.terrain) {
                // there's terrain that's awaiting processing. do it now
                const terrain = zip(action.payload, state._rawTerrain.terrain);
                const currentTerrainRoom = state._rawTerrain.room;
                return {
                    ...state,
                    _rawTerrain: null,
                    terrain,
                    currentTerrainRoom,
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
