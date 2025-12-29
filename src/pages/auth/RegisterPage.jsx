import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { register } from "../../api/authApi";

/*
왜 다른 방식을 사용하나?
- LoginPage: 입력값이 2개라 FormData가 간단
- RegisterPage: 입력값이 4개라 form 상태 관리가 더 명확
프론트 + 서버 검증
- 비밀번호 일치 여부는 프론트에서 미리 검증
- 나머지 검증(이메일 형식, 닉네임 중복 등)은 서버에서 처리
*/
export default function RegisterPage() {
  const navigate = useNavigate();

  // ✅ form은 유지 (입력값 비교가 필요). 4개 입력 필드를 하나의 객체로 관리
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => navigate("/posts"),
    // 패턴 2: 자동 로그인 (편리)
    // onSuccess: () => {
    //   setAuth(data.accessToken);
    //   navigate("/posts");
    // },
  });

  // 이벤트 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 입력 시작하면 이전 서버 에러 숨기기(선택)
    if (registerMutation.isError) registerMutation.reset();
    setForm((prev) => ({ ...prev, [name]: value })); // 이전 상태 복사 후 변경된 필드만 업데이트
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ 프론트 검증(가장 단순) 서버에 보내기 전에 프론트에서 체크
    if (form.password !== form.confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    registerMutation.mutate({
      email: form.email.trim(),
      password: form.password,
      nickname: form.nickname.trim(),
    });
  };

  const errorMessage =
    registerMutation.error?.response?.data?.message ||
    registerMutation.error?.message ||
    "회원가입에 실패했습니다.";

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
          회원가입
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {/* name이 없으면 각 필드마다 핸들러 필요 */}
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="m@example.com"
              fullWidth
              size="small"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Nickname"
              name="nickname"
              fullWidth
              size="small"
              value={form.nickname}
              onChange={handleChange}
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              size="small"
              value={form.password}
              onChange={handleChange}
              required
            />

            <TextField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              fullWidth
              size="small"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            {/* ✅ PostListPage처럼 간단: mutation 에러만 표시 */}
            {registerMutation.isError && (
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "가입 중..." : "회원가입"}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            계정을 가지고 있습니까?{" "}
            <Button component={Link} to="/auth/login" underline="hover">
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
