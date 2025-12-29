import { Box, Typography, Divider } from "@mui/material";

export default function PostDetailContent({ post, apiBase }) {
  const { content, imageUrl } = post;
  const imageSrc = imageUrl ? `${apiBase}${imageUrl}` : null;

  return (
    <>
      {imageSrc && (
        <Box sx={{ mb: 2, borderRadius: 2, overflow: "hidden", border: "1px solid #e5e7eb", maxWidth: 400 }}>
          <img src={imageSrc} alt="첨부 이미지" style={{ width: "100%", display: "block" }} />
        </Box>
      )}

      <Typography
        component="p"
        sx={{
          whiteSpace: "pre-wrap",
          mb: 4,
          fontSize: 15,
          lineHeight: 1.7,
        }}
      >
        {content}
      </Typography>

      <Divider sx={{ mb: 2.5 }} />
    </>
  );
}
