import { getLocalStorage, setLocalStorage } from "../Local/localStorage.js";

class UserSocket {
  static gInstance = null;

  // 스테이지 정보들 저장
  constructor() {
    this.socket = null;
  }

  static GetInstance() {
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

    // 연결 이벤트 할당
    this.socket.on("connection", (data) => {});

    // 응답 패킷 이벤트 할당

    this.socket.on("response", (data) => {
      if (data.initGameDB) {
        setLocalStorage("initGameDB", data.initGameDB);
        setLocalStorage("stages", data.stages);
        setLocalStorage("currentStage", getLocalStorage("stages")[0]);
        return;
      }

      if (data.currentStage) {
        setLocalStorage(
          localStorage.setItem("currentStage", data.currentStage)
        );
        return;
      }

      if (data.towerInfo) {
        setLocalStorage("towerInfo", data.towerInfo);
        setLocalStorage("userGold", data.userGold);
        return;
      }
      //console.log(data);
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
