class pathManager {
  constructor(canvas, ctx, pathImage, width, height) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.pathImage = pathImage;
    this.width = width;
    this.height = height;
  }

  generateRandomMonsterPath() {
    const path = [];
    let currentX = 0;
    let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

    path.push({ x: currentX, y: currentY });

    while (currentX < this.canvas.width) {
      currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
      // x 좌표에 대한 clamp 처리
      if (currentX > this.canvas.width) {
        currentX = this.canvas.width;
      }

      currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
      // y 좌표에 대한 clamp 처리
      if (currentY < 0) {
        currentY = 0;
      }
      if (currentY > this.canvas.height) {
        currentY = this.canvas.height;
      }

      path.push({ x: currentX, y: currentY });
    }

    return path;
  }

  drawRotatedImage(image, x, y, width, height, angle) {
    this.ctx.save();
    this.ctx.translate(x + width / 2, y + height / 2);
    this.ctx.rotate(angle);
    this.ctx.drawImage(image, -width / 2, -height / 2, width, height);
    this.ctx.restore();
  }

  drawPath(monsterPath) {
    const segmentLength = 20; // 몬스터 경로 세그먼트 길이
    const imageWidth = this.width; // 몬스터 경로 이미지 너비
    const imageHeight = this.height; // 몬스터 경로 이미지 높이
    const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

    for (let i = 0; i < monsterPath.length - 1; i++) {
      const startX = monsterPath[i].x;
      const startY = monsterPath[i].y;
      const endX = monsterPath[i + 1].x;
      const endY = monsterPath[i + 1].y;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
      const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

      for (let j = gap; j < distance - gap; j += segmentLength) {
        // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
        // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
        const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
        const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
        this.drawRotatedImage(
          this.pathImage,
          x,
          y,
          imageWidth,
          imageHeight,
          angle
        );
      }
    }
  }

  getRandomPositionNearPath(maxDistance) {
    // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
    const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
    const startX = monsterPath[segmentIndex].x;
    const startY = monsterPath[segmentIndex].y;
    const endX = monsterPath[segmentIndex + 1].x;
    const endY = monsterPath[segmentIndex + 1].y;

    const t = Math.random();
    const posX = startX + t * (endX - startX);
    const posY = startY + t * (endY - startY);

    const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
    const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

    return {
      x: posX + offsetX,
      y: posY + offsetY,
    };
  }
}

export default pathManager;
