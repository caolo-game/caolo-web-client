import GameBoard from "./GameBoard";

export default GameBoard;

export const handleMessage = (setWorld, msg, cao) => {
  if (cao === null) return;
  const a2p = cao.axialToPixelPointy();
  msg = JSON.parse(msg);
  if (msg.WORLD_STATE) {
    const world = msg.WORLD_STATE;
    setWorld(world);
  }
};
