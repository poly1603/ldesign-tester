# 配置生成

@ldesign/tester 可以自动生成测试框架的配置文件，让你快速启动测试环境。

## Vitest 配置

### 基础配置

```bash
npx ldesign-test init vitest
```

生成的 `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    exclude: [
      'node_modules',
      'dist',
      'coverage',
    ],
  },
})
```

### 带覆盖率配置

```typescript
import { createConfigGenerator } from '@ldesign/tester'

const generator = createConfigGenerator()

const config = generator.generateVitestConfig({
  environment: 'jsdom',
  globals: true,
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'json', 'lcov'],
    reportsDirectory: './coverage',
    thresholds: {
      global: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

### Vue 项目配置

```typescript
const config = generator.generateVitestConfig({
  environment: 'jsdom',
  globals: true,
  plugins: ['vue'], // 添加 Vue 插件
})

// 生成的配置会包含：
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    // ...
  },
})
```

### React 项目配置

```typescript
const config = generator.generateVitestConfig({
  environment: 'jsdom',
  globals: true,
  plugins: ['react'], // 添加 React 插件
})
```

## Playwright 配置

### 基础配置

```bash
npx ldesign-test init playwright --base-url http://localhost:3000
```

### 自定义配置

```typescript
import { createConfigGenerator } from '@ldesign/tester'

const generator = createConfigGenerator()

const config = generator.generatePlaywrightConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173',
  fullyParallel: true,
  retries: 2,
  trace: true,
  screenshot: true,
  video: true,
})
```

生成的配置：

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 多浏览器配置

```typescript
const config = generator.generatePlaywrightConfig({
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
})
```

## 测试环境配置

### Vue 测试 Setup

```typescript
const setupFile = generator.generateSetupFile('vue')
```

生成的 `tests/setup.ts`:

```typescript
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局配置
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Vue 测试配置
config.global.stubs = {
  Transition: false,
  TransitionGroup: false,
}
```

### React 测试 Setup

```typescript
const setupFile = generator.generateSetupFile('react')
```

生成的 `tests/setup.ts`:

```typescript
import { vi } from 'vitest'
import '@testing-library/jest-dom'

// 全局配置
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

## TypeScript 配置

```typescript
const tsConfig = generator.generateTsConfig()
```

生成的 `tsconfig.test.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": [
    "src/**/*.test.ts",
    "src/**/*.spec.ts",
    "tests/**/*.ts",
    "__tests__/**/*.ts"
  ]
}
```

## 完整示例

```typescript
import { createConfigGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const generator = createConfigGenerator()

// 1. 生成 Vitest 配置
const vitestConfig = generator.generateVitestConfig({
  environment: 'jsdom',
  globals: true,
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
  },
  plugins: ['vue'],
})

fs.writeFileSync('vitest.config.ts', vitestConfig)

// 2. 生成 Playwright 配置
const playwrightConfig = generator.generatePlaywrightConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173',
})

fs.writeFileSync('playwright.config.ts', playwrightConfig)

// 3. 生成测试 setup 文件
const setupFile = generator.generateSetupFile('vue')

fs.mkdirSync('tests', { recursive: true })
fs.writeFileSync('tests/setup.ts', setupFile)

// 4. 生成 tsconfig.test.json
const tsConfig = generator.generateTsConfig()
fs.writeFileSync('tsconfig.test.json', tsConfig)

console.log('✅ 所有配置文件已生成')
```

## package.json 脚本

生成配置后，建议在 `package.json` 中添加：

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

## 下一步

- [测试生成](/guide/test-generation)
- [Mock 系统](/guide/mock-system)
- [CI/CD 集成](/guide/ci-cd)



