import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPostDetail, deletePost } from "../../api/postsApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { Box, Paper, Divider } from "@mui/material";
import PostDetailHeader from "../../components/posts/PostDetailHeader";
import PostDetailContent from "../../components/posts/PostDetailContent";
import PostDetailActions from "../../components/posts/PostDetailActions";
import PostCommentsSection from "../../components/comments/PostCommentsSection";
import { useMe } from "../../hooks/useMe";

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const { data: me, isLoading: meLoading } = useMe();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostDetail(postId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts");
    },
  });

  if (isLoading) return <Loader />;
  if (isError || !post)
    return <ErrorMessage message="존재하지 않는 게시글입니다." />;

  // ✅ 본인 글 여부 (me 기반)
  const myId = me?.id;
  const authorId = post?.author?.id;

  const loginedEdit =
    !meLoading &&
    myId != null &&
    authorId != null &&
    Number(authorId) === Number(myId);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 3,
          px: 4,
          py: 3,
          bgcolor: "background.paper",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
        }}
      >
        <PostDetailHeader post={post} />
        <PostDetailContent post={post} apiBase={apiBase} />

        {/* -------- 댓글 영역 (컴포넌트) -------- */}
        <PostCommentsSection postId={postId} />
        <Divider sx={{ mb: 3 }} />

        <PostDetailActions
          id={id}
          deleteMutation={deleteMutation}
          loginedEdit={loginedEdit}
        />
      </Paper>
    </Box>
  );
}
