# 관리자 페이지 만들기
---
개발 순서

VM 우분투 리눅스 설치                                      
vscode에서 remote development
리눅스에 mysql 구축

nginx 설치 및 설정
express 설치

mysql 연동 connect

암호화 bcrypt

세션 JWT
token 저장 ( cookie , localStorage)
token 검증하여 만료시간 재설정 , 재발급

---
## 시작하기

> Ubuntu 20.04.2 LTS <br>
> Node.js v10.13.0 <br>
> npm 6.4.1 <br>
> mysql v8.0.25 <br>
환경에서 작성되었습니다.

### 설치하기

- `nodejs` 와 `npm` 을 설치합니다.
- Node.js 10.13.0 버전을 설치합니다..
- sudo apt-get update <br>
  sudo apt-get -y install mysql-server mysql-client 
- 실행에 필요한 의존성을 설치합니다.


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

```
  npm install
```
 ### 실행하기

```
  npm start
```
- `http://13.250.110.198/`으로 접속이 가능합니다 
- env example


### database schema


---
## 1. 구조

### 토큰 전송

- 전송
> 리스트에서 선택<br>
> -> 토큰 심볼 , 컨트렉  주소 선택<br>
> -> 보낼 코인 수량 입력-<br>
> -> 전송 버튼<br>
- 전송 내역 조회
> 토큰 리스트 (컨드렉 주소 ,토큰 심볼 )<br>
> -> 토큰 심볼 , 토큰 주소 검색<br>
> -> 선택<br>
> -> 해당 토큰 전송 내역<br>

### 토큰 락업

- 락업 
> 리스트에서  선택 <br>
> -> 해당 토큰 주소리스트 ( 주소, 해당주소 밸런스)<br>
> -> 주소 선택 <br>
> -> 해당 주소 락업량을 입력<br>
> -> 락업 버튼<br>


- 락업 내역 조회
> -> 각줄 토큰에 몇개의 락업이 걸렸는지<br>
> -> 토큰을 검색 <br>
> -> 클릭하면<br>
> -> 토큰의 락업 내역 (각줄 주소 , 락업량 , 언제 락업을 했는지 날짜)<br>

### 토큰 소각

- 소각 
> 리스트 에서 토큰을 선택 <br>
> -> 해당 토큰 소각량을 입력하고 소각 주소를 입력<br>
> -> 소각 버튼 <br>

- 소각 내역 조회
> -> 각줄에 토큰이름 , 총 소각량<br>
> -> 토큰 이름을 클릭 <br>
> -> 해당 토큰 소각 내역 ( 소각 주소 , 소각량 , 시행 날짜 )면<br>

### 관리자 설정

- 관리자 권한 리스트 (idx , 지갑주소 , 등록일 )
  * 회원 고유번호
  > 지갑주소 조회버튼<br>
  > -> 내주소 입력됨 , 검색<br>
  > -> 아이디 입력 <br>
  > -> 추가 버튼<br>
  > -> 리스트에 등록됨<br>

  * 회원 고유번호
  > 해당주소 , 아이디 입력<br>
  > -> 검색<br>
  > -> 해당 주소 , 아이디  선택<br>
  > -> 제거 버튼<br>

- 관리자  내역
> 관리자 내역 리스트 ( idx , 지갑주소  , [등록 , 제거] , 시행날짜) <br>

---

## 2. Route

-로그인 
> router :  /send/list 

-전송 리스트
> router :  /send/list
-토큰 선택시 전송 
> router :  /send/list/info?symbol='토큰심볼'
-전송내역 리스트
> router :  /send/log/list
-전송내역 리스트 토큰 선택
> router :  /send/log/list/info?symbol='토큰심볼'

-토큰 락업 리스트
> router :  /lockup/list
-토큰 선택시 락업 
> router :  /lockup/list/info?symbol='토큰심볼'
-락업 내역 리스트
> router :  /lockup/log/list
-락업 내역 상세
> router :  /lockup/log/list/info?symbol='토큰심볼'

-토큰 소각 리스트
> router :  /burn/list
-토큰 선택시 소각 
> router :  /burn/list/info?symbol='토큰심볼'
-소각 내역 조회 리스트
> router :  /burn/log/list
-토큰 클릭시 상세
> router :  /burn/log/list/info?symbol='토큰심볼'

-관리자 설정 권한 리스트
> router :  /admin/list
-관리자 검색
> router :  /admin/list/info?email=?
-관리자 추가
> router :  /admin/list/add
-관리자 제거
> router :  /admin/list/remove
-관리자 내역
> router :  /admin/log/list

---

## 3.Controller 

-토큰 전송 
- 전체 전송 리스트 페이지
> method : get<br>
> router :  /send/list<br>
> render sendlistpage<br>

- 리스트 불러오기
> method : post<br>
> router :  /send/list<br>
> mysql : select  from table<br>

- 전송 리스트 심볼 검색
> method : get<br>
> router :  /send/list/info?symbol='토큰심볼'<br>
> 해당토큰 <br>
> mysql : select  from table where symbol= ?<br>


- 심볼클릭 ( 해당토큰 전송)
> method : post<br>
> router :  /send/list/info?symbol='토큰심볼'<br>
> 메타마스크 실행 ?<br>
> 토큰 컨트렉 주소 를 넘길수있을까?<br>

-전송 내역 페이지
> method : get<br>
> router :  /send/log/list<br>
> render sendloglistpage<br>

- 전속 내역 불러오기
> method : post<br>
> router :  /send/log/list<br>
> axios<br>
> mysql : select from table<br>

- 전송 내역 심볼 검색 
> method : get<br>
> router :  /send/log/list?symbol='토큰심볼'<br>
> axios<br>
> mysql : select from table where symol = ?<br>

- 심볼 클릭 (해당 토큰 전송 내역)
> method : post<br>
> router :  /send/log/list?symbol='토큰심볼'<br>



-토큰 락업
- 전체 락업 리스트 페이지
> method : get<br>
> router :  /lockup/list<br>
> render lockuplistpage<br>

- 전체 락업 리스트 불러오기
> method : post<br>
> router :  /lockup/list<br>
> axios<br>
> mysql : select from table<br>

-토큰 선택시 락업 페이지
- 관리자 권한으로 해당 토큰 락업
> method : get<br>
> router :  /lockup/list/info?symbol='토큰심볼'<br>

- 락업 리스트 페이지
> method : get<br>
> router :  /lockup/log/list<br>
> render lockuploglist<br>

- 락업 리스트 전체 락업량 불러오기
> method : post<br>
> router :  /lockup/log/list<br>
> axios<br>
> mysql : select from table<br>

- 해당토큰 검색 , 선택시 (각 주소마다 락업량)
> method : get<br>
> router :  /lockup/log/list/info?symbol='토큰심볼'<br>
> axios<br>
> mysql : select from table where symbol = ?<br>


-토큰 소각
- 전체 소각 리스트 페이지
> method : get<br>
> router :  /burn/list<br>
> render burnlistpage<br>

- 전체 소각 리스트 불러오기
> method : post<br>
> router :  /burn/list<br>
> axios<br>
> mysql : select from table<br>
  
---
