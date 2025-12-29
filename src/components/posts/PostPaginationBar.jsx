import { Link } from 'react-router';
import { Stack, Button, Typography } from '@mui/material';

export default function PostPaginationBar({ page, totalPages, onPrev, onNext, logined }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mt: 3 }}
    >
      {/* 왼쪽: 페이지네이션 */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          disabled={page === 0}
          onClick={onPrev}
        >
          이전
        </Button>

        <Typography variant="body2">
          {page + 1} / {totalPages}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          disabled={page + 1 >= totalPages}
          onClick={onNext}
        >
          다음
        </Button>
      </Stack>

      {/* 오른쪽: 새 글 작성 버튼 (✅ 로그인한 사람만) */}
      {logined && (
        <Button
          component={Link}
          to="/posts/new"
          variant="contained"
          size="small"
          sx={{ borderRadius: 999, px: 3, fontWeight: 600 }}
        >
          새 글 작성
      </Button>
      )}
    </Stack>
  );
}