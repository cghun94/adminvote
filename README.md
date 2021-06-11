# 관리자 페이지 만들기
---
개발 순서

VM 우분투 리눅스 설치                                      
vscode에서 remote development
리눅스에 mysql 구축

express 설치

db커넥션 

암호화 bcrypt

세션 JWT
token 저장 ( cookie , localStorage)
token 검증하여 만료시간 재설정 , 재발급

---
## 시작하기

Ubuntu 20.04.1 LTS + Node.js 10.19 + npm 6.14.4 환경에서 작성되었습니다.

### 설치하기

- `nodejs` 와 `npm` 을 설치합니다.
- Node.js 10.19 LTS 버전을 설치합니다..
- 실행에 필요한 의존성을 설치합니다.

```
  npm install
```
 ### 실행하기

```
  npm start
```
- `localhost:3000`으로 접속이 가능합니다 
- port 수정시 env파일에서 설정 하거나 bin/www.js 에서 port 설정
- env 파일위치 확인 코드 `require('dotenv').config({path : '/root/admin/.env'});` 


### 프레임워크 환경

> nodejs                 v10.19.0<br>
> express                v4.17.1<br>
> dotenv                 v10.0.0<br>
> mysql                  v2.18.1<br>
> morgan                 v1.10.0<br>
> nodenom                v2.0.7<br>
> ejs                    v3.1.6<br>
> body-parser            v1.19.0<br>
> bcrypt          	     v5.0.1<br>
> jsonwebtoken           v8.5.1<br>
> axios                  v0.21.1<br>
> cookie                 v0.4.1<br>
> bootstrap              ^5.0.1<br>


### database schema
```sql

CREATE TABLE users(
  idx int(11) unsigned AUTO_INCREMENT NOT NULL primary key COMMENT '회원번호 또는 지갑주소',
  id char(20) NOT NULL  COMMENT '아이디',
  name varchar(100) NOT NULL COMMENT '이름',
  pw varchar(255) NOT NULL COMMENT '비밀번호',
  KRW DOUBLE DEFAULT 0 COMMENT '원화',
  created_at DATETIME DEFAULT now() NOT NULL COMMENT '생성날짜',
  updated_at DATETIME ON UPDATE now() DEFAULT now() NOT NULL COMMENT '최근업뎃날짜',
  UNIQUE INDEX `users_uk_id` (id)
)ENGINE=InnoDB charset='utf8';

```

```
mysql> desc users;

+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| Field      | Type         | Null | Key | Default           | Extra                                         |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| idx        | int unsigned | NO   | PRI | NULL              | auto_increment                                |
| id         | char(20)     | NO   | UNI | NULL              |                                               |
| name       | varchar(100) | NO   |     | NULL              |                                               |
| pw         | varchar(255) | NO   |     | NULL              |                                               |
| created_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+


```

```sql

CREATE TABLE Asset(
  users_idx int(11) unsigned NOT NULL COMMENT '유저의 회원번호 또는 지갑주소',
  CoinName char(30) not null COMMENT '코인명',
  PrevBalance DOUBLE DEFAULT 0 COMMENT '거래전 잔고금액',
  Quantity DOUBLE DEFAULT 0 COMMENT '보유수량',
  NowPrice DOUBLE DEFAULT 0 COMMENT '현재시세',
  buyAmount DOUBLE DEFAULT 0 COMMENT '매수금액',
  Withdrawal DOUBLE DEFAULT 0 COMMENT '출금금액',
  AfterBalance DOUBLE DEFAULT 0 COMMENT '거래후 잔고금액',
  LatestTime DATETIME ON UPDATE now() DEFAULT now() NOT NULL COMMENT '최근거래시간',
  FOREIGN KEY (users_idx) REFERENCES users(idx)
)ENGINE=InnoDB charset='utf8';

```

```
mysql> desc Asset;
+--------------+--------------+------+-----+-------------------+-----------------------------------------------+
| Field        | Type         | Null | Key | Default           | Extra                                         |
+--------------+--------------+------+-----+-------------------+-----------------------------------------------+
| users_idx    | int unsigned | NO   | MUL | NULL              |                                               |
| CoinName     | char(30)     | NO   |     | NULL              |                                               |
| PrevBalance  | double       | YES  |     | 0                 |                                               |
| Quantity     | double       | YES  |     | 0                 |                                               |
| NowPrice     | double       | YES  |     | 0                 |                                               |
| buyAmount    | double       | YES  |     | 0                 |                                               |
| Withdrawal   | double       | YES  |     | 0                 |                                               |
| AfterBalance | double       | YES  |     | 0                 |                                               |
| LatestTime   | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+--------------+--------------+------+-----+-------------------+-----------------------------------------------+

```

```sql

CREATE TABLE Log(
  idx int(11) unsigned AUTO_INCREMENT NOT NULL primary key COMMENT '거래번호',
  users_idx int(11) unsigned NOT NULL COMMENT '유저의 회원번호',
  CoinName char(30) not null COMMENT '코인명',
  PrevBalance DOUBLE DEFAULT 0 COMMENT '거래전 잔고금액',
  Quantity DOUBLE DEFAULT 0 COMMENT '보유수량',
  NowPrice DOUBLE DEFAULT 0 COMMENT '현재시세',
  buyAmount DOUBLE DEFAULT 0 COMMENT '매수금액',
  Withdrawal DOUBLE DEFAULT 0 COMMENT '출금금액',
  AfterBalance DOUBLE DEFAULT 0 COMMENT '거래후 잔고금액',
  prevKRW DOUBLE DEFAULT 0 COMMENT '거래전 원화',
  AfterKRW DOUBLE DEFAULT 0 COMMENT '거래후 원화',
  LatestTime DATETIME DEFAULT now() NOT NULL COMMENT '최근거래시간'
)ENGINE=InnoDB charset='utf8';


```


```
+--------------+--------------+------+-----+-------------------+-------------------+
| Field        | Type         | Null | Key | Default           | Extra             |
+--------------+--------------+------+-----+-------------------+-------------------+
| idx          | int unsigned | NO   | PRI | NULL              | auto_increment    |
| users_idx    | int unsigned | NO   |     | NULL              |                   |
| CoinName     | char(30)     | NO   |     | NULL              |                   |
| PrevBalance  | double       | YES  |     | 0                 |                   |
| Quantity     | double       | YES  |     | 0                 |                   |
| NowPrice     | double       | YES  |     | 0                 |                   |
| buyAmount    | double       | YES  |     | 0                 |                   |
| Withdrawal   | double       | YES  |     | 0                 |                   |
| AfterBalance | double       | YES  |     | 0                 |                   |
| prevKRW      | double       | YES  |     | 0                 |                   |
| AfterKRW     | double       | YES  |     | 0                 |                   |
| LatestTime   | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+--------------+--------------+------+-----+-------------------+-------------------+


```

---
## 목차
### 1.관리자 로그인
### 2.관리자 메인페이지
### 3.메뉴
  - 회원 관리
  - 코인 관리
### 4.회원 관리
  - 회원 관리
  - 회원 관리 user
### 5.코인 관리(AIP, KBH,KHAI)
---
<br/>

### 1. 관리자 로그인
 
  - 관리자 로그인 아이디 비밀번호 만들기
  - 관리자 아이디 비밀번호 로그인
  - 아이디 비밀번호 로그인 버튼
  - ~~회원가입? x~~ <br>    유저 생성
  - ~~아이디 비밀번호 찾기 x~~
  - 로그인시에 관리자 메인 페이지
<br/>

---
<br/>

### 2. 관리자 메인페이지
 
  - 로그인시에 관리자 메인페이지(공지사항, 주의사항)
  - 공지 주의사항 수정 버튼
  - 왼쪽 상단 관리자 페이지 클릭시 메인페이지 이동
<br/>

---
<br/>

### 3. 메뉴
 
  - 회원관리
  - 코인 관리
<br/>
  회원관리: 유저의 정보를 관리<br/>
  회원관리: 유저의 정보를 관리<br/>
  <br/>
  
  - 코인 메뉴 방방
      1. 코인 관리 -> API , KBH , KHAI 목록 버튼 나오게 한다
      2.  API , KBH , KHAI 의 버튼을 만든다
  
  각 해당코인의 쉬운접근으로 2번을 선택했다

  
---
<br/>

### 4. 회원관리

  1. 한페이지에 모든 정보를 담을것인지 (보여줄 정보가 적으면 효율이 높음)
  2. 기본정보를 보이고 , 아이디 이름 고유번호를 클릭시 유저의 상세 정보 확인
<br/>
  1번은 관리할 코인의 수가 적으면 좋은 방법인것 같다 하지만 많아지면 가독성이 떨어질것같다<br/>
  관리할 코인을 3개라고 가정하면 2번으로 각각의 코인의 보유량 거래내역을 보여주는 페이지를 만드는것이 좋아보입니다.
<br/>
<br/>

  - 목록
    * 회원 고유번호
    * 아이디
    * 비밀번호
    * 각코인 보유량
    * 거래량
    * 최근 로그인
    * 최근 로그아웃
    * 회원가입 날짜
    * 이름
    * 전화번호
    * 회원 탈퇴 (잘못누를수있으니 alear 창)

  
---
<br/>

### 5. 코인관리

  - 코인의 거래내역을 볼수있는 페이지
  - 거래한 유저의 아이디를 볼수있다
  - 거래한 유저의 아이디 클릭시 회원 정보의 유저의 상세 정보로 이동
  <br/>
  
  - 목록
    * 총 발행량
    * 유통량
    * 소각량
    * 현재시가
    * 최근 거래 로그 (가격 , 아이디 ,날짜 시간, 구매 판매, 수량)
  
  
---
