import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteEslint from 'vite-plugin-eslint';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEslint({
      failOnError: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') //设置路径别名，需要引用/src下面的文件时只需要在前面添加@即可
    },
    extensions: ['.js', '.ts', '.json'] // 导入时想要省略的扩展名列表
  },
  css: {
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        // 文件路径，注意最后需要添加 ';'
        additionalData: '@import "@/globalVariable.scss";',
        javascriptEnabled: true
      }
    },
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  server: {
    https: {
      key: './cert/server.key',
      cert: './cert/server.crt'
    },
    proxy: {
      '/socket/': {
        secure: false,
        target: 'https://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/socket\//, '/'),
        ws: true
      },
      '/api': {
        secure: false,
        target: 'https://localhost:3000/user',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/')
      },
      '/public': {
        secure: false,
        target: 'https://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public/, '/')
      }
    }
  }
});
