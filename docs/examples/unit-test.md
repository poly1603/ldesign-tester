# 单元测试示例

本页面展示各种单元测试的完整示例。

## 基础单元测试

### 测试函数

```typescript
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function multiply(a: number, b: number): number {
  return a * b
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero')
  }
  return a / b
}
```

```typescript
// tests/unit/math.test.ts
import { describe, it, expect } from 'vitest'
import { add, multiply, divide } from '@/utils/math'

describe('Math Utils', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(1, 2)).toBe(3)
    })

    it('should add negative numbers', () => {
      expect(add(-1, -2)).toBe(-3)
    })

    it('should add zero', () => {
      expect(add(5, 0)).toBe(5)
    })
  })

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12)
    })

    it('should handle zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })
  })

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero')
    })
  })
})
```

### 测试类

```typescript
// src/services/UserService.ts
export class UserService {
  private users: Map<string, User> = new Map()

  addUser(user: User): void {
    if (this.users.has(user.id)) {
      throw new Error('User already exists')
    }
    this.users.set(user.id, user)
  }

  getUser(id: string): User | undefined {
    return this.users.get(id)
  }

  updateUser(id: string, updates: Partial<User>): void {
    const user = this.users.get(id)
    if (!user) {
      throw new Error('User not found')
    }
    this.users.set(id, { ...user, ...updates })
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id)
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }
}
```

```typescript
// tests/unit/UserService.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { UserService } from '@/services/UserService'

describe('UserService', () => {
  let service: UserService

  beforeEach(() => {
    service = new UserService()
  })

  describe('addUser', () => {
    it('should add a new user', () => {
      const user = { id: '1', name: 'John' }
      service.addUser(user)
      
      expect(service.getUser('1')).toEqual(user)
    })

    it('should throw error when adding duplicate user', () => {
      const user = { id: '1', name: 'John' }
      service.addUser(user)
      
      expect(() => service.addUser(user)).toThrow('User already exists')
    })
  })

  describe('getUser', () => {
    it('should return user if exists', () => {
      const user = { id: '1', name: 'John' }
      service.addUser(user)
      
      expect(service.getUser('1')).toEqual(user)
    })

    it('should return undefined if user does not exist', () => {
      expect(service.getUser('999')).toBeUndefined()
    })
  })

  describe('updateUser', () => {
    it('should update existing user', () => {
      const user = { id: '1', name: 'John' }
      service.addUser(user)
      
      service.updateUser('1', { name: 'Jane' })
      
      expect(service.getUser('1')).toEqual({ id: '1', name: 'Jane' })
    })

    it('should throw error when updating non-existent user', () => {
      expect(() => service.updateUser('999', { name: 'Jane' }))
        .toThrow('User not found')
    })
  })

  describe('deleteUser', () => {
    it('should delete existing user', () => {
      const user = { id: '1', name: 'John' }
      service.addUser(user)
      
      const result = service.deleteUser('1')
      
      expect(result).toBe(true)
      expect(service.getUser('1')).toBeUndefined()
    })

    it('should return false when deleting non-existent user', () => {
      expect(service.deleteUser('999')).toBe(false)
    })
  })

  describe('getAllUsers', () => {
    it('should return all users', () => {
      const users = [
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' },
      ]
      
      users.forEach(user => service.addUser(user))
      
      expect(service.getAllUsers()).toEqual(users)
    })

    it('should return empty array when no users', () => {
      expect(service.getAllUsers()).toEqual([])
    })
  })
})
```

## 异步测试

### 测试 Promise

```typescript
// src/services/ApiService.ts
export class ApiService {
  async fetchUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    
    return response.json()
  }
}
```

```typescript
// tests/unit/ApiService.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ApiService } from '@/services/ApiService'

describe('ApiService', () => {
  describe('fetchUser', () => {
    it('should fetch user successfully', async () => {
      const mockUser = { id: '1', name: 'John' }
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      })

      const service = new ApiService()
      const user = await service.fetchUser('1')

      expect(user).toEqual(mockUser)
      expect(fetch).toHaveBeenCalledWith('/api/users/1')
    })

    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      const service = new ApiService()

      await expect(service.fetchUser('1')).rejects.toThrow('Failed to fetch user')
    })
  })
})
```

### 测试 async/await

```typescript
// src/utils/delay.ts
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    }
    catch (error) {
      lastError = error as Error
      await delay(1000 * (i + 1))
    }
  }
  
  throw lastError!
}
```

```typescript
// tests/unit/async.test.ts
import { describe, it, expect, vi } from 'vitest'
import { delay, retryAsync } from '@/utils/delay'

describe('Async Utils', () => {
  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now()
      await delay(100)
      const end = Date.now()
      
      expect(end - start).toBeGreaterThanOrEqual(100)
    })
  })

  describe('retryAsync', () => {
    it('should retry on failure', async () => {
      let attempts = 0
      const fn = vi.fn().mockImplementation(async () => {
        attempts++
        if (attempts < 3) {
          throw new Error('Failed')
        }
        return 'success'
      })

      const result = await retryAsync(fn, 3)

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should throw error after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Failed'))

      await expect(retryAsync(fn, 2)).rejects.toThrow('Failed')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
```

## Mock 测试

### Mock 函数

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('Mock Functions', () => {
  it('should call callback function', () => {
    const callback = vi.fn()
    const items = [1, 2, 3]
    
    items.forEach(callback)
    
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0, items)
    expect(callback).toHaveBeenNthCalledWith(2, 2, 1, items)
    expect(callback).toHaveBeenNthCalledWith(3, 3, 2, items)
  })

  it('should mock return value', () => {
    const mockFn = vi.fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default')

    expect(mockFn()).toBe('first')
    expect(mockFn()).toBe('second')
    expect(mockFn()).toBe('default')
    expect(mockFn()).toBe('default')
  })
})
```

### Mock 模块

```typescript
// src/utils/logger.ts
export function log(message: string): void {
  console.log(message)
}

export function error(message: string): void {
  console.error(message)
}
```

```typescript
// tests/unit/logger.test.ts
import { describe, it, expect, vi } from 'vitest'

// Mock 整个模块
vi.mock('@/utils/logger', () => ({
  log: vi.fn(),
  error: vi.fn(),
}))

import { log, error } from '@/utils/logger'

describe('Logger', () => {
  it('should log message', () => {
    log('test message')
    
    expect(log).toHaveBeenCalledWith('test message')
  })

  it('should log error', () => {
    error('error message')
    
    expect(error).toHaveBeenCalledWith('error message')
  })
})
```

## 下一步

- [E2E 测试示例](/examples/e2e-test)
- [组件测试示例](/examples/component-test)
- [Faker Mock 示例](/examples/faker-mock)



