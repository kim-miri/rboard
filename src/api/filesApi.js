import { api } from './api';

//이미지 업로드 API
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file); // key 이름: file

  const res = await api.post('/api/files/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data; // { imageUrl: "..." }
}
