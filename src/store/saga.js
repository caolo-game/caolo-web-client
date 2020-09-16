import { all, put, call, take, delay, fork } from "redux-saga/effects";
import { apiBaseUrl } from "../Config";
import axios from "axios";

function* fetchRoomObjects(room) {
    const response = yield call(() => axios.get(apiBaseUrl + "/room-objects", { params: room }));
    yield put({ type: "GAME.FETCH_ROOM_OBJECTS_SUCCESS", payload: { room, data: response.data } });
}

function* pollRoomObjects(room) {
    while (true) {
        yield call(fetchRoomObjects, room);
        yield delay(2000);
    }
}

function* watchRoomObjectSaga() {
    while (true) {
        const action = yield take("GAME.WATCH_ROOM_START");
        const pollTask = yield fork(pollRoomObjects, action.payload);
        yield take("GAME.WATCH_ROOM_END");
        pollTask.cancel();
    }
}

export default function* rootSaga() {
    yield all([watchRoomObjectSaga()]);
}
