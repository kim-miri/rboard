import { Box, Button, Stack, Typography } from "@mui/material";

export default function PostFormImageUploader({
  uploading,
  imageName,
  handleImageChange,
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Button variant="outlined" component="label" size="small">
          이미지 선택
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>

        {uploading && (
          <Typography variant="body2" color="text.secondary">
            업로드 중...
          </Typography>
        )}

        {!uploading && imageName && (
          <Typography variant="body2" color="text.primary">
            {imageName}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
