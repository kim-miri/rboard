import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPosts } from "../../api/postsApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import PostSearchBar from "../../components/posts/PostSearchBar";
import PostTable from "../../components/posts/PostTable";
import PostPaginationBar from "../../components/posts/PostPaginationBar";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import { useMe } from "../../hooks/useMe";

// 데이터 요청, page/keyword 상태 관리
export default function PostListPage() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", page, keyword],
    queryFn: () => fetchPosts({ page, size: 10, keyword }),
    placeholderData: keepPreviousData, // 페이지 전환 시 기존 데이터 유지. 페이지 이동 시 “깜빡” 빈 화면이 보이지 않고 UX가 부드럽게 유지됨
  });
  const { data: me, isLoading: meLoading } = useMe();

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;

  const { content, totalPages } = data;

  // 검색 submit 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
  };

  // 페이지 이동 핸들러
  const handlePrev = () => {
    setPage((no) => Math.max(no - 1, 0)); // 음수가 되지 않도록 보호. −1이 되면 안 되니까 자동으로 0 유지. 최소값을 0으로 막는 것
  };

  const handleNext = () => {
    // 마지막 페이지 이상은 넘어가지 못하게 막는 것
    setPage((no) => (no + 1 < totalPages ? no + 1 : no));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 980,
          borderRadius: 3,
          px: 4,
          py: 3,
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
          bgcolor: "background.paper",
        }}
      >
        {/* 상단 타이틀 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 24 }}>
            게시글 목록
          </Typography>
        </Box>

        {/* 검색 영역 */}
        <PostSearchBar
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSubmit={handleSearchSubmit}
        />

        {/* 테이블 영역 */}
        <PostTable posts={content} />

        {/* 페이지네이션 + 새 글 버튼 */}
        <PostPaginationBar
          page={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
          logined={!meLoading && !!me}// 사용자가 로그인했는지 확인하는 조건식
          // 로딩이 완료되었고 (NOT 로딩 중), 사용자 정보가 있음 (로그인 상태)
        />
      </Paper>
    </Box>
  );
}
