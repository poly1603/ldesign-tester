# 快速开始

本指南将帮助你在 5 分钟内上手 @ldesign/tester。

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

## 初始化测试环境

使用 `init` 命令初始化测试配置：

```bash
npx ldesign-test init --framework vue --coverage --e2e
```

这将生成以下文件：

- `vitest.config.ts` - Vitest 配置
- `playwright.config.ts` - Playwright 配置
- `tests/setup.ts` - 测试环境配置
- `tsconfig.test.json` - TypeScript 测试配置

## 生成测试脚手架

创建标准的测试目录结构：

```bash
npx ldesign-test scaffold
```

生成的目录结构：

```
tests/
├── unit/              # 单元测试
├── integration/       # 集成测试
├── helpers/           # 测试辅助函数
│   ├── test-utils.ts
│   └── dom-helpers.ts
├── fixtures/          # 测试数据
│   └── users.ts
└── mocks/             # Mock 文件
    └── api.ts
e2e/                   # E2E 测试
└── fixtures/
```

## 生成测试文件

### 单元测试

```bash
npx ldesign-test generate unit UserService
```

生成的文件 `tests/unit/UserService.test.ts`:

```typescript
/**
 * UserService 单元测试
 */
import { describe, it, expect } from 'vitest'
import { UserService } from './UserService'

describe('UserService', () => {
  // 基本功能测试
  it('should work correctly', () => {
    // TODO: 添加测试逻辑
    expect(true).toBe(true)
  })

  // 边界条件测试
  it('should handle edge cases', () => {
    // TODO: 测试边界条件
    expect(true).toBe(true)
  })

  // 错误处理测试
  it('should handle errors', () => {
    // TODO: 测试错误处理
    expect(() => {
      // 触发错误的代码
    }).toThrow()
  })
})
```

### Vue 组件测试

```bash
npx ldesign-test generate component Button --framework vue
```

生成的文件 `tests/unit/Button.test.ts`:

```typescript
/**
 * Button 组件测试
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  // 组件渲染测试
  it('should render correctly', () => {
    const wrapper = mount(Button)
    expect(wrapper.exists()).toBe(true)
  })

  // Props 测试
  it('should accept props', () => {
    const wrapper = mount(Button, {
      props: {
        title: 'Test Title',
      },
    })
    expect(wrapper.text()).toContain('Test Title')
  })

  // 事件测试
  it('should emit events', async () => {
    const wrapper = mount(Button)
    
    // 触发事件
    await wrapper.find('button').trigger('click')
    
    // 检查事件
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### E2E 测试

```bash
npx ldesign-test generate e2e login
```

生成的文件 `e2e/login.spec.ts`:

```typescript
/**
 * login E2E 测试
 */
import { test, expect } from '@playwright/test'

test.describe('login', () => {
  // 页面加载测试
  test('should load the page', async ({ page }) => {
    await page.goto('/')
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
    
    // 检查标题
    await expect(page).toHaveTitle(/.*/)
  })

  // 用户交互测试
  test('should handle user interactions', async ({ page }) => {
    await page.goto('/')
    
    // TODO: 添加交互测试
  })
})
```

## 生成 Mock 数据

### Faker 数据

```bash
# 生成用户数据
npx ldesign-test mock faker --type user --count 10

# 生成产品数据
npx ldesign-test mock faker --type product --count 20

# 生成订单数据
npx ldesign-test mock faker --type order --count 15
```

### MSW Handlers

```bash
npx ldesign-test mock msw --resource users
```

生成的文件 `mocks/users-handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'

/**
 * users CRUD Handlers
 */

// 模拟数据存储
let usersData: any[] = []

export const usersHandlers = [
  // 获取列表
  http.get('/api/users', () => {
    return HttpResponse.json(usersData)
  }),

  // 获取单个
  http.get('/api/users/:id', ({ params }) => {
    const item = usersData.find(d => d.id === params.id)
    if (!item) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(item)
  }),

  // 创建
  http.post('/api/users', async ({ request }) => {
    const newItem = await request.json() as any
    const item = {
      id: String(Date.now()),
      ...newItem,
      createdAt: new Date().toISOString(),
    }
    usersData.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // ... 更多 CRUD 操作
]
```

## 生成 CI/CD 配置

### GitHub Actions

```bash
npx ldesign-test ci github --node-versions 18,20 --coverage
```

生成的文件 `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## 运行测试

### 单元测试

```bash
# 运行所有测试
npm test

# 监视模式
npm test -- --watch

# 生成覆盖率
npm run test:coverage

# UI 模式
npm test -- --ui
```

### E2E 测试

```bash
# 运行 E2E 测试
npm run test:e2e

# 调试模式
npm run test:e2e -- --debug

# 指定浏览器
npm run test:e2e -- --project=chromium
```

## 查看测试结果

### 覆盖率报告

运行 `npm run test:coverage` 后，打开 `coverage/index.html` 查看详细的覆盖率报告。

### Dashboard

启动 Dashboard 查看测试历史：

```bash
npx ldesign-test dashboard --port 3000
```

访问 `http://localhost:3000` 查看：
- 测试运行历史
- 覆盖率趋势
- 失败用例追踪

## 下一步

现在你已经完成了基本设置，可以：

- [深入了解测试生成](/guide/test-generation)
- [学习 Mock 系统](/guide/mock-system)
- [探索性能测试](/guide/performance-testing)
- [查看 API 文档](/api/test-generator)
- [浏览示例代码](/examples/unit-test)



