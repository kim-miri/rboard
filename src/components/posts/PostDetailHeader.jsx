import { Typography, Box, Chip, Divider } from "@mui/material";

export default function PostDetailHeader({ post }) {
  const { title, author, readCount, createdAt, updatedAt } = post;

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 24, mb: 1.5 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: "#666" }}>
          작성자:{" "}
          {author?.nickname && author.nickname !== "익명" ? (
            <Chip
              label={author.nickname}
              size="small"
              sx={{
                ml: 0.5,
                px: 1.5,
                borderRadius: 999,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            />
          ) : (
            <span>{author?.nickname || "익명"}</span>
          )}
          &nbsp;|&nbsp; 조회수: {readCount}
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ color: "#999", display: "block", mb: 2 }}>
        작성일: {new Date(createdAt).toLocaleString()}
        {updatedAt && <> | 수정일: {new Date(updatedAt).toLocaleString()}</>}
      </Typography>

      <Divider sx={{ mb: 3 }} />
    </>
  );
}
