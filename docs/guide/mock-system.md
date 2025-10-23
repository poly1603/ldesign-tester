# Mock 系统

@ldesign/tester 提供完整的 Mock 解决方案，包括 Faker.js 数据生成和 MSW API Mock。

## Faker 数据生成

### 生成常用数据

#### 用户数据

```bash
npx ldesign-test mock faker --type user --count 10 --locale zh_CN
```

生成的数据：

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "张伟",
    "email": "zhangwei@example.com",
    "firstName": "伟",
    "lastName": "张",
    "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/123.jpg",
    "phone": "13812345678",
    "address": {
      "street": "建国路123号",
      "city": "北京市",
      "state": "北京",
      "zipCode": "100000",
      "country": "中国"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 产品数据

```bash
npx ldesign-test mock faker --type product --count 20
```

生成的数据：

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "高级无线鼠标",
    "description": "舒适、精准、无线",
    "price": 99.99,
    "category": "电子产品",
    "image": "https://loremflickr.com/640/480/product",
    "stock": 150,
    "sku": "PROD123456",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 订单数据

```bash
npx ldesign-test mock faker --type order --count 15
```

### 编程方式使用

```typescript
import { createFakerGenerator } from '@ldesign/tester'

const faker = createFakerGenerator('zh_CN')

// 生成单个用户
const user = faker.generateUser()

// 生成多个用户
const users = faker.generateUsers(10)

// 生成产品
const products = faker.generateProducts(20)

// 生成订单
const orders = faker.generateOrders(15)
```

### 自定义 Schema

你可以使用 schema 定义自定义数据结构：

```typescript
import { createFakerGenerator } from '@ldesign/tester'

const faker = createFakerGenerator('zh_CN')

// 定义 schema
const schema = {
  id: 'uuid',
  username: 'username',
  email: 'email',
  age: 'number',
  bio: 'text',
  avatar: 'imageurl',
  isActive: 'boolean',
  createdAt: 'date',
}

// 生成数据
const data = faker.generateFromSchema(schema)

// 生成多条数据
const dataList = faker.generateManyFromSchema(schema, 10)
```

### 支持的字段类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `id`, `uuid` | UUID | `550e8400-e29b-41d4-a716-446655440000` |
| `username` | 用户名 | `zhangwei123` |
| `email` | 电子邮件 | `example@email.com` |
| `firstname` | 名 | `伟` |
| `lastname` | 姓 | `张` |
| `fullname` | 全名 | `张伟` |
| `phone` | 电话 | `13812345678` |
| `avatar` | 头像URL | `https://...` |
| `street` | 街道 | `建国路123号` |
| `city` | 城市 | `北京市` |
| `state` | 省份/州 | `北京` |
| `zipcode` | 邮编 | `100000` |
| `country` | 国家 | `中国` |
| `url` | 网址 | `https://example.com` |
| `domain` | 域名 | `example.com` |
| `ip` | IP地址 | `192.168.1.1` |
| `title` | 标题 | `这是一个标题` |
| `description` | 描述 | `这是一段描述文字` |
| `text` | 文本 | `较长的文本内容...` |
| `image`, `imageurl` | 图片URL | `https://...` |
| `productname` | 产品名 | `高级无线鼠标` |
| `price` | 价格 | `99.99` |
| `category`, `department` | 分类 | `电子产品` |
| `company` | 公司名 | `科技有限公司` |
| `jobtitle` | 职位 | `软件工程师` |
| `number` | 数字 | `42` |
| `float` | 浮点数 | `3.14` |
| `boolean` | 布尔值 | `true` |
| `date` | 日期 | `2024-01-01T00:00:00.000Z` |
| `string` | 字符串 | `random text` |

## MSW API Mock

### 生成 CRUD Handlers

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

  // 更新
  http.put('/api/users/:id', async ({ params, request }) => {
    const index = usersData.findIndex(d => d.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    const updates = await request.json() as any
    usersData[index] = {
      ...usersData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(usersData[index])
  }),

  // 删除
  http.delete('/api/users/:id', ({ params }) => {
    const index = usersData.findIndex(d => d.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    usersData.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
```

### 编程方式使用

```typescript
import { createMSWGenerator } from '@ldesign/tester'

const msw = createMSWGenerator()

// 生成单个 Handler
const handler = msw.generateHandler({
  method: 'GET',
  path: '/api/users',
  response: [],
  statusCode: 200,
})

// 生成多个 Handlers
const handlers = msw.generateRESTHandlers([
  { method: 'GET', path: '/api/users', response: [] },
  { method: 'POST', path: '/api/users', response: {}, statusCode: 201 },
  { method: 'GET', path: '/api/users/:id', response: {} },
])

// 生成 CRUD Handlers
const crudHandlers = msw.generateCRUDHandlers('users', '/api/v1')

// 生成 GraphQL Handlers
const graphqlHandlers = msw.generateGraphQLHandlers([
  {
    name: 'GetUsers',
    type: 'query',
    response: { users: [] },
  },
  {
    name: 'CreateUser',
    type: 'mutation',
    response: { user: {} },
  },
])
```

### 在测试中使用 MSW

#### Node.js 环境（Vitest）

创建 `tests/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node'
import { usersHandlers } from './users-handlers'
import { productsHandlers } from './products-handlers'

export const server = setupServer(...usersHandlers, ...productsHandlers)

// 测试配置
export function setupMSW(): void {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
}
```

在测试中使用：

```typescript
import { describe, it, expect } from 'vitest'
import { setupMSW } from './mocks/server'
import { fetchUsers } from './api'

describe('User API', () => {
  setupMSW()

  it('should fetch users', async () => {
    const users = await fetchUsers()
    expect(users).toBeDefined()
  })
})
```

#### 浏览器环境

创建 `src/mocks/browser.ts`:

```typescript
import { setupWorker } from 'msw/browser'
import { usersHandlers } from './users-handlers'

export const worker = setupWorker(...usersHandlers)

// 在开发环境启动
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'warn',
  })
}
```

### 动态响应

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') || '1'
    const limit = url.searchParams.get('limit') || '10'

    // 动态生成响应
    const users = generateUsers(Number.parseInt(limit))

    return HttpResponse.json({
      data: users,
      page: Number.parseInt(page),
      total: 100,
    })
  }),
]
```

### 错误模拟

```typescript
import { http, HttpResponse } from 'msw'

export const errorHandlers = [
  // 网络错误
  http.get('/api/users', () => {
    return HttpResponse.error()
  }),

  // 服务器错误
  http.get('/api/users', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }),

  // 权限错误
  http.get('/api/admin/users', () => {
    return HttpResponse.json(
      { error: 'Forbidden' },
      { status: 403 },
    )
  }),
]
```

## 最佳实践

### 1. 分离 Mock 配置

将 Mock 数据和 Handlers 分离：

```typescript
// mocks/data/users.ts
export const mockUsers = [
  { id: '1', name: '张三', email: 'zhangsan@example.com' },
  { id: '2', name: '李四', email: 'lisi@example.com' },
]

// mocks/handlers/users.ts
import { http, HttpResponse } from 'msw'
import { mockUsers } from '../data/users'

export const usersHandlers = [
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers)
  }),
]
```

### 2. 使用工厂函数

```typescript
function createMockUser(override = {}) {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    ...override,
  }
}

const user1 = createMockUser({ username: 'custom' })
```

### 3. 环境隔离

```typescript
// 仅在开发和测试环境启用 MSW
if (process.env.NODE_ENV !== 'production') {
  worker.start()
}
```

## 下一步

- [配置生成](/guide/config-generation) - 生成测试配置
- [性能测试](/guide/performance-testing) - 性能测试工具
- [API 参考](/api/mock-generator) - MockGenerator API 文档



