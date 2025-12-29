import { api } from './api';

// 게시글 목록
export async function fetchPosts({ page = 0, size = 10, keyword = '' }) {
  const params = { page, size };
  if (keyword && keyword.trim() !== '') {
    params.keyword = keyword;
  }
  const res = await api.get('/api/posts', { params });
  return res.data;
}

// 게시글 상세
export async function fetchPostDetail(id) {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
}

// 게시글 생성
export async function createPost(payload) {
  const res = await api.post('/api/posts', payload);
  return res.data;
}

// 게시글 수정
export async function updatePost(id, payload) {
  const res = await api.put(`/api/posts/${id}`, payload);
  return res.data;
}

// 게시글 삭제
export async function deletePost(id) {
  await api.delete(`/api/posts/${id}`);
}


/* ===== 댓글 API ===== */
// 댓글 목록 조회
export async function fetchComments(postId) {
  const res = await api.get(`/api/posts/${postId}/comments`);
  return res.data;
}

// 댓글 작성
export async function createComment(postId, payload) {
  const res = await api.post(`/api/posts/${postId}/comments`, payload);
  return res.data;
}

// 댓글 수정
export async function updateComment(postId, commentId, payload) {
  const res = await api.put(`/api/posts/${postId}/comments/${commentId}`, payload);
  return res.data;
}

// 댓글 삭제
export async function deleteComment(postId, commentId) {
  await api.delete(`/api/posts/${postId}/comments/${commentId}`);
}