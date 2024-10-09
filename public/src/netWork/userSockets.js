class UserSocket {
  initGameDB;
  currentStage;
  stages;

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
        this.initGameDB = data.initGameDB;
        this.stages = data.stages;
        this.currentStage = this.stages[0];
        return;
      }

      if (data.currentStage) {
        this.currentStage = data.currentStage;
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
