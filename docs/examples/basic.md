# 基础使用示例

本页面展示 @ldesign/tester 的基本使用方法。

## 生成单元测试

### CLI 方式

```bash
npx ldesign-test generate unit calculateTotal
```

生成的文件：

```typescript
/**
 * calculateTotal 单元测试
 */
import { describe, it, expect } from 'vitest'
import { calculateTotal } from './calculateTotal'

describe('calculateTotal', () => {
  it('should work correctly', () => {
    expect(true).toBe(true)
  })

  it('should handle edge cases', () => {
    expect(true).toBe(true)
  })

  it('should handle errors', () => {
    expect(() => {
      // 触发错误的代码
    }).toThrow()
  })
})
```

### 编程方式

```typescript
import { createTestGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const generator = createTestGenerator()

const test = generator.generateUnitTest('calculateTotal', {
  includeComments: true,
  includeExamples: true,
})

fs.writeFileSync('tests/unit/calculateTotal.test.ts', test)
```

## 生成 Mock 数据

### 使用 Faker

```typescript
import { createFakerIntegration } from '@ldesign/tester'

const faker = createFakerIntegration()

// 生成单个用户
const user = faker.generateUser(1)[0]
console.log(user)
// {
//   id: '123',
//   username: 'zhangsan',
//   email: 'zhangsan@example.com',
//   ...
// }

// 生成多个产品
const products = faker.generateProduct(10)
console.log(products)
```

### 使用 MSW

```typescript
import { createMSWIntegration } from '@ldesign/tester'

const msw = createMSWIntegration()

const handlers = msw.generateHandlers([
  {
    method: 'GET',
    path: '/api/users',
    response: [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ],
  },
  {
    method: 'POST',
    path: '/api/users',
    response: { id: '3', name: 'New User' },
    statusCode: 201,
  },
])

console.log(handlers)
```

## 生成配置文件

### Vitest 配置

```typescript
import { createConfigGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const configGen = createConfigGenerator()

const vitestConfig = configGen.generateVitestConfig({
  environment: 'jsdom',
  globals: true,
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'json'],
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

fs.writeFileSync('vitest.config.ts', vitestConfig)
```

### Playwright 配置

```typescript
import { createConfigGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const configGen = createConfigGenerator()

const playwrightConfig = configGen.generatePlaywrightConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173',
  fullyParallel: true,
})

fs.writeFileSync('playwright.config.ts', playwrightConfig)
```

## 生成 CI/CD 配置

### GitHub Actions

```typescript
import { createGitHubActionsGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const ciGen = createGitHubActionsGenerator()

const githubActions = ciGen.generate({
  platform: 'github',
  nodeVersions: ['18', '20'],
  uploadCoverage: true,
})

fs.mkdirSync('.github/workflows', { recursive: true })
fs.writeFileSync('.github/workflows/test.yml', githubActions)
```

## 完整工作流

```typescript
import {
  createTestGenerator,
  createConfigGenerator,
  createMockGenerator,
  createGitHubActionsGenerator,
} from '@ldesign/tester'
import fs from 'node:fs'
import path from 'node:path'

// 1. 生成 Vitest 配置
const configGen = createConfigGenerator()
const vitestConfig = configGen.generateVitestConfig({
  environment: 'jsdom',
  coverage: { provider: 'v8' },
})
fs.writeFileSync('vitest.config.ts', vitestConfig)

// 2. 生成测试文件
const testGen = createTestGenerator()
const services = ['UserService', 'ProductService', 'OrderService']

services.forEach((service) => {
  const test = testGen.generateUnitTest(service)
  const dir = 'tests/unit'
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(
    path.join(dir, `${service}.test.ts`),
    test,
  )
})

// 3. 生成 Mock 数据
const mockGen = createMockGenerator()
const users = mockGen.generateCommonData('user', 100)
fs.writeFileSync('tests/fixtures/users.json', JSON.stringify(users, null, 2))

// 4. 生成 CI/CD 配置
const ciGen = createGitHubActionsGenerator()
const ci = ciGen.generate({ platform: 'github' })

fs.mkdirSync('.github/workflows', { recursive: true })
fs.writeFileSync('.github/workflows/test.yml', ci)

console.log('✅ 项目设置完成!')
console.log('- Vitest 配置已生成')
console.log(`- ${services.length} 个测试文件已生成`)
console.log('- Mock 数据已生成')
console.log('- GitHub Actions 配置已生成')
```

## 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率
npm run test:coverage

# 运行测试 UI
npm run test:ui

# 运行特定测试文件
npm test UserService.test.ts
```

## 下一步

- [Vue 项目示例](/examples/vue)
- [React 项目示例](/examples/react)
- [API 测试示例](/examples/api)



