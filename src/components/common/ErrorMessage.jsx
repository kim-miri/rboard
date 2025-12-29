export default function ErrorMessage({ message = '에러가 발생했습니다.' }) {
  return <div style={{ color: 'red' }}>{message}</div>;
}
