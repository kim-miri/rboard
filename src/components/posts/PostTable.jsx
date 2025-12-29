import { Link } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';

export default function PostTable({ posts }) {
  const rows = posts ?? [];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                borderBottom: '1px solid #e5e7eb',
                fontSize: 13,
                fontWeight: 600,
                color: '#9ca3af',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              },
            }}
          >
            <TableCell align="center" width={80}>번호</TableCell>
            <TableCell>제목</TableCell>
            <TableCell align="center" width={160}>작성자</TableCell>
            <TableCell align="center" width={100}>조회수</TableCell>
            <TableCell align="center" width={180}>작성일</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(({ id, title, author, readCount, createdAt }) => (
            <TableRow
              key={id}
              hover
              sx={{
                cursor: 'pointer',
                '& td': { borderBottom: '1px solid #f3f4f6', fontSize: 14 },
              }}
            >
              <TableCell align="center">{id}</TableCell>

              <TableCell>
                <Typography
                  component={Link}
                  to={`/posts/${id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {title}
                </Typography>
              </TableCell>

              <TableCell align="center">
                {author?.nickname && author.nickname !== '익명' ? (
                  <Chip
                    label={author.nickname}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      px: 2,
                      height: 28,
                      fontSize: 13,
                      fontWeight: 500,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  />
                ) : (
                  <Typography sx={{ fontSize: 14 }}>
                    {author?.nickname || '익명'}
                  </Typography>
                )}
              </TableCell>

              <TableCell align="center">{readCount}</TableCell>

              <TableCell align="center" sx={{ color: '#6b7280' }}>
                {new Date(createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                게시글이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}