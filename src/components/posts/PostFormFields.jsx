import { TextField } from "@mui/material";

export default function PostFormFields({ title, content, setTitle, setContent }) {
  return (
    <>
      <TextField
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />

      <TextField
        fullWidth
        multiline
        minRows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
      />
    </>
  );
}
