import { api } from "./api";

/*
 브라우저 저장소localStorage에서 JWT 토큰 가져오기
 로그인했는지 확인할 때 사용

 localStorage: 브라우저에 데이터를 영구 저장하는 공간
  - key-value 쌍으로 데이터 저장
  - 브라우저를 닫거나 새로 고침해도 데이터 유지. 직접 삭제해야 사라짐
  - 도메인별로 저장 공간 분리(보안)
  - 문자열만 저장 가능(객체는 JSON.stringify()로 변환 필요)
  - 용량 제한: 일반적으로 5~10MB
  - 자동 로그인, 설정 저장
*/
// QueryKey 상수: 데이터를 구분하는 "이름표". 같은 QueryKey면 같은 캐시 사용
// 나중에 useMe() 훅에서 사용
export const ME_QUERY_KEY = ["me"];

// Web Storage API의 메서드
// localStorage는 문자열만 저장 가능. 객체는 JSON.stringify()로 문자열 변환 필요
// 로컬 스토리지에서 토큰을 읽어옴
export function getToken() {
  return localStorage.getItem("accessToken");
}

// 로그인 성공 후 토큰을 저장
export function setAuth({ accessToken }) {
  localStorage.setItem("accessToken", accessToken);
}
// 로그아웃할 때 토큰 삭제. 401 에러 발생 시에도 호출
export function clearAuth() {
  localStorage.removeItem("accessToken");
}

// 현재 로그인한 사용자 정보 가져오기
// MyInfoResponse, me.id, me.nickname 사용
export async function fetchMe() {
  const res = await api.get("/api/auth/myinfo");
  return res.data;
}

// 로그인 요청. 이메일과 비밀번호를 서버에 전송. 성공하면 JWT 토큰 받음
// AuthResponse → accessToken 저장
export async function login({ email, password }) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;// 토큰 반환 { accessToken: "...", tokenType: "Bearer" }
}

// 회원가입 요청. 이메일, 비밀번호, 닉네임을 서버에 전송
export async function register({ email, password, nickname }) {
  await api.post("/api/auth/signup", { email, password, nickname });
   // return 없음 (성공/실패만 중요)
}
