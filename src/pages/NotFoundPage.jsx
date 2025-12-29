import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: 80, fontWeight: 700, color: '#94a3b8' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: '#64748b' }}>
          페이지를 찾을 수 없습니다
        </Typography>
        <Typography sx={{ mb: 4, color: '#94a3b8' }}>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </Typography>
        <Button component={Link} to="/posts" variant="contained">
          홈으로 이동
        </Button>
      </Box>
    </Container>
  );
}