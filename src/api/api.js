import axios from 'axios';
import { getToken, clearAuth } from "./authApi";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

// HTTP 요청 관리를 담당하는 핵심 파일
// 요청 인터셉터 (Request Interceptor)
// 서버로 나가는 모든 요청에 JWT를 자동 추가
// 인터셉터 없으면 (반복 많음)
api.interceptors.request.use((config) => {
  const token = getToken(); // localStorage에서 토큰 가져오기
  if (token) config.headers.Authorization = `Bearer ${token}`; // 헤더 추가
  return config; // 수정된 설정 반환
});


// ✅ 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,// 성공 콜백, 200번대 응답
  (error) => {// 실패 콜백. 4xx, 5xx 에러
    // 401 Unauthorized 처리
    // 네트워크 에러는 response가 없어서 옵셔널 체이닝 사용
    // 서버 에러는 response가 있음
    if (error.response?.status === 401) {// error.response && error.response.status
      clearAuth();
      // 현재 페이지가 로그인 페이지가 아니면 리다이렉트
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';// 401은 "인증 실패" → 모든 상태 초기화 필요. 
      }
    }
    return Promise.reject(error);
  }
);

/*
401 에러 확인: 인증 실패
- 토큰이 없음
- 토큰이 만료됨
- 토큰이 유효하지 않음

// api 객체 구조
api = {
  get: function() { ... },
  post: function() { ... },
  put: function() { ... },
  delete: function() { ... },
  
  interceptors: {                    // ← 이게 원래 있는 속성
    request: {                       // ← 요청 인터셉터
      use: function() { ... },       // ← 원래 있는 메서드
      eject: function() { ... },
    },
    response: {                      // ← 응답 인터셉터
      use: function() { ... },       // ← 원래 있는 메서드
      eject: function() { ... },
    }
  }
}
*/