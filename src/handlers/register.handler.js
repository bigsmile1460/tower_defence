import { handleConnection, handleDisconnect, handlerEvent } from "./helper";

const registerHandler = (io) => {
  try {
    io.on("connection", async (socket) => {
      handleConnection(socket);

      socket.on("event", (data) => handlerEvent(io, socket, data));

      socket.on("disconnect", () => handleDisconnect(socket));
    });
  } catch (error) {
    console.log("유저 연결 중 에러발생", error);
  }
};

export default registerHandler;
