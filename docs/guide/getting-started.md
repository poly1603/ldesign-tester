# 快速开始

快速上手 @ldesign/tester，5 分钟内开始使用。

## 安装

::: code-group

```bash [pnpm]
pnpm add -D @ldesign/tester
```

```bash [npm]
npm install --save-dev @ldesign/tester
```

```bash [yarn]
yarn add -D @ldesign/tester
```

:::

## 初始化项目

### 使用 CLI

```bash
# 初始化 Vitest 配置
npx ldesign-test init vitest

# 初始化 Playwright 配置
npx ldesign-test init playwright
```

### 编程方式

```typescript
import { createConfigGenerator } from '@ldesign/tester'

const configGen = createConfigGenerator()

// 生成 Vitest 配置
const vitestConfig = configGen.generateVitestConfig({
  environment: 'jsdom',
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
  },
})

console.log(vitestConfig)
```

## 生成测试

### CLI 方式

```bash
# 生成单元测试
npx ldesign-test generate unit UserService

# 生成 Vue 组件测试
npx ldesign-test generate component Button --framework vue

# 生成 E2E 测试
npx ldesign-test generate e2e login

# 生成 API 测试
npx ldesign-test generate api users
```

### 编程方式

```typescript
import { createTestGenerator } from '@ldesign/tester'

const testGen = createTestGenerator()

// 生成单元测试
const unitTest = testGen.generateUnitTest('UserService')

// 生成组件测试
const componentTest = testGen.generateComponentTest('Button', 'vue')

// 保存到文件
import fs from 'node:fs'
fs.writeFileSync('tests/unit/UserService.test.ts', unitTest)
```

## 生成 Mock 数据

### 使用 Faker

```bash
# 生成用户数据
npx ldesign-test mock data user --count 10

# 生成产品数据
npx ldesign-test mock data product --count 20
```

编程方式：

```typescript
import { createFakerIntegration } from '@ldesign/tester'

const faker = createFakerIntegration()

// 生成用户数据
const users = faker.generateUser(10)

// 生成产品数据
const products = faker.generateProduct(20)

console.log(JSON.stringify(users, null, 2))
```

### 使用 MSW

```bash
# 生成 MSW handlers
npx ldesign-test mock msw
```

编程方式：

```typescript
import { createMSWIntegration } from '@ldesign/tester'

const msw = createMSWIntegration()

const handlers = msw.generateHandlers([
  { method: 'GET', path: '/api/users', response: [] },
  { method: 'POST', path: '/api/users', response: {}, statusCode: 201 },
])

console.log(handlers)
```

## 生成 CI/CD 配置

```bash
# GitHub Actions
npx ldesign-test ci github

# GitLab CI
npx ldesign-test ci gitlab
```

## 运行测试

添加 npm scripts：

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

运行测试：

```bash
# 单元测试
npm test

# 覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e
```

## 完整示例

```typescript
import {
  createTestGenerator,
  createConfigGenerator,
  createMockGenerator,
} from '@ldesign/tester'

// 1. 生成配置
const configGen = createConfigGenerator()
const vitestConfig = configGen.generateVitestConfig()

// 2. 生成测试
const testGen = createTestGenerator()
const test = testGen.generateUnitTest('calculateTotal')

// 3. 生成 Mock 数据
const mockGen = createMockGenerator()
const users = mockGen.generateCommonData('user', 10)

console.log('Config:', vitestConfig)
console.log('Test:', test)
console.log('Mock data:', users)
```

## 下一步

- [测试生成详解](/guide/test-generation)
- [Mock 系统详解](/guide/mock-system)
- [API 参考](/api/test-generator)
- [查看示例](/examples/basic)


