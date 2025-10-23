# React 项目集成示例

完整的 React 项目测试集成示例。

## 项目结构

```
my-react-app/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── hooks/
│   │   └── useCounter.ts
│   └── utils/
│       └── format.ts
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── fixtures/
│   └── setup.ts
├── vitest.config.ts
└── package.json
```

## 初始化

```bash
# 1. 安装依赖
pnpm add -D @ldesign/tester vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom

# 2. 生成配置
npx ldesign-test init vitest --environment jsdom --plugins react

# 3. 生成 setup 文件
```

## 组件测试

### Button 组件

```tsx
// src/components/Button.tsx
import React from 'react'

interface ButtonProps {
  type?: 'primary' | 'default' | 'danger'
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
}

export function Button({
  type = 'default',
  disabled = false,
  loading = false,
  onClick,
  children,
}: ButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    onClick?.(event)
  }

  return (
    <button
      className={`btn btn--${type}`}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

生成测试：

```bash
npx ldesign-test generate component Button --framework react
```

完善后的测试：

```typescript
// tests/unit/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should apply type class', () => {
    render(<Button type="primary">Primary</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn--primary')
  })

  it('should be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should show loading state', () => {
    render(<Button loading>Submit</Button>)
    
    expect(screen.getByRole('button')).toHaveTextContent('Loading...')
  })

  it('should handle click event', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not trigger click when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button disabled onClick={handleClick}>Click</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })
})
```

## Hook 测试

### useCounter Hook

```typescript
// src/hooks/useCounter.ts
import { useState } from 'react'

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initialValue)
  
  return {
    count,
    increment,
    decrement,
    reset,
  }
}
```

测试：

```typescript
// tests/unit/hooks/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter())
    
    expect(result.current.count).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10))
    
    expect(result.current.count).toBe(10)
  })

  it('should increment', () => {
    const { result } = renderHook(() => useCounter(0))
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })

  it('should decrement', () => {
    const { result } = renderHook(() => useCounter(5))
    
    act(() => {
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(4)
  })

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(10))
    
    act(() => {
      result.current.increment()
      result.current.increment()
    })
    
    expect(result.current.count).toBe(12)
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.count).toBe(10)
  })
})
```

## 表单测试

```tsx
// src/components/LoginForm.tsx
import React, { useState } from 'react'

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        aria-label="Username"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

测试：

```typescript
// tests/unit/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/LoginForm'

describe('LoginForm', () => {
  it('should render form fields', () => {
    render(<LoginForm onSubmit={() => {}} />)
    
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('should handle form submission', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    
    render(<LoginForm onSubmit={handleSubmit} />)
    
    // 填写表单
    await user.type(screen.getByLabelText('Username'), 'testuser')
    await user.type(screen.getByLabelText('Password'), 'password123')
    
    // 提交表单
    await user.click(screen.getByRole('button', { name: 'Login' }))
    
    // 验证提交
    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    })
  })

  it('should update input values', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm onSubmit={() => {}} />)
    
    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
    
    await user.type(usernameInput, 'john')
    await user.type(passwordInput, 'secret')
    
    expect(usernameInput.value).toBe('john')
    expect(passwordInput.value).toBe('secret')
  })
})
```

## package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "@ldesign/tester": "^1.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@vitest/coverage-v8": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "jsdom": "^24.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vitest": "^2.0.0"
  }
}
```

## 下一步

- [API 测试示例](/examples/api)
- [Mock 系统详解](/guide/mock-system)



