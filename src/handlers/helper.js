import handlerMapping from "./handlerMapping.js";

export const handleDisconnect = async (socket) => {
  console.log(`User disconnected`);
};

// 스테이지에 따라서 더 높은 점수 획득
// 1 스테이지, 0점 => 1점씩
// 2 스테이지 , 1000점 => 2점씩

// 유저가 생성되거나, 게임이 시작되거나 => 생성
export const handleConnection = async (socket) => {
  // 본인에게 보내는 것(response)
  socket.emit(`connection`, { message: "어서오세요" });
};

//
export const handlerEvent = async (io, socket, data) => {
  //data = payload

  const handler = handlerMapping[data.handlerId];
  if (!handler) {
    socket.emit("response", { status: "fail", message: "Handler not found" });
    return;
  }

  // async, await를 붙인 이유는 record핸들러에서 값이 넘어오기전에 먼저 출력해버리는 걸 막기 위함
  const response = await handler(data.userId, data.payload);

  socket.emit("response", response);
};
