# API 测试示例

使用 @ldesign/tester 测试 RESTful API。

## 环境准备

```bash
pnpm add -D @ldesign/tester vitest supertest
```

## Express API 测试

### 示例 API

```typescript
// src/app.ts
import express from 'express'

const app = express()
app.use(express.json())

// 用户数据存储
let users = [
  { id: '1', name: 'John', email: 'john@example.com' },
  { id: '2', name: 'Jane', email: 'jane@example.com' },
]

// 获取所有用户
app.get('/api/users', (req, res) => {
  res.json(users)
})

// 获取单个用户
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json(user)
})

// 创建用户
app.post('/api/users', (req, res) => {
  const newUser = {
    id: String(Date.now()),
    ...req.body,
  }
  users.push(newUser)
  res.status(201).json(newUser)
})

// 更新用户
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' })
  }
  users[index] = { ...users[index], ...req.body }
  res.json(users[index])
})

// 删除用户
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' })
  }
  users.splice(index, 1)
  res.status(204).send()
})

export default app
```

### 生成测试

```bash
npx ldesign-test generate api users
```

### 完整测试

```typescript
// tests/api/users.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '@/app'

describe('Users API', () => {
  beforeEach(() => {
    // 重置数据
  })

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)

      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
    })

    it('should return correct user structure', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)

      const user = response.body[0]
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200)

      expect(response.body).toMatchObject({
        id: '1',
        name: 'John',
      })
    })

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const newUser = {
        name: 'Bob',
        email: 'bob@example.com',
      }

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)

      expect(response.body).toMatchObject(newUser)
      expect(response.body).toHaveProperty('id')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const updates = { name: 'John Updated' }

      const response = await request(app)
        .put('/api/users/1')
        .send(updates)
        .expect(200)

      expect(response.body.name).toBe('John Updated')
    })

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .put('/api/users/999')
        .send({ name: 'Test' })
        .expect(404)
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      await request(app)
        .delete('/api/users/1')
        .expect(204)

      // 验证已删除
      await request(app)
        .get('/api/users/1')
        .expect(404)
    })

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .delete('/api/users/999')
        .expect(404)
    })
  })
})
```

## 使用 MSW Mock API

```typescript
// tests/mocks/api-handlers.ts
import { http, HttpResponse } from 'msw'

export const apiHandlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John', email: 'john@example.com' },
      { id: '2', name: 'Jane', email: 'jane@example.com' },
    ])
  }),

  http.get('/api/users/:id', ({ params }) => {
    const users = [
      { id: '1', name: 'John', email: 'john@example.com' },
      { id: '2', name: 'Jane', email: 'jane@example.com' },
    ]
    
    const user = users.find(u => u.id === params.id)
    
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(user)
  }),

  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json()
    return HttpResponse.json(
      {
        id: String(Date.now()),
        ...newUser,
      },
      { status: 201 },
    )
  }),
]
```

```typescript
// tests/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { apiHandlers } from './mocks/api-handlers'

const server = setupServer(...apiHandlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

在测试中使用：

```typescript
// tests/unit/services/api.test.ts
import { describe, it, expect } from 'vitest'

describe('API Service', () => {
  it('should fetch users', async () => {
    const response = await fetch('/api/users')
    const users = await response.json()
    
    expect(users).toHaveLength(2)
    expect(users[0].name).toBe('John')
  })

  it('should create user', async () => {
    const newUser = { name: 'Bob', email: 'bob@example.com' }
    
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    
    const created = await response.json()
    
    expect(response.status).toBe(201)
    expect(created.name).toBe('Bob')
  })
})
```

## GraphQL API 测试

```typescript
// tests/api/graphql.test.ts
import { describe, it, expect } from 'vitest'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const handlers = [
  graphql.query('GetUsers', () => {
    return HttpResponse.json({
      data: {
        users: [
          { id: '1', name: 'John' },
          { id: '2', name: 'Jane' },
        ],
      },
    })
  }),

  graphql.mutation('CreateUser', ({ variables }) => {
    return HttpResponse.json({
      data: {
        createUser: {
          id: String(Date.now()),
          ...variables.input,
        },
      },
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('GraphQL API', () => {
  it('should query users', async () => {
    const query = `
      query GetUsers {
        users {
          id
          name
        }
      }
    `

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    const result = await response.json()
    
    expect(result.data.users).toHaveLength(2)
  })

  it('should create user', async () => {
    const mutation = `
      mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
          id
          name
        }
      }
    `

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: { name: 'Bob', email: 'bob@example.com' },
        },
      }),
    })

    const result = await response.json()
    
    expect(result.data.createUser.name).toBe('Bob')
  })
})
```

## 错误处理测试

```typescript
describe('API Error Handling', () => {
  it('should handle 404 errors', async () => {
    const response = await request(app)
      .get('/api/users/999')
      .expect(404)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('User not found')
  })

  it('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ invalid: 'data' })
      .expect(400)

    expect(response.body).toHaveProperty('error')
  })

  it('should handle server errors', async () => {
    // Mock 服务器错误
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await request(app)
      .get('/api/error')
      .expect(500)

    expect(response.body).toHaveProperty('error')
  })
})
```

## 认证测试

```typescript
describe('Authenticated API', () => {
  const token = 'Bearer test-token'

  it('should require authentication', async () => {
    await request(app)
      .get('/api/protected')
      .expect(401)
  })

  it('should accept valid token', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', token)
      .expect(200)

    expect(response.body).toBeDefined()
  })

  it('should reject invalid token', async () => {
    await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid')
      .expect(403)
  })
})
```

## 下一步

- [基础示例](/examples/basic)
- [Vue 项目](/examples/vue)
- [React 项目](/examples/react)



