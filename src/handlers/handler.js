import handlerMapping from "./handlerMapping.js";

// handlerId → handler 변환
export const handlerEvent = async (io, socket, data) => {
  try {
    // handlerId 변환
    const handler = handlerMapping[data.handlerId];

    // handler 실행
    const response = await handler(io, socket, data.payload);

    socket.emit("response", response);
  } catch (error) {
    console.log("Handler 변환 중 에러 발생", error);
  }
};
