import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    dir: 'dist',
  },
  dts: true,
  external: [
    // 测试框架
    'vitest',
    '@playwright/test',
    '@vue/test-utils',
    '@testing-library/react',
    '@testing-library/vue',
    'supertest',

    // Mock 相关
    '@faker-js/faker',
    'msw',
    'msw/browser',
    'msw/node',

    // 性能测试
    'tinybench',
    'autocannon',
    'lighthouse',
    'chrome-launcher',
    'web-vitals',

    // 视觉回归
    '@percy/playwright',
    'pixelmatch',
    'pngjs',

    // Dashboard
    'express',
    'better-sqlite3',
    'chart.js',

    // CLI
    'commander',
    'ejs',

    // Node.js 内置模块
    'node:fs',
    'node:path',
    'node:url',
    'node:crypto',
    'node:os',
    'node:process',
  ],
  sourcemap: true,
  minify: false,
})



