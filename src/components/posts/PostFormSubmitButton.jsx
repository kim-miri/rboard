import { Box, Button } from "@mui/material";

export default function PostFormSubmitButton({ isEdit }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        type="submit"
        variant="contained"
        sx={{ borderRadius: 999, px: 3, fontWeight: 600 }}
      >
        {isEdit ? "수정하기" : "등록하기"}
      </Button>
    </Box>
  );
}
