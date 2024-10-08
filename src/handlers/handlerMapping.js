import { gameStart, stageEnd, stageChange } from "./stage.handler";

const handlerMapping = {
  1: gameStart,
  3: stageEnd,
};

export default handlerMapping;
