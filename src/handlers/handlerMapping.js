import { gameStart, gameEnd } from "./stage.handler.js";

const handlerMapping = {
  1: gameStart,
  3: gameEnd,
};

export default handlerMapping;
