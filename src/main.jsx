import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,       
      staleTime: 1000 * 60 * 5, 
    }
  }
});

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <CssBaseline />
    <App />
  </QueryClientProvider>
)