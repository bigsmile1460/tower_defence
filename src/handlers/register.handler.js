import { intervalId } from "../operator/monsterOperator.js";
import { stageChangeInterval } from "../operator/stageOperator.js";
import { clearMonsters } from "../Storages/monster.storage.js";
import { deleteStage } from "../Storages/stage.storage.js";
import { clearTower } from "../Storages/tower.storage.js";
import { handlerEvent } from "./handler.js";
export let users = {};
const registerHandler = (io) => {
  try {
    io.on("connection", async (socket) => {
      socket.on("event", (data) => handlerEvent(socket, data));
      socket.on("disconnect", () => {
        clearInterval(intervalId[users[socket.id]]);
        clearInterval(stageChangeInterval[users[socket.id]]);
        clearTower(users[socket.id][0]);
        deleteStage(users[socket.id][0]);
        clearMonsters(users[socket.id][0]);
      });
    });
  } catch (error) {
    console.log("유저 연결 중 에러발생", error);
  }
};
export default registerHandler;
