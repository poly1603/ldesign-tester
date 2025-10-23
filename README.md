# @ldesign/tester

> 🧪 企业级测试工具集 - 一键生成测试、Mock、配置和 CI/CD

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](./tsconfig.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/docs-VitePress-blue.svg)](./docs)

[📖 完整文档](./docs) | [🚀 快速开始](#快速开始) | [🎯 功能特性](#特性) | [📝 示例](#示例)

## ✨ 特性

- 🎯 **测试生成** - 自动生成单元/E2E/组件/API/集成测试
- 🎭 **Mock 系统** - Faker.js + MSW 完整 Mock 解决方案
- ⚙️ **配置生成** - Vitest/Playwright 零配置启动
- 🚀 **CI/CD 模板** - GitHub Actions/GitLab CI/Jenkins/CircleCI
- ⚡ **性能测试** - Benchmark/压力测试/Lighthouse
- 📸 **视觉回归** - Screenshot 对比 + Percy 集成
- 📊 **Dashboard** - 测试历史和趋势可视化
- 🎨 **TypeScript** - 完整的类型支持

## 📦 安装

```bash
# pnpm (推荐)
pnpm add -D @ldesign/tester

# npm
npm install --save-dev @ldesign/tester

# yarn
yarn add -D @ldesign/tester
```

## 🚀 快速开始

::: tip 提示
查看 [完整文档](./docs) 了解所有功能和详细用法。
:::

### 1. 初始化测试环境

```bash
# 初始化 Vitest 配置
npx ldesign-test init vitest

# 初始化 Playwright 配置
npx ldesign-test init playwright
```

生成的文件：
- `vitest.config.ts` - Vitest 配置
- `playwright.config.ts` - Playwright 配置（如果启用 E2E）
- `tests/setup.ts` - 测试环境配置
- `tsconfig.test.json` - TypeScript 测试配置

### 2. 生成测试文件

```bash
# 生成单元测试
npx ldesign-test generate unit UserService

# 生成 Vue 组件测试
npx ldesign-test generate component Button --framework vue

# 生成 E2E 测试
npx ldesign-test generate e2e login
```

### 3. 生成 Mock 数据

```bash
# 生成用户数据
npx ldesign-test mock data user --count 10

# 生成 MSW Handlers
npx ldesign-test mock msw
```

### 4. 生成 CI/CD 配置

```bash
# GitHub Actions
npx ldesign-test ci github

# GitLab CI
npx ldesign-test ci gitlab
```

## 🎭 Mock 系统

### 生成 Faker Mock 数据

```bash
# 生成用户数据（10条）
npx ldesign-test mock faker --type user --count 10

# 生成产品数据
npx ldesign-test mock faker --type product --count 20

# 生成订单数据
npx ldesign-test mock faker --type order --count 15
```

### 生成 MSW Handlers

```bash
# 生成 CRUD Handlers
npx ldesign-test mock msw --resource users

# 生成到指定路径
npx ldesign-test mock msw --resource posts --output src/mocks/posts-handlers.ts
```

### 编程方式使用

```typescript
import { createMockGenerator } from '@ldesign/tester'

const mockGenerator = createMockGenerator()

// 生成 Mock 数据
const users = mockGenerator.generateCommonData('user', 10, 'zh_CN')

// 生成 MSW Handler
const handler = mockGenerator.generateCRUDHandlers('products', '/api/v1')
```

## ⚙️ 配置生成

### 生成 Vitest 配置

```bash
npx ldesign-test config vitest --coverage
```

### 生成 Playwright 配置

```bash
npx ldesign-test config playwright
```

## 🚀 CI/CD 集成

### 生成 GitHub Actions

```bash
npx ldesign-test ci github --node-versions 18,20 --coverage
```

### 生成 GitLab CI

```bash
npx ldesign-test ci gitlab
```

### 生成 Jenkins Pipeline

```bash
npx ldesign-test ci jenkins
```

### 生成 CircleCI

```bash
npx ldesign-test ci circleci
```

## ⚡ 性能测试

### 基准测试

```typescript
import { createBenchmarkTester } from '@ldesign/tester'

const tester = createBenchmarkTester()

// 添加测试
tester
  .add({
    name: 'Array.forEach',
    fn: () => {
      const arr = [1, 2, 3, 4, 5]
      arr.forEach(n => n * 2)
    },
  })
  .add({
    name: 'for loop',
    fn: () => {
      const arr = [1, 2, 3, 4, 5]
      for (let i = 0; i < arr.length; i++) {
        arr[i] * 2
      }
    },
  })

// 运行测试
const results = await tester.run()
console.log(tester.formatResults(results))
```

### 压力测试

```typescript
import { createLoadTester } from '@ldesign/tester'

const loadTester = createLoadTester()

const result = await loadTester.runLoadTest({
  url: 'http://localhost:3000/api/users',
  connections: 100,
  duration: 30, // 30 seconds
})

console.log(loadTester.formatResult(result))
```

### Lighthouse 测试

```typescript
import { createLighthouseTester } from '@ldesign/tester'

const lighthouse = createLighthouseTester()

const result = await lighthouse.runLighthouse({
  url: 'https://example.com',
  formFactor: 'mobile',
})

console.log(lighthouse.formatResult(result))
```

## 📸 视觉回归测试

### Screenshot 对比

```typescript
import { createVisualRegression } from '@ldesign/tester'

const visualRegression = createVisualRegression()

// 在 Playwright 测试中使用
test('visual regression', async ({ page }) => {
  await page.goto('https://example.com')
  
  const result = await visualRegression.captureAndCompare(
    page,
    'homepage',
  )
  
  expect(result.hasDiff).toBe(false)
})
```

### Percy 集成

```typescript
import { createPercyIntegration } from '@ldesign/tester'

const percy = createPercyIntegration()

test('percy snapshot', async ({ page }) => {
  await page.goto('https://example.com')
  
  await percy.snapshot(page, {
    name: 'Homepage',
    widths: [375, 768, 1280],
  })
})
```

## 📊 Dashboard

### 启动 Dashboard

```bash
npx ldesign-test dashboard --port 3000
```

访问 `http://localhost:3000` 查看：
- 测试运行历史
- 覆盖率趋势
- 失败用例追踪
- 性能统计

### 编程方式使用

```typescript
import { createDashboardServer, createTestDatabase } from '@ldesign/tester'

// 创建数据库
const db = createTestDatabase()

// 保存测试结果
const runId = db.saveTestRun(results, coverage)

// 启动 Dashboard
const dashboard = createDashboardServer({ port: 3000 })
await dashboard.start()
```

## 📖 API 文档

### TestGenerator

```typescript
import { createTestGenerator } from '@ldesign/tester'

const generator = createTestGenerator()

// 生成单元测试
const unitTest = generator.generateUnitTest('UserService', {
  includeComments: true,
  includeExamples: true,
})

// 生成组件测试
const componentTest = generator.generateComponentTest(
  'Button',
  'vue',
  { includeComments: true }
)

// 生成 E2E 测试
const e2eTest = generator.generateE2ETest('login')

// 生成 API 测试
const apiTest = generator.generateAPITest('users')
```

### ConfigGenerator

```typescript
import { createConfigGenerator } from '@ldesign/tester'

const configGenerator = createConfigGenerator()

// 生成 Vitest 配置
const vitestConfig = configGenerator.generateVitestConfig({
  environment: 'jsdom',
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
  },
})

// 生成 Playwright 配置
const playwrightConfig = configGenerator.generatePlaywrightConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:3000',
})
```

### MockGenerator

```typescript
import { createMockGenerator } from '@ldesign/tester'

const mockGenerator = createMockGenerator()

// 生成 Faker 数据
const users = mockGenerator.generateCommonData('user', 10)

// 生成 MSW Handler
const handler = mockGenerator.generateMSWHandler({
  method: 'GET',
  path: '/api/users',
  response: users,
  statusCode: 200,
})
```

## 🔧 CLI 命令

```bash
# 查看所有命令
npx ldesign-test --help

# 查看特定命令帮助
npx ldesign-test generate --help
npx ldesign-test mock --help
npx ldesign-test ci --help
```

## 📝 配置

### package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "dashboard": "ldesign-test dashboard"
  }
}
```

## 🤝 贡献

欢迎贡献代码！请查看 [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

MIT © LDesign Team

## 🔗 相关链接

- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Faker.js](https://fakerjs.dev/)
- [MSW](https://mswjs.io/)
- [Percy](https://percy.io/)
