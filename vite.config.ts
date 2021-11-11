import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'ServerDataGrid',
      fileName: (format) => `server-data-grid.${format}.js`
    },
    rollupOptions: {
      external: [
        "@apollo/client",
        "@emotion/react",
        "@emotion/styled",
        "@mui/lab",
        "@mui/material",
        "@mui/x-data-grid",
        "@tabler/icons",
        "graphql",
        "lodash",
        "notistack",
        "pluralize",
        "react",
        "react-dom",
        "react-hook-form",
        "react-router-dom",
        "sentence-case",
        "title-case",
      ],
      output: {
        globals: {
          react: 'React',
          '@mui/material': 'MaterialUI',
          '@apollo/client': 'ApolloClient',
          '@mui/lab': 'MaterialUILab'
        }
      }
    }
  }
})
