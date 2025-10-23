# Vue 项目集成示例

完整的 Vue 项目测试集成示例。

## 项目结构

```
my-vue-app/
├── src/
│   ├── components/
│   │   ├── Button.vue
│   │   └── Input.vue
│   ├── composables/
│   │   └── useCounter.ts
│   └── utils/
│       └── format.ts
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── Button.test.ts
│   │   │   └── Input.test.ts
│   │   ├── composables/
│   │   │   └── useCounter.test.ts
│   │   └── utils/
│   │       └── format.test.ts
│   ├── fixtures/
│   │   └── users.ts
│   ├── mocks/
│   │   └── api.ts
│   └── setup.ts
├── e2e/
│   └── app.spec.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

## 初始化

```bash
# 1. 安装依赖
pnpm add -D @ldesign/tester vitest @vue/test-utils @vitest/ui @vitest/coverage-v8

# 2. 生成配置
npx ldesign-test init vitest --environment jsdom --plugins vue

# 3. 生成测试脚手架
npx ldesign-test scaffold
```

## 组件测试

### Button 组件

```vue
<!-- src/components/Button.vue -->
<script setup lang="ts">
interface Props {
  type?: 'primary' | 'default' | 'danger'
  disabled?: boolean
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<template>
  <button
    :class="['btn', `btn--${type}`]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading">Loading...</span>
    <slot v-else />
  </button>
</template>

<style scoped>
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.btn--primary { background: #1890ff; color: white; }
.btn--danger { background: #ff4d4f; color: white; }
</style>
```

生成测试：

```bash
npx ldesign-test generate component Button --framework vue
```

完善后的测试：

```typescript
// tests/unit/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/Button.vue'

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })
    
    expect(wrapper.text()).toBe('Click me')
  })

  it('should apply type class', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
      },
    })
    
    expect(wrapper.classes()).toContain('btn--primary')
  })

  it('should be disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('should show loading state', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    })
    
    expect(wrapper.text()).toBe('Loading...')
  })

  it('should emit click event', async () => {
    const wrapper = mount(Button)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
```

## Composable 测试

### useCounter

```typescript
// src/composables/useCounter.ts
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
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
// tests/unit/composables/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment', () => {
    const { count, increment } = useCounter(0)
    
    increment()
    expect(count.value).toBe(1)
    
    increment()
    expect(count.value).toBe(2)
  })

  it('should decrement', () => {
    const { count, decrement } = useCounter(5)
    
    decrement()
    expect(count.value).toBe(4)
  })

  it('should reset to initial value', () => {
    const { count, increment, reset } = useCounter(10)
    
    increment()
    increment()
    expect(count.value).toBe(12)
    
    reset()
    expect(count.value).toBe(10)
  })
})
```

## E2E 测试

```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Vue App', () => {
  test('should render home page', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Vue App/)
  })

  test('should interact with counter', async ({ page }) => {
    await page.goto('/')
    
    // 点击增加按钮
    await page.click('button:has-text("Increment")')
    
    // 验证计数器值
    await expect(page.locator('.counter-value')).toHaveText('1')
  })

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')
    
    // 点击导航链接
    await page.click('a:has-text("About")')
    
    // 验证 URL
    expect(page.url()).toContain('/about')
    
    // 验证页面内容
    await expect(page.locator('h1')).toHaveText('About')
  })
})
```

## Mock 集成

### API Mock

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: '张三', email: 'zhangsan@example.com' },
      { id: '2', name: '李四', email: 'lisi@example.com' },
    ])
  }),

  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json()
    return HttpResponse.json(
      { id: String(Date.now()), ...newUser },
      { status: 201 },
    )
  }),
]
```

```typescript
// tests/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### 在测试中使用

```typescript
// tests/unit/services/UserService.test.ts
import { describe, it, expect } from 'vitest'
import { UserService } from '@/services/UserService'

describe('UserService', () => {
  it('should fetch users', async () => {
    const service = new UserService()
    const users = await service.fetchUsers()
    
    expect(users).toHaveLength(2)
    expect(users[0].name).toBe('张三')
  })

  it('should create user', async () => {
    const service = new UserService()
    const newUser = { name: '王五', email: 'wangwu@example.com' }
    
    const created = await service.createUser(newUser)
    
    expect(created.name).toBe('王五')
    expect(created.id).toBeDefined()
  })
})
```

## 覆盖率配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
      thresholds: {
        global: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  },
})
```

## 运行测试

```bash
# 运行所有测试
npm test

# 监视模式
npm test -- --watch

# 生成覆盖率
npm run test:coverage

# UI 模式
npm test -- --ui

# 运行 E2E 测试
npm run test:e2e
```

## package.json 配置

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@ldesign/tester": "^1.0.0",
    "@playwright/test": "^1.40.1",
    "@vitejs/plugin-vue": "^5.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^24.0.0",
    "msw": "^2.0.0",
    "vitest": "^2.0.0",
    "vue": "^3.4.0"
  }
}
```

## 下一步

- [React 项目示例](/examples/react)
- [API 测试示例](/examples/api)
- [测试生成详解](/guide/test-generation)



