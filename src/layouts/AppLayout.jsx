import { Outlet, Link, useNavigate } from "react-router";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuth } from "../api/authApi";
import { useMe } from "../hooks/useMe";

export default function AppLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: me, isLoading } = useMe();
  
  const handleLogout = () => {
    clearAuth();
    // invalidateQueries() 캐시를 무효화하고 재조회를 시도. 로그아웃인데 재조회하면 안 됨
    qc.setQueryData(["me"], null); // 즉시 UI 반영
    navigate("/posts");
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fb" }}>
      {/* 상단 헤더 */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "#f7faff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* 로고 영역 (좌측) */}
            <Box
              component={Link}
              to="/posts"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              {/* 로고 텍스트 */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1f2933" }}
              >
                게시판
              </Typography>
            </Box>

            {/* 오른쪽 메뉴: 회원가입 / 로그인 */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              {!isLoading &&
                (me ? (
                <Button
                  variant="text"
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  로그아웃
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/auth/login"
                    variant="text"
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    로그인
                  </Button>

                  <Button
                    component={Link}
                    to="/auth/register"
                    variant="text"
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    회원가입
                  </Button>
                </>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 본문 영역 */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
