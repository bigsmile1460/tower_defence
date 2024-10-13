import dotenv from "dotenv";
import handlerMapping from "./handlerMapping.js";
import { validateToken } from "../lib/utils/token/tokenCreate.js";

dotenv.config();

// handlerId → handler 변환
export const handlerEvent = async (socket, data) => {
  try {
    // handlerId 변환
    const handler = handlerMapping[data.handlerId];

    const [c2sTokenType, c2sAccessToken] = data.accessToken.split(" ");
    if (c2sTokenType !== process.env.TOKEN_TYPE_CHECK) {
      socket.emit("response", { status: "fail" });
    }

    const decodedAccessToken = validateToken(
      c2sAccessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    if (!decodedAccessToken) {
      return socket.emit("response", {
        status: "fail",
        message: "토큰이 만료되었습니다.",
      });
    }

    // handler 실행
    const response = await handler(
      io,
      socket,
      data.payload,
      decodedAccessToken.email
    );

    socket.emit("response", response);
  } catch (error) {
    console.log("Handler 변환 중 에러 발생", error);
  }
};
