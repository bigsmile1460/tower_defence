class UserSocket {
  // 스테이지 정보들 저장
  constructor() {
    this.socket = null;
    this.gInstance = null;
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

    // 서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다!
    // e.g. serverSocket.on("...", () => {...});

    // 연결 이벤트 할당
    this.socket.on("connection", (data) => {});

    // 응답 패킷 이벤트 할당
    this.socket.on("response", (data) => {
      if (data.initGameDB) {
        localStorage.setItem("initGameDB", JSON.stringify(data.initGameDB));
        localStorage.setItem("stages", JSON.stringify(data.stages));
        localStorage.setItem(
          "currentStage",
          JSON.parse(localStorage.getItem("stages"))[0]
        );
        console.log(JSON.parse(localStorage.getItem("initGameDB")));
        return;
      }

      if (data.currentStage) {
        localStorage.setItem("currentStage", JSON.stringify(data.currentStage));
        return;
      }
    });
  }

  // 서버에 패킷 전송
  SendEvent(handlerId, payload) {
    this.socket.emit("event", {
      handlerId,
      payload,
    });
  }
}

export default UserSocket;
