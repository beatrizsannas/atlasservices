import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Optimize chunking for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks - separate React from other vendors
            'react-vendor': ['react', 'react-dom'],
            'supabase': ['@supabase/supabase-js'],
            // Group related components
            'auth-components': [
              './components/Login',
              './components/SignUp',
              './components/ForgotPassword',
              './components/NewPassword',
              './components/Welcome',
              './components/SignUpSuccess',
              './components/EmailSentSuccess',
              './components/EmailSentError',
            ],
            'admin-components': [
              './components/Settings',
              './components/Premium',
              './components/CompanyDetails',
              './components/UserProfile',
            ],
          },
        },
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 600,
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
        },
      },
      // Optimize CSS
      cssCodeSplit: true,
      // Source maps for debugging (disable for production if needed)
      sourcemap: false,
    },
    // Optimize deps
    optimizeDeps: {
      include: ['react', 'react-dom', '@supabase/supabase-js'],
    },
  };
});
