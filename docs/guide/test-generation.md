# 测试生成

@ldesign/tester 提供强大的测试生成功能，支持多种测试类型和框架。

## 测试类型

### 单元测试

单元测试用于测试独立的函数、类或模块。

```bash
npx ldesign-test generate unit UserService
```

**生成选项**:
- `--output, -o` - 指定输出路径
- `--no-comments` - 不包含注释
- `--no-examples` - 不包含示例代码

**示例**:

```bash
# 自定义输出路径
npx ldesign-test generate unit UserService --output src/__tests__/UserService.test.ts

# 不包含注释和示例
npx ldesign-test generate unit UserService --no-comments --no-examples
```

**生成的代码**:

```typescript
import { describe, it, expect } from 'vitest'
import { UserService } from './UserService'

describe('UserService', () => {
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

### E2E 测试

端到端测试用于测试完整的用户流程。

```bash
npx ldesign-test generate e2e login
```

**生成的代码**:

```typescript
import { test, expect } from '@playwright/test'

test.describe('login', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/.*/)
  })

  test('should handle user interactions', async ({ page }) => {
    await page.goto('/')
    // TODO: 添加交互测试
  })

  test('should submit form successfully', async ({ page }) => {
    await page.goto('/')
    // TODO: 添加表单测试
  })
})
```

### 组件测试

#### Vue 组件

```bash
npx ldesign-test generate component Button --framework vue
```

**生成的代码**:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button)
    expect(wrapper.exists()).toBe(true)
  })

  it('should accept props', () => {
    const wrapper = mount(Button, {
      props: {
        title: 'Test Title',
      },
    })
    expect(wrapper.text()).toContain('Test Title')
  })

  it('should emit events', async () => {
    const wrapper = mount(Button)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('should render slots', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '<div>Slot Content</div>',
      },
    })
    expect(wrapper.text()).toContain('Slot Content')
  })
})
```

#### React 组件

```bash
npx ldesign-test generate component Button --framework react
```

**生成的代码**:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should accept props', () => {
    render(<Button title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<Button />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### API 测试

用于测试 RESTful API 端点。

```bash
npx ldesign-test generate api users
```

**生成的代码**:

```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from './app'

describe('users API', () => {
  it('GET should return data', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200)
    
    expect(response.body).toBeDefined()
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('POST should create resource', async () => {
    const newData = { name: 'Test', value: 123 }
    
    const response = await request(app)
      .post('/api/users')
      .send(newData)
      .expect(201)
    
    expect(response.body).toMatchObject(newData)
  })

  it('PUT should update resource', async () => {
    const updateData = { name: 'Updated' }
    
    const response = await request(app)
      .put('/api/users/1')
      .send(updateData)
      .expect(200)
    
    expect(response.body.name).toBe('Updated')
  })

  it('DELETE should remove resource', async () => {
    await request(app)
      .delete('/api/users/1')
      .expect(204)
  })
})
```

### 集成测试

用于测试模块间的协作。

```bash
npx ldesign-test generate integration payment
```

**生成的代码**:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('payment Integration', () => {
  beforeAll(async () => {
    // 初始化测试环境
  })

  afterAll(async () => {
    // 清理测试环境
  })

  it('should complete end-to-end flow', async () => {
    // TODO: 测试完整的业务流程
    expect(true).toBe(true)
  })

  it('should integrate with other modules', async () => {
    // TODO: 测试模块间的协作
    expect(true).toBe(true)
  })
})
```

## 编程方式使用

你也可以在代码中使用 TestGenerator API：

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
  {
    includeComments: true,
    includeExamples: true,
  }
)

// 保存到文件
import fs from 'node:fs'
fs.writeFileSync('tests/unit/UserService.test.ts', unitTest)
```

## 自定义模板

如果需要自定义测试模板，可以通过扩展 TestGenerator：

```typescript
import { TestGenerator } from '@ldesign/tester'

class CustomTestGenerator extends TestGenerator {
  generateCustomTest(name: string): string {
    return `
import { describe, it, expect } from 'vitest'

describe('${name}', () => {
  it('custom test', () => {
    // 自定义测试逻辑
  })
})
    `.trim()
  }
}

const generator = new CustomTestGenerator()
const test = generator.generateCustomTest('MyTest')
```

## 最佳实践

### 测试命名

- 使用描述性的测试名称
- 使用 `should` 开头描述预期行为
- 按功能分组测试用例

```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when id exists', () => {})
    it('should return null when id does not exist', () => {})
    it('should throw error when id is invalid', () => {})
  })
})
```

### AAA 模式

遵循 Arrange-Act-Assert 模式：

```typescript
it('should add two numbers', () => {
  // Arrange: 准备测试数据
  const a = 1
  const b = 2
  
  // Act: 执行被测试的操作
  const result = add(a, b)
  
  // Assert: 验证结果
  expect(result).toBe(3)
})
```

### 测试隔离

每个测试应该独立，不依赖其他测试：

```typescript
describe('Counter', () => {
  let counter: Counter
  
  beforeEach(() => {
    // 每个测试前重新创建实例
    counter = new Counter()
  })
  
  it('should increment', () => {
    counter.increment()
    expect(counter.value).toBe(1)
  })
  
  it('should decrement', () => {
    counter.decrement()
    expect(counter.value).toBe(-1)
  })
})
```

## 下一步

- [Mock 系统](/guide/mock-system) - 学习如何 Mock 数据
- [配置生成](/guide/config-generation) - 生成测试配置
- [API 参考](/api/test-generator) - TestGenerator API 文档



