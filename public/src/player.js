class Player {
  charImages = [];
  image = null;

  // 생성자
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = Math.floor(width);
    this.height = Math.floor(height);

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;

    this.dirX = 0;
    this.dirY = 0;

    this.speed = 10;

    // 키보드 설정
    // 등록된 이벤트가 있는 경우 삭제하고 다시 등록
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    const charImage1 = new Image();
    charImage1.src = "../images/knight.png";

    this.image = charImage1;
  }

  keydown = (event) => {
    switch (event.code) {
      case "KeyS":
        this.dirY = 1;
        //this.y += 10;
        break;
      case "KeyW":
        this.dirY = -1;
        //this.y -= 10;
        break;
      case "KeyA":
        this.dirX = -1;
        //this.x -= 10;
        break;
      case "KeyD":
        this.dirX = 1;
        //this.x += 10;
        break;
    }    
  };

  keyup = (event) =>{
    this.dirX=0;
    this.dirY=0;
  }

  move()
  {
    this.x += this.dirX * this.speed;
    this.y += this.dirY * this.speed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.fillText(
      "your Name",
      this.x + 15,
      this.y,
      this.width + 10,
      this.height + 10
    );
  }

  reset() {
    this.width = this.save.width;
    this.height = this.save.height;
  }
}

export default Player;
