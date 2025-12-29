import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Alert
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../api/postsApi";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import { useMe } from "../../hooks/useMe";

export default function PostCommentsSection({ postId }) {
  const queryClient = useQueryClient();

  // ✅ 로그인 사용자 정보 (Hooks는 항상 상단에서)
  const { data: me, isLoading: meLoading } = useMe();
  const canWrite = !meLoading && !!me;

  // 댓글 목록 가져오기
  const {
    data: comments = [], 
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useQuery({
    queryKey: ["postComments", postId],
    queryFn: () => fetchComments(postId),
  });

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // ✅ 개선: 본인 확인 유틸 함수
  const checkIsMine = (authorId) => {
    return (
      !meLoading &&
      me?.id != null &&
      authorId != null &&
      Number(me.id) === Number(authorId)
    );
  };

  // 댓글 작성
  const createCommentMutation = useMutation({
    mutationFn: (content) => createComment(postId, { content }), // 서버에 보낼 때는 객체 형태로 서버에 새 댓글을 만든다
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    },
  });

  // 댓글 수정 update
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }) =>
      updateComment(postId, commentId, { content }),
    onSuccess: () => {
      // 댓글 목록 캐시 초기화 → 새로 불러오기
      setEditingId(null);
      setEditContent("");
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    },
  });

  // 댓글 삭제
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    },
  });

  // 댓글 작성 submit
  const handleNewComment = (e) => {
    e.preventDefault();
    if (!canWrite) return; // ✅ 비로그인 보호(서버가 막지만 UI도 막기)
    if (!newComment.trim()) return;
    createCommentMutation.mutate(newComment.trim());
  };

  // ✅ 개선: checkIsMine 함수 사용
  const handleStartEdit = (comment) => {
    // 본인 댓글인지 확인
    if (!checkIsMine(comment.author?.id)) return;

    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // 수정 저장
  const handleSaveEdit = (commentId) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate({ commentId, content: editContent.trim() }); // 수정 mutation 실행
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // 삭제 ✅ 개선: checkIsMine 함수 사용
  const handleDeleteComment = (commentId) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    // 본인 댓글인지 확인
    if (!checkIsMine(comment.author?.id)) return;

    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    deleteCommentMutation.mutate(commentId);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        댓글
      </Typography>

      {isCommentsLoading && <Loader />}
      {isCommentsError && (
        <ErrorMessage message="댓글을 불러오지 못했습니다." />
      )}

      {/* 댓글 리스트 */}
      {!isCommentsLoading &&
        !isCommentsError &&
        comments.map((comment) => {
          const { id, content, createdAt, author } = comment;

          // ✅ 본인 댓글 여부 checkIsMine 함수 사용
          const isMine = checkIsMine(author?.id);
          
          return (
            <Paper key={id} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
              {editingId === id ? (
                // 수정 모드
                <>
                  <TextField
                    fullWidth
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleSaveEdit(id)}
                      disabled={updateCommentMutation.isPending}
                    >
                      저장
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancelEdit}
                    >
                      취소
                    </Button>
                  </Stack>
                </>
              ) : (
                // 보기 모드
                <>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {content}
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {author?.nickname || "알 수 없음"}
                      {createdAt
                        ? ` · ${new Date(createdAt).toLocaleString()}`
                        : ""}
                    </Typography>

                    {/* ✅ 본인 댓글일 때만 버튼 표시 */}
                    {isMine && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() => handleStartEdit(comment)}
                          disabled={updateCommentMutation.isPending}
                        >
                          수정
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteComment(id)}
                          disabled={deleteCommentMutation.isPending}
                        >
                          삭제
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </>
              )}
            </Paper>
          );
        })}

      {/* 댓글 작성 폼 - 로그인 상태에만 표시 */}
      {canWrite ? (
        // 로그인: 입력창 보임
        <Box component="form" onSubmit={handleNewComment} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="댓글 내용을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={createCommentMutation.isPending}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: 999 }}
              disabled={createCommentMutation.isPending || !newComment.trim()}
            >
              댓글 등록
            </Button>
          </Box>
        </Box>
      ) : (
        // 비로그인: 안내 메시지
        <Alert severity="info" sx={{ mt: 2 }}>
          댓글을 작성하려면 로그인해주세요.
        </Alert>
      )}
    </Box>
  );
}
