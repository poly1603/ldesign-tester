# ConfigGenerator

配置文件生成器，用于生成测试框架的配置文件。

## 创建实例

```typescript
import { createConfigGenerator } from '@ldesign/tester'

const generator = createConfigGenerator()
```

## 方法

### generateVitestConfig

生成 Vitest 配置文件。

**签名：**

```typescript
generateVitestConfig(options?: VitestOptions): string
```

**参数：**

- `options` - Vitest 配置选项
  - `environment?` - 测试环境（`'node'` | `'jsdom'` | `'happy-dom'`），默认 `'jsdom'`
  - `globals?` - 是否启用全局变量，默认 `true`
  - `coverage?` - 覆盖率配置
    - `provider?` - 覆盖率提供商（`'v8'` | `'istanbul'` | `'c8'`），默认 `'v8'`
    - `reporter?` - 报告格式，默认 `['text', 'json', 'html']`
    - `reportsDirectory?` - 报告目录，默认 `'./coverage'`
    - `exclude?` - 排除文件
    - `thresholds?` - 覆盖率阈值
  - `include?` - 包含的测试文件
  - `exclude?` - 排除的文件
  - `plugins?` - 插件列表

**返回值：**

生成的配置文件内容

**示例：**

```typescript
const config = generator.generateVitestConfig({
  environment: 'jsdom',
  globals: true,
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'json'],
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  plugins: ['vue'],
})

// 生成的配置：
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
})
```

### generatePlaywrightConfig

生成 Playwright 配置文件。

**签名：**

```typescript
generatePlaywrightConfig(options?: PlaywrightOptions): string
```

**参数：**

- `options` - Playwright 配置选项
  - `testDir?` - 测试目录，默认 `'./e2e'`
  - `baseURL?` - 基础 URL，默认 `'http://localhost:5173'`
  - `fullyParallel?` - 是否完全并行，默认 `true`
  - `retries?` - 重试次数，默认 `0`
  - `projects?` - 浏览器项目列表
  - `trace?` - 是否启用 trace，默认 `true`
  - `screenshot?` - 是否启用截图，默认 `true`
  - `video?` - 是否启用视频，默认 `true`

**示例：**

```typescript
const config = generator.generatePlaywrightConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:3000',
  fullyParallel: true,
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
  ],
})
```

### generateSetupFile

生成测试环境配置文件。

**签名：**

```typescript
generateSetupFile(framework?: 'vue' | 'react'): string
```

**参数：**

- `framework` - 组件框架

**示例：**

```typescript
// Vue setup 文件
const vueSetup = generator.generateSetupFile('vue')

// React setup 文件
const reactSetup = generator.generateSetupFile('react')
```

### generateTsConfig

生成测试 TypeScript 配置。

**签名：**

```typescript
generateTsConfig(): string
```

**示例：**

```typescript
const tsConfig = generator.generateTsConfig()
```

## 类型定义

### VitestOptions

```typescript
interface VitestOptions {
  environment?: 'node' | 'jsdom' | 'happy-dom'
  globals?: boolean
  coverage?: {
    provider?: 'v8' | 'istanbul' | 'c8'
    reporter?: ('text' | 'json' | 'html' | 'lcov' | 'json-summary')[]
    reportsDirectory?: string
    exclude?: string[]
    thresholds?: CoverageThresholds
  }
  include?: string[]
  exclude?: string[]
  plugins?: string[]
}
```

### PlaywrightOptions

```typescript
interface PlaywrightOptions {
  testDir?: string
  baseURL?: string
  fullyParallel?: boolean
  retries?: number
  projects?: Array<{
    name: string
    use?: Record<string, any>
  }>
  trace?: boolean
  screenshot?: boolean
  video?: boolean
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
    thresholds: {
      global: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
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
fs.writeFileSync('tests/setup.ts', setupFile)

// 4. 生成 tsconfig.test.json
const tsConfig = generator.generateTsConfig()
fs.writeFileSync('tsconfig.test.json', tsConfig)

console.log('✅ 所有配置文件已生成')
```

## 相关 API

- [TestGenerator](/api/test-generator) - 测试生成器
- [MockGenerator](/api/mock-generator) - Mock 生成器



