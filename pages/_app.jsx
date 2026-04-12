// pages/_app.jsx
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e2f',
            color: '#fff',
            border: '1px solid #2a2a3e',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
