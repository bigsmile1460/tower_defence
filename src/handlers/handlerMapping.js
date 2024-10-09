import { gameStart, gameEnd, stageChange } from "./stage.handler.js";

const handlerMapping = {
  1: gameStart,
  2: stageChange,
  3: gameEnd,
};

export default handlerMapping;
