import { handlerEvent } from "../clientHandler/handler.js";

class UserSocket {
  static gInstance = null;
  // 스테이지 정보들 저장
  constructor() {
    this.socket = null;
  }
  static getInstance() {
    if (!this.gInstance) {
      this.gInstance = new UserSocket();
    }
    return this.gInstance;
  }
  Connect() {
    let somewhere;
    this.socket = io(`http://localhost:3000`, {
      auth: {
        token: somewhere, // 토큰이 저장된 어딘가에서 가져와야 합니다!
      },
    });
    // 이벤트 핸들러
    this.socket.on("event", (data) => handlerEvent(data));
    // 응답 패킷 이벤트 할당
    this.socket.on("response", (data) => {
      console.log(data);
    });
  }
  // 서버에 패킷 전송
  SendEvent(handlerId, payload) {
    this.socket.emit("event", {
      handlerId,
      payload,
      accessToken: localStorage.getItem("authorization"),
    });
  }
}
export default UserSocket;
