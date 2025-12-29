import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        불러오는 중...
      </Typography>
    </Box>
  );
}