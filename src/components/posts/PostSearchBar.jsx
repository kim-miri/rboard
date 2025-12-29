import { Box, TextField, Button } from '@mui/material';

export default function PostSearchBar({ keyword, onChangeKeyword, onSubmit }) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}
    >
      <TextField
        type="text"
        size="small"
        placeholder="제목 또는 내용 검색"
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        sx={{ width: 260 }}
      />
      <Button type="submit" variant="outlined" size="small" sx={{ borderRadius: 999 }}>
        검색
      </Button>
    </Box>
  );
}