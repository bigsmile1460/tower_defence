import { intervalId } from "../operator/monsterOperator.js";
import { stageChangeInterval } from "../operator/stageOperator.js";
import { handlerEvent } from "./handler.js";

const registerHandler = (io) => {
  try {
    io.on("connection", async (socket) => {
      socket.on("event", (data) => handlerEvent(socket, data));
      socket.on("disconnect", () => {
        clearInterval(stageChangeInterval);
        clearInterval(intervalId);
      });
    });
  } catch (error) {
    console.log("유저 연결 중 에러발생", error);
  }
};

export default registerHandler;
