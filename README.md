# TowerDefence
 
### 클라이언트
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
                    - 스테이지가 끝날 때 페이지를 새로고침한다. (리소스 다시 불러오기)
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
            / handler.js
                - userSocket 클래스가 서버로부터 이벤트 요청을 받으면 기능을 수행한다.
            / handlerMapping.js
                - handler.js에 정의된 handlerEvent가 어떤 기능을 수행할 지를 Mapping을 통해 정리해놓은 파일

        / Network
            / userSocket.js
                - 소켓 연결을 전역(static)변수를 사용해 연결하기 위해 만든 클래스가 정의되어 있다.
                - getInstatnce()를 통해 새로운 socketIO를 통해 웹소켓 연결이 가능하도록 정의되어 있다.
                - 클라이언트의 이벤트 핸들러처리(서버로부터 연산이 끝난 데이터값을 받아 사용함) 또는 서버에 직접 패킷을 요청하기도 한다. (SendEvent)
        / game.js
                - 실제 클라이언트가 실행되는 파일

### 서버   
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
                - 몬스터가 억제기를 타격할 때 공격을 검증하고 타격이 유효하면 success 상태를 보낸다.
            / spawnNormal.js
                - 몬스터 소환을 시작한다.
                - 몬스터가 소환되는 주기(cycle)을 생성한다.
        / stage
            / stageHandler.js
                - 스테이지 시작될 때 기능을 정의한다.
                - 스테이지 시작 시 게임이 재시작되는 것에 대한 처리로 데이터를 초기화한다. (스테이지, 몬스터, 타워 속성을 초기값으로 변경)
                - socket.emit("event", ~ )를 통해 클라이언트로 스테이지를 시작하라고 payload와 함께 메시지를 보낸다.
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
            
    / init 
        / socket.js
            - 웹소켓 서버 연결하는 파일
    
    / lib / utils
        / prisma
            / index.js
                - 유저 / 애셋 테이블에 연결하기 위한 프리즈마 클라이언트
        / token
            / tokenCreate.js
                - 액세스 토큰을 생성하고 검증한다.
    
    / route
        / middlewares
            / auth.middleware.js
                - 로그인 시 해당 유저의 아이디를 액세스 토큰으로 검증하는 미들웨어

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