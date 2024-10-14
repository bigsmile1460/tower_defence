import { intervalId } from "../operator/monsterOperator.js";
import { stageChangeInterval } from "../operator/stageOperator.js";
import { handlerEvent } from "./handler.js";
export let users = {};
const registerHandler = (io) => {
  try {
    io.on("connection", async (socket) => {
      socket.on("event", (data) => handlerEvent(socket, data));
      socket.on("disconnect", () => {
        clearInterval(stageChangeInterval[users[socket.id]]);
        clearInterval(intervalId[users[socket.id]]);
      });
    });
  } catch (error) {
    console.log("유저 연결 중 에러발생", error);
  }
};
export default registerHandler;
