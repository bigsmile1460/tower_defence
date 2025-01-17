>## 필수 과제

1. 회원 가입 / 로그인 
    - Rest API로 통신합니다.
2. 유저 별 게임 데이터 관리
    - 게임 시작 시 DB에 저장되어 있는 값을 서버로 불러오고 src / Storags 폴더 내 해당 데이터를 담는 파일들에 각각 객체를 생성해 저장합니다. 
    - 게임 중 클라이언트에서 일어나는 이벤트들을 서버에서 응답받아 데이터 연산 하여 클라이언트로 다시 넘겨줍니다.
        -> src / Handler 폴더에서 기능을 수행하고 src / operator에서 수행할 기능 내 함수들을 정의했습니다.
3. 클라이언트가 서버로부터 수신하는 이벤트 종류 정의 및 코드 구현 (WebSocket으로 통신)    
    - 클라이언트는 public / src / clientHandler 하위에 inhibitor(억제기), monsters, stages, towers 폴더 내에 각각의 이벤트 응답으로 실행할 함수들이 정의되어 있습니다.
    - 서버는 src / handlers 하위에 정의된 핸들러파일(ex> src/ handlers / tower / towerAttack.js)에서 정의된 함수를 실행하여 검증, 데이터 연산 후 웹소켓 통신으로 패킷을 클라이언트로 전달합니다.
4. 클라이언트가 서버로 송신하는 이벤트 종류 정의 및 코드 구현 (WebSocket으로 통신)
    - 클라이언트는 public / src / clientHandler / HandlerMapping.js에서 맵핑된 함수들을 사용하게 됩니다.
    - 서버는 src / handlers / register.handler.js에서 이벤트처리에 대한 응답을 받습니다.
5. 유저 별 최고 기록 스코어 저장
    - 게임 종료시(게임 오버, 게임 클리어) userDB의 highScore 필드에 저장된 데이터와 현재 스코어를 비교하여 높은 값을 저장한다.

>#### 저희가 구현한 코드에서의 웹소켓 통신 흐름은 이렇습니다.

클라이언트 <- WebSocket -> register.hanlder.js -> src/handlers/handler.js -> handlerMapping.js -> src/handlers 하위의 monster,stage,tower 폴더 내 파일에서 함수 실행 ->
socket.emit()을 통해 "event"이벤트로 패킷(검증 후 데이터 연산) 클라이언트로 전송

Operator 폴더 : 
    - 웹소켓으로 통신하여 "event"이벤트를 보내거나 서버에서 이뤄져야할 연산 및 검증을 담당하는 함수 기능들을 정의합니다.

Storages 폴더 :
    - 해당 폴더 이름에 따라 각 속성을 담는 객체를 만들어 데이터를 저장합니다.
    - DB와 다르게 영속성을 갖지 않으면서 서버에서 저장해야할 데이터들을 여기에 저장합니다.


>## 도전 과제

1. base -> inhibitor로 대체 및 '상태'추가
    - 스켈레톤 코드에서는 base가 파괴되면 게임오버 되었습니다.
    - 바뀐 inhibitor는 파괴되면 몬스터가 생성되는 주기가 2배로 빨라집니다. 
    - 파괴된 억제기는 상태가 'broken'상태로 변하고 일정 시간 후 재생성됩니다.
    - 억제기가 재생성될 때 상태가 다시 'normal'상태로 바뀌고 몬스터 생성 주기가 정상으로 돌아옵니다.
    - 억제기가 파괴될 때마다 죽은 억제기의 영혼이 몬스터로 변해 강화된 몬스터형태로 스테이지에 등장하게 됩니다. 
    - 억제기의 파괴, 재생성에 관련된 코드는 src / operator / inhibitorBroken 내에 정의되어 있습니다. 
    - 억제기를 몬스터가 공격하는 판정, 파괴되었는지에 대한 검증은 src / operator / monsterAttackOperator.js 에 정의되어 있습니다.

2. 단일공격, 멀티히트, 힐 타워로 타워 종류 추가
    - 타워를 구매할 때 선택지를 단일공격 타워, 멀티히트 타워, 힐 타워로 구분지어 사용자가 원하는 타워를 구매할 수 있도록 만들었습니다.
    - 힐 타워는 몬스터를 공격하지 않고 억제기의 체력을 회복시킵니다.
    - 타워 종류에 대한 코드는 public / src / tower.js / tower 클래스 내부에 정의되어 있습니다.

3. 플레이어이동 추가, 타워 판매, 업그레이드
    - '플레이어' 캐릭터를 WASD 조작방식으로 이동할 수 있습니다. 
    - 타워 구매시 기존 랜덤위치 설치 방식에서 해당 '플레이어' 캐릭터가 서있는 위치에서 설치되도록 변경했습니다.
    - 타워를 판매하면 해당 타워를 위해 지불한 금액의 일정비율(업그레이드로 쓰인 비용 포함)로 환불받게 됩니다.
    - 업그레이드 비용을 지불해 해당 타워의 스테이터스를 상승시킬 수 있습니다. 업그레이드 할 때마다 요구하는 비용이 증가합니다.

4. 게임오버 조건 변경
    - 기존: base가 파괴 -> '몬스터 카운트'숫자가 db에 저장된 한계치에 도달하면 게임오버로 조건을 변경했습니다.
    - 몬스터카운트에 대한 데이터는 src / storages / stage.storage.js 에서 저장합니다.

5. 게임 클리어 조건 설정
    - 마지막 스테이지에 도달하면 몬스터 스폰을 끝내고 몬스터 스폰이 끝난 것을 확인하면 몬스터의 개체 수가 0이 되었을 때 게임을 클리어하도록 설정했습니다.
    - assetDB 내 Monster 테이블에 monster를 단계별로 총 20개를 설정한 상태입니다.
    - stage레벨 또한 그에 따라 20까지만 설정되고 마지막 몬스터 id값인 20레벨의 몬스터가 나온 후 다음 스테이지에서는 몬스터의 생성주기(setInterval()로 설정함)가 clearInterval() 함수을 통해 사라지게 됩니다.
    - 자세한 코드는 src / operator / monsterOperator.js -> spawnStart 함수에 정의되어 있습니다.



>파일 설명

## 클라이언트
- 클라이언트에서는 연산에 대한 검증처리를 하지 않는다.
- 모든 데이터 연산과 그에 대한 검증은 서버에서 처리한다.
- 클라이언트에서 어떤 기능을 사용하기 위해선 웹소켓으로 연결된 서버에 이벤트 메시지요청을 보내게 되며
서버에서는 비정상적인 데이터값이 발견되거나 연산해선 안되는 조건에서 연산을 진행할 경우 클라이언트로 응답을 하지 않기 때문에 클라이언트에서 기능을 수행하지 않는다.

public
    / image
        - 이미지 소스파일들 저장해놓은 폴더

    / src 
        - 클라이언트에서 사용될 소스파일들을 모아놓은 폴더

        / Client

            / gameClient.js
                - game.js 에서 사용할 게임 데이터와 함수(기능)을 정의해놓은 클래스를 만든 파일       
        
        / clientHandler
            - 핸들러로 수행하는 기능이 정의되어 있다.

            / monsters                    
                / dieMonster.js
                    - 몬스터 사망 처리
                    - 유저의 점수(score), 골드(userGold)를 삭제한다.
                    - 소환되면서 몬스터 배열 내 할당된 몬스터를 사망처리되면 제거한다.
                / monsterAttack.js
                    - 몬스터 공격 (억제기 타격)
                    - 억제기에 몬스터가 타격할 시 억제기의 hp를 감소시킨다.
                / spawnNormal.js
                    - 일반몬스터 소환
                    - 이동경로와 이미지, 데이터(해당 몬스터의 스테이터스)를 갖는 몬스터를 한마리씩 생성한다.
            
            / stages
                / stageChange.js
                    - 스테이지를 변경할 때 데이터를 연산한다. (스테이지레벨 상승, 골드보너스)
                / stageEnd.js
                    - 스테이지가 끝날 때 엔딩 페이지로 이동한다. (게임 오버, 게임 클리어)
                / stageStart.js
                    - 스테이지를 시작하면서 초기값을 설정한다. (GameClient 클래스 내 데이터)
            
            / towers
                / buyTower.js
                    - 타워를 구매할 때 상호작용처리를 한다.
                    - 골드소모하고 타워 배열에 값을 하나 추가한다. 
                / sellTower.js
                    - 판매할 타워의 id값을 확인해 해당 타워를 판매한다.
                    - 판매가격만큼 userGold를 획득한다. 
                    - 해당 타워가 생성되면서 만들어졌던 업그레이드, 판매 버튼을 제거한다.
                    - 데이터들을 갖고 있는 배열에서 해당타워 값을 제거한다.(splice)
                / upgradeTower.js
                    - 업그레이드할 타워의 id값을 확인해 해당 타워를 업그레이드 한다.
                    - 업그레이드마다 타워의 공격력과 업그레이드 비용이 증가하며 타워의 레벨이 1 오른다.
                    - 업그레이드 시 골드가 소모된다.
            / inhibitor
                / inhibitorStatus.js
                    - 서버에서 전달받은 억제기 상태 및 체력을 업데이트한다.
                    - 억제기 상태에 따라서 특수 몬스터를 출현시킨다.

            / handler.js
                - userSocket 클래스가 서버로부터 이벤트 요청을 받으면 기능을 수행한다.
            / handlerMapping.js
                - handler.js에 정의된 handlerEvent가 어떤 기능을 수행할 지를 Mapping을 통해 정리해놓은 파일

        / Network
            / userSocket.js
                - 소켓 연결을 전역(static)변수를 사용해 연결하기 위해 만든 클래스가 정의되어 있다.
                - getInstatnce()를 통해 웹소켓 연결이 가능하도록 정의되어 있다.
                - 클라이언트의 이벤트 핸들러처리(서버로부터 연산이 끝난 데이터값을 받아 사용함) 또는 서버에 직접 패킷을 요청하기도 한다. (SendEvent)
        / game.js
                - 실제 클라이언트가 실행되는 파일

## 서버   
src /

    / handlers
        - 연산할 데이터를 검증 후 유효할 경우 연산된 데이터를 클라이언트로 보내준다.
        - 클라이언트와 서로 패킷을 주고 받는다.

        / handler.js
            - 액세스 토큰 검증 후 유효할 경우 맵핑된 해당 함수(아래 폴더들에 정의됨) 기능을 수행하고 소켓, payload, userId(디코딩된 email)를 클라이언트로 보내준다.
        / handlerMapping.js
            - 핸들러에서 수행할 기능들을 맵핑해서 저장한다.  
        / register.handler.js
            - 클라이언트 실행(유저 연결) 시 "event" 이벤트에 응답할 handlerEvent를 실행하고
            "disconnect"이벤트에 응답할 기능(몬스터 소환 주기 초기화 등)을 수행한다.
        
        / monster
            / monsterAttack.js
                - 몬스터가 억제기를 타격할 때 공격을 검증하고 타격이 유효하면 억제기의 체력을 감소시킨다.
            / spawnNormal.js
                - 몬스터 소환을 시작한다.
                - 몬스터가 소환되는 주기(cycle)을 생성한다.
        / stage
            / stageHandler.js
                - 스테이지 시작될 때 기능을 정의한다.
                - 스테이지 시작 시 게임이 재시작되는 것에 대한 처리로 데이터를 초기화한다. (스테이지, 몬스터, 타워 속성을 초기값으로 변경)
                - 클라이언트로 스테이지 시작 메시지를 보낸다.
        / tower
            / towerAttack.js
                - 타워 공격시 공격하는 것이 유효한 지를 검증한다.
                - 각 타워마다 공격 쿨타임이 있으므로 공격쿨타임을 적용한다.
            / towerBuy.js
                - 타워 구매시 타워 갯수 검사 (해당 게임에는 타워 갯수 제한이 있음)
                - 검증이 유효할 경우 구매하면서 데이터를 처리한다.
                ( 골드 차감, 생성될 타워 데이터를 클라이언트로 보냄 )
            / towerSell.js
                - 현재 판매하려는 유저가 유효한 유저인지 검증한다. (해당 유저가 해당 타워를 갖고 있는 지)
                - 유저의 현재 골드를 체크 후 판매금액만큼 유저의 현재 골드가 증가한다.
                - 현재 생성되어 있는 타워 배열에서 판매하는 해당타워를 삭제한다.
            / towerUpgrade.js
                - 업그레이드에 대한 기능과 검증을 담당한다.
                - 업그레이드 하려는 유저가 유효한 지 검증 후 통과시 아래의 기능을 진행한다.
                - 업그레이드에 필요한 비용보다 골드가 부족하다면 업그레이드를 진행하지 않는다.
                - 업그레이드 시 해당 비용만큼 골드가 차감된다.
        / inhibitor
            / inhibitorBroken.js
                - 억제기 파괴와 재생성에 대한 기능을 담당한다.
                - 억제기 파괴시 특수 몬스터가 생성되며 시간이 경과되면 억제기를 재생성한다.
            
    / init 
        / socket.js
            - 웹소켓 서버 연결하는 파일
    
    / lib / utils
        / prisma
            / index.js
                - userDB/assetDB에 연결하기 위한 프리즈마 클라이언트
        / token
            / tokenCreate.js
                - 액세스 토큰을 생성하고 검증한다.
    
    / route
        / middlewares
            / auth.middleware.js
                - 액세스 토큰으로 검증하는 미들웨어

    / Operator
        - 타워, 몬스터, initGame과 같은 DB 데이터를 이곳에 정의된 함수들을 통해 핸들러에서 데이터 연산하거나 검증한다.

        / monsterAttackOperator.js 
            - 몬스터 공격 시 데이터 연산 및 검증
            - 억제기 파괴 여부에 대한 연산 및 검증
        / monsterDieOperator.js
            - 몬스터가 처치될 시 데이터 연산 및 검증
        / monsterOperator.js
            - 몬스터 정보, 몬스터 소환, 몬스터 소환 주기 변경 등에 대한 연산 및 검증
        / stageOperator.js
            - 스테이지 시작, 스테이지 변경, 스테이지 정보 등에 대한 연산 및 검증
        / towerAttackOperator.js
            - 타워 공격에 대한 연산 및 검증 
        / towerBuyOperator.js
            - 타워 구매에 대한 연산 및 검증
        / towerSellOperator.js
            - 타워 판매에 대한 연산 및 검증
        / towerUpgradeOperator.js
            - 타워 업그레이드에 대한 연산 및 검증
        
    / Storage
        - DB에 저장되지 않는 서버 데이터(휘발성 데이터)를 저장하는 파일들을 담은 폴더

        / monster.storage.js
        - 몬스터의 정보를 담은 파일
        / stage.storage.js
        - 스테이지의 정보를 담은 파일
        / tower.storage.js
        - 타워의 정보를 담은 파일
    
    / app.js
        - 메인 파일
        - 서버 - 클라이언트 간 웹소켓 통신을 연결한다.

