import { handlerEvent } from "./handler.js";

const registerHandler = (io) => {
  try {
    io.on("connection", async (socket) => {
      socket.on("event", (data) => handlerEvent(socket, data));
      socket.on("disconnect", () => {
        // 인터벌 돌리는 부분 export 가져와서
        // clearInterval()
      })
    });
  } catch (error) {
    console.log("유저 연결 중 에러발생", error);
  }
};

export default registerHandler;
