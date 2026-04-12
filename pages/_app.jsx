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
            background: '#0a0a0a',
            color: '#00ffff',
            border: '1px solid #00ffff40',
            fontFamily: 'monospace',
          },
          success: {
            iconTheme: { primary: '#00ff00', secondary: '#0a0a0a' },
          },
          error: {
            iconTheme: { primary: '#ff3333', secondary: '#0a0a0a' },
          },
        }}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
