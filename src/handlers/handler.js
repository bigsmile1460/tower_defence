import dotenv from "dotenv";
import handlerMapping from "./handlerMapping.js";
import { ValidateToken } from "../lib/utils/token/tokenCreate.js";

dotenv.config();

// handlerId → handler 변환
export const handlerEvent = async (io, socket, data) => {
  try {
    // handlerId 변환
    const handler = handlerMapping[data.handlerId];

    const [c2sTokenType, c2sAccessToken] = data.accessToken.split(' ');
    if(c2sTokenType !== process.env.TOKEN_TYPE_CHECK)
    {
      socket.emit("response", { status: "fail" });
    }

    const decodedAccessToken = ValidateToken(c2sAccessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    if(!decodedAccessToken)
    {
      return socket.emit("response", { status: "fail", message: "토큰이 만료되었습니다." });
    }

    // handler 실행
    const response = await handler(io, socket, data.payload, data.userId);
    console.log(response);

    socket.emit("response", response);
  } catch (error) {
    console.log("Handler 변환 중 에러 발생", error);
  }
};
