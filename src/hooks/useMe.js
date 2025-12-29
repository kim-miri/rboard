import { useQuery } from "@tanstack/react-query";
import { fetchMe, getToken, ME_QUERY_KEY } from "../api/authApi";

// 현재 로그인한 사용자 정보 가져오는 커스텀 훅
export function useMe() {
  const token = getToken();

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    enabled: !!token,   // ✅ 토큰 있을 때만 실행
    retry: false,         // 401 재시도 방지
    staleTime: 60 * 1000,    // 1분 정도 캐시(선택)
  });
}
