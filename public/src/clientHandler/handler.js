import handlerMapping from "./handlerMapping.js";

export const handlerEvent = async (data) => {
  try {
    // handlerId 변환
    const handler = handlerMapping[data.handlerId];

    // handler 실행
    await handler(data.payload);
  } catch (error) {
    console.log("Handler 변환 중 에러 발생", error);
  }
};
