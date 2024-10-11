// 스테이지에 대한 휘발성 메모리 저장
export let stages = [];

// 자 근데 스테이지 정보를 만든다고하면...
// DB에 등록된 스테이지 정보 X
// 그런 것도 없이 1 ~ 스테이지를 createStage로 휘발성 메모리로 찍어내야만 한다.

// 스테이지에 넣을 정보들
// 1. stageId - 스테이지 레벨
// 2. gold - 클리어시 획득 골드
// 3. score - 현재 점수
// 4. monsterCount - 몬스터 수
// 5. monsterCountLimit - 몬스터 갯수 제한
// 6. inhibitorHp - 억제기 Hp
// 6. inhibitorHpLimit - 억제기 Hp 제한
