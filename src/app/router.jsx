// 라우터 트리 + loader들
import { createBrowserRouter, Navigate } from 'react-router';

import AppLayout from '../layouts/AppLayout';
import PostListPage from '../pages/posts/PostListPage';
import PostDetailPage from '../pages/posts/PostDetailPage';
import PostFormPage from '../pages/posts/PostFormPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';


// 루트 라우트 loader: 로그인 상태 가져오기


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        // 사용자가 사이트에 처음 들어와서 /에 오면 → 자동으로 /posts로 이동
        index: true,
        // 리다이렉트 컴포넌트. 여기 들어오면 /posts로 보내라”는 의미
        // 이렇게 작성하는 이유. 안그럼 RESTful URL 구조가 깨짐
        element: <Navigate to="posts" replace />,//replace: 히스토리 기록 남기지 않음. 브라우저 히스토리에서 현재 기록을 새 주소로 바꿈. 뒤로가기 눌렀을 때, 의미 없는 / 기록이 남지 않음
      },
      {
        path: 'posts',
        element: <PostListPage />,
      },
      {
        path: 'posts/new',
        // mode="create"라는 props로 상태를 구분
        // PostFormPage 안에서: mode가 "create"면 새 글 작성, "edit"면 글 수정
        element: <PostFormPage mode="create" />,
      },
      {
        path: 'posts/:id',// :id → 동적 파라미터
        // PostDetailPage 안에서: useParams() 훅으로 id 값 가져올 수 있음
        element: <PostDetailPage />,
      },
      {
        path: 'posts/:id/edit',
        element: <PostFormPage mode="edit" />,
      },
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: 'auth/register',
        element: <RegisterPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

