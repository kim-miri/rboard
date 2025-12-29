import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, fetchPostDetail, updatePost } from "../../api/postsApi";
import { uploadImage } from "../../api/filesApi";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { Box, Paper, Stack } from "@mui/material";

import PostFormTitle from "../../components/posts/PostFormTitle";
import PostFormFields from "../../components/posts/PostFormFields";
import PostFormImageUploader from "../../components/posts/PostFormImageUploader";
import PostFormSubmitButton from "../../components/posts/PostFormSubmitButton";

// 새 글 작성 (create), 기존 글 수정 (edit)
export default function PostFormPage({ mode }) {
  // mode가 "edit"이면 수정 모드, 그 외는 작성 모드
  // 폼 컴포넌트를 하나만 만들고, “신규”냐 “수정”이냐만 다르게 처리
  const isEdit = mode === "edit";
  const { id } = useParams();
  const postId = Number(id);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageName, setImageName] = useState(""); // 선택한 파일 이름

  // 수정 모드일 때 기존 데이터 가져오기
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostDetail(postId),
    enabled: isEdit, // isEdit이 true일 때만 이 쿼리가 동작. “작성 모드”에서는 굳이 기존 글을 가져올 필요가 없으니까
  });

  // 사이드 이펙트: 렌더링 후에 해야 하는 부가 작업 처리
  // “수정 화면”에 들어왔을 때 기존 글 내용을 폼에 자동 채워 넣기
  useEffect(() => {
    if (isEdit && post) {
      // post는 처음 렌더링 때 undefined일 수 있기 때문에 바로 구조분해하면 에러가 난다. 가장 안전한 방식은 const { ... } = post ?? {}; 형태
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.imageUrl || "");
    }
  }, [isEdit, post]); // 수정 모드이고, 서버에서 글 데이터를 받아온 뒤

  // ---------------- 생성 Mutation ----------------
  const createMutation = useMutation({
    mutationFn: createPost, // 호출해서 글을 생성
    onSuccess: (created) => {
      // 성공하면 “목록 쿼리” 캐시를 무효화 → 다음에 목록을 다시 가져오게 됨
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${created.id}`);
    },
    onError: () => {
      alert("게시글 등록에 실패했습니다.");
    },
  });

  // ---------------- 수정 Mutation ----------------
  const updateMutation = useMutation({
    // id와 payload를 같이 보냄
    mutationFn: (payload) => updatePost(postId, payload),
    onSuccess: (updated) => {
      // 목록 쿼리 무효화: ["posts"]
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // 해당 글 상세 쿼리 무효화: ["post", postId]
      queryClient.invalidateQueries({ queryKey: ["post", postId] }); // 둘 다 최신 데이터로 다시 요청하도록
      navigate(`/posts/${updated.id}`);
    },
    onError: () => {
      alert("게시글 수정에 실패했습니다.");
    },
  });

  // ---------------- 이미지 업로드 ----------------
  async function handleImageChange(e) {
    // 사용자가 고른 파일 중 첫 번째 파일
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 이름 저장. UI에서 파일 이름을 보여주기 위해
    setImageName(file.name);

    // 파일 크기 체크 (5MB) 서버/스토리지 비용, 응답 속도 때문에
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지는 5MB 이하만 가능합니다.");
      return;
    }

    try {
      // 업로드 중 표시
      setUploading(true);
      const result = await uploadImage(file);

      setImageUrl(result.imageUrl);
    } catch {
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  } // 화면 연결: <input hidden onChange={handleImageChange} />

  // ---------------- 폼 제출 ** 핵심 ----------------
  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl || null, // 서버에서 null과 ""을 다르게 처리할 수 있음. “이미지가 없다”라는 의미를 명확히 하기 위해
    };

    // 필수값 검증
    if (!title.trim() || !content.trim()) {
      alert("제목/내용을 입력하세요.");
      return;
    }

    // 모드에 따라 mutation 호출
    if (isEdit) updateMutation.mutate(payload); // 수정 모드
    else createMutation.mutate(payload); // 작성 모드
  }

  // 수정 모드일 때만 로딩/에러 표시
  if (isEdit && isLoading) return <Loader />;
  if (isEdit && isError) return <ErrorMessage message="불러오지 못했습니다." />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        px: 2,
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
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
          bgcolor: "background.paper",
        }}
      >
        <PostFormTitle isEdit={isEdit} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            
            <PostFormFields
              title={title}
              content={content}
              setTitle={setTitle}
              setContent={setContent}
            />

            <PostFormImageUploader
              uploading={uploading}
              imageName={imageName}
              handleImageChange={handleImageChange}
            />

            <PostFormSubmitButton isEdit={isEdit} />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
