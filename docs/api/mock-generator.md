# MockGenerator

Mock 数据和代码生成器，集成 Faker.js 和 MSW。

## 创建实例

```typescript
import { createMockGenerator } from '@ldesign/tester'

const generator = createMockGenerator()
```

## 方法

### generateCommonData

生成常用数据类型。

**签名：**

```typescript
generateCommonData(
  dataType: 'user' | 'product' | 'order',
  count?: number,
  locale?: 'zh_CN' | 'en_US'
): MockUser[] | MockProduct[] | MockOrder[]
```

**参数：**

- `dataType` - 数据类型
- `count` - 生成数量，默认 `1`
- `locale` - 语言环境，默认 `'zh_CN'`

**示例：**

```typescript
// 生成用户数据
const users = generator.generateCommonData('user', 10, 'zh_CN')

// 生成产品数据
const products = generator.generateCommonData('product', 20)

// 生成订单数据
const orders = generator.generateCommonData('order', 15)
```

### generateFakerMock

生成 Faker Mock 数据。

**签名：**

```typescript
generateFakerMock(options: MockOptions): unknown
```

**参数：**

- `options` - Mock 选项
  - `type` - Mock 类型
  - `schema?` - 数据模式
  - `count?` - 数量
  - `locale?` - 语言环境

**示例：**

```typescript
// 使用 schema 生成数据
const data = generator.generateFakerMock({
  type: 'faker',
  schema: {
    id: 'uuid',
    name: 'fullname',
    email: 'email',
    age: 'number',
  },
  count: 10,
  locale: 'zh_CN',
})
```

### generateMSWHandler

生成单个 MSW Handler。

**签名：**

```typescript
generateMSWHandler(apiSpec: APISpec): string
```

**参数：**

- `apiSpec` - API 规范
  - `method` - HTTP 方法
  - `path` - API 路径
  - `response?` - 响应数据
  - `statusCode?` - 状态码

**示例：**

```typescript
const handler = generator.generateMSWHandler({
  method: 'GET',
  path: '/api/users',
  response: [{ id: '1', name: 'John' }],
  statusCode: 200,
})

console.log(handler)
// http.get('/api/users', () => {
//   return HttpResponse.json([{ id: '1', name: 'John' }], { status: 200 })
// })
```

### generateMSWHandlers

生成多个 MSW Handlers。

**签名：**

```typescript
generateMSWHandlers(endpoints: Endpoint[]): string
```

**示例：**

```typescript
const handlers = generator.generateMSWHandlers([
  { method: 'GET', path: '/api/users', response: [] },
  { method: 'POST', path: '/api/users', response: {}, statusCode: 201 },
  { method: 'GET', path: '/api/users/:id', response: {} },
])
```

### generateCRUDHandlers

生成完整的 CRUD Handlers。

**签名：**

```typescript
generateCRUDHandlers(resource: string, basePath?: string): string
```

**参数：**

- `resource` - 资源名称
- `basePath` - 基础路径，默认 `'/api'`

**示例：**

```typescript
const handlers = generator.generateCRUDHandlers('users', '/api/v1')
```

生成的代码：

```typescript
import { http, HttpResponse } from 'msw'

let usersData: any[] = []

export const usersHandlers = [
  // GET /api/v1/users
  http.get('/api/v1/users', () => {
    return HttpResponse.json(usersData)
  }),

  // GET /api/v1/users/:id
  http.get('/api/v1/users/:id', ({ params }) => {
    const item = usersData.find(d => d.id === params.id)
    if (!item) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(item)
  }),

  // POST /api/v1/users
  http.post('/api/v1/users', async ({ request }) => {
    const newItem = await request.json()
    const item = {
      id: String(Date.now()),
      ...newItem,
      createdAt: new Date().toISOString(),
    }
    usersData.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // PUT /api/v1/users/:id
  http.put('/api/v1/users/:id', async ({ params, request }) => {
    const index = usersData.findIndex(d => d.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    const updates = await request.json()
    usersData[index] = {
      ...usersData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(usersData[index])
  }),

  // DELETE /api/v1/users/:id
  http.delete('/api/v1/users/:id', ({ params }) => {
    const index = usersData.findIndex(d => d.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    usersData.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
```

### generateMSWScaffold

生成完整的 MSW 脚手架。

**签名：**

```typescript
generateMSWScaffold(options: {
  endpoints?: Endpoint[]
  resources?: string[]
  environment: 'browser' | 'node'
}): Record<string, string>
```

**示例：**

```typescript
const files = generator.generateMSWScaffold({
  resources: ['users', 'products', 'orders'],
  environment: 'node',
})

// 返回文件映射
// {
//   'mocks/users-handlers.ts': '...',
//   'mocks/products-handlers.ts': '...',
//   'mocks/orders-handlers.ts': '...',
//   'mocks/server.ts': '...',
// }

// 保存文件
Object.entries(files).forEach(([path, content]) => {
  fs.writeFileSync(path, content)
})
```

## 类型定义

### MockOptions

```typescript
interface MockOptions {
  type: MockType
  schema?: Record<string, any>
  apiSpec?: APISpec
  count?: number
  locale?: 'zh_CN' | 'en_US'
  variables?: Record<string, any>
}
```

### MockType

```typescript
type MockType = 'faker' | 'msw' | 'component' | 'function' | 'module'
```

### APISpec

```typescript
interface APISpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  response?: any
  statusCode?: number
}
```

### Endpoint

```typescript
interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  response?: unknown
  statusCode?: number
  description?: string
}
```

## 完整示例

```typescript
import { createMockGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const generator = createMockGenerator()

// 1. 生成 Faker 数据
const users = generator.generateCommonData('user', 100, 'zh_CN')
fs.writeFileSync('mocks/users.json', JSON.stringify(users, null, 2))

// 2. 生成 MSW Handlers
const handlers = generator.generateCRUDHandlers('users', '/api')
fs.writeFileSync('mocks/users-handlers.ts', handlers)

// 3. 生成完整的 MSW 脚手架
const scaffold = generator.generateMSWScaffold({
  resources: ['users', 'products', 'orders'],
  environment: 'node',
})

Object.entries(scaffold).forEach(([path, content]) => {
  const dir = path.split('/').slice(0, -1).join('/')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(path, content)
})

console.log('✅ Mock 文件已生成')
```

## 相关 API

- [FakerGenerator](/api/faker-generator) - Faker 生成器
- [MSWGenerator](/api/msw-generator) - MSW 生成器
- [Mock 系统指南](/guide/mock-system)



