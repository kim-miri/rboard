import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { login, setAuth } from "../../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  /* 로그인 전
    useMe() → { data: null }  // 비로그인 상태
    로그인 후 (토큰 저장됨)
    useMe()가 자동으로 fetchMe() 호출
    useMe() → { data: { id: 1, email: "...", nickname: "..." } }
  */  
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setAuth(data); // 토큰 저장 { accessToken, tokenType? } localStorage 등에 저장
      await qc.invalidateQueries({ queryKey: ["me"] });
      navigate("/posts");// 사용자 정보 갱신 완료 후 이동. 갱신 전에 이동할 수 있음 (타이밍 이슈)
    },
  });

  // 이벤트 핸들러: 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    // 입력을 다시 시도할 때 이전 에러 표시를 초기화하고 싶으면(선택)
    // loginMutation.reset();

    // FormData API: 폼 요소에서 입력값을 쉽게 읽어옴 .get("name")
    // 서버에서만 검증하므로 별도의 프론트 검증은 없음
    const fd = new FormData(e.currentTarget);
    loginMutation.mutate({
      email: String(fd.get("email")).trim(),
      password: String(fd.get("password")),
    });
  };

  const errorMessage =
    loginMutation.error?.response?.data?.message ||
    loginMutation.error?.message ||
    "로그인에 실패했습니다.";

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          이메일과 비밀번호를 입력하세요
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="m@example.com"
              fullWidth
              size="small"
              required
              onChange={() => {
                // 입력 시작하면 기존 에러 숨기기(선택)
                if (loginMutation.isError) loginMutation.reset();
              }}
            />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2">Password</Typography>
                <Button variant="text" size="small" sx={{ p: 0, minWidth: 0 }}>
                  비밀번호를 잊으셨나요?
                </Button>
              </Box>
              <TextField
                name="password"
                type="password"
                fullWidth
                size="small"
                required
                onChange={() => {
                  if (loginMutation.isError) loginMutation.reset();
                }}
              />
            </Box>

            {loginMutation.isError && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#111",
                },
              }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </Button>

            <Divider sx={{ my: 2 }}>OR</Divider>

            <Button
              fullWidth
              variant="outlined"
              sx={{
                py: 1.1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "medium",
                gap: 1,
              }}
              // onClick={...}  // 나중에 Google OAuth 연결
            >
              <i className="bx bxl-google" style={{ fontSize: 20 }} />
              네이버로 로그인 하기
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          계정이 없으신가요?{" "}
          <Typography
            variant="body1"
            component={Link}
            to="/auth/register"
            sx={{ textDecoration: "none" }}
          >
            회원가입
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
