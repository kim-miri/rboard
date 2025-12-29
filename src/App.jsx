import { RouterProvider } from 'react-router';
import { router } from './app/router';
import 'boxicons/css/boxicons.min.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;