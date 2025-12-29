import { Typography } from "@mui/material";

export default function PostFormTitle({ isEdit }) {
  return (
    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, fontSize: 22 }}>
      {isEdit ? "게시글 수정" : "새 글 작성"}
    </Typography>
  );
}
