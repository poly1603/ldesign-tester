# TestGenerator

测试代码生成器，用于生成各类测试文件。

## 创建实例

```typescript
import { createTestGenerator } from '@ldesign/tester'

const generator = createTestGenerator()
```

## 方法

### generateUnitTest

生成单元测试代码。

**签名：**

```typescript
generateUnitTest(componentName: string, options?: GenerateOptions): string
```

**参数：**

- `componentName` - 组件/模块名称
- `options` - 生成选项
  - `outputPath?` - 输出文件路径
  - `includeComments?` - 是否包含注释（默认 `true`）
  - `includeExamples?` - 是否包含示例代码（默认 `true`）
  - `framework?` - 组件框架（`'vue'` | `'react'`）
  - `variables?` - 自定义模板变量

**返回值：**

生成的测试代码字符串

**示例：**

```typescript
const code = generator.generateUnitTest('UserService', {
  includeComments: true,
  includeExamples: true,
})

// 生成的代码：
/**
 * UserService 单元测试
 */
import { describe, it, expect } from 'vitest'
import { UserService } from './UserService'

describe('UserService', () => {
  it('should work correctly', () => {
    expect(true).toBe(true)
  })
  // ...
})
```

### generateE2ETest

生成 E2E 测试代码。

**签名：**

```typescript
generateE2ETest(feature: string, options?: GenerateOptions): string
```

**参数：**

- `feature` - 功能名称
- `options` - 生成选项

**示例：**

```typescript
const code = generator.generateE2ETest('login', {
  includeComments: true,
})
```

### generateComponentTest

生成组件测试代码。

**签名：**

```typescript
generateComponentTest(
  componentName: string,
  framework: ComponentFramework,
  options?: GenerateOptions
): string
```

**参数：**

- `componentName` - 组件名称
- `framework` - 组件框架（`'vue'` | `'react'` | `'angular'` | `'svelte'`）
- `options` - 生成选项

**示例：**

```typescript
// Vue 组件测试
const vueTest = generator.generateComponentTest('Button', 'vue', {
  includeComments: true,
})

// React 组件测试
const reactTest = generator.generateComponentTest('Button', 'react', {
  includeComments: true,
})
```

### generateAPITest

生成 API 测试代码。

**签名：**

```typescript
generateAPITest(apiName: string, options?: GenerateOptions): string
```

**参数：**

- `apiName` - API 名称
- `options` - 生成选项

**示例：**

```typescript
const code = generator.generateAPITest('users', {
  includeComments: true,
  includeExamples: true,
})
```

### generateIntegrationTest

生成集成测试代码。

**签名：**

```typescript
generateIntegrationTest(moduleName: string, options?: GenerateOptions): string
```

**参数：**

- `moduleName` - 模块名称
- `options` - 生成选项

**示例：**

```typescript
const code = generator.generateIntegrationTest('payment', {
  includeComments: true,
})
```

### generate

根据测试类型生成测试代码（统一接口）。

**签名：**

```typescript
generate(type: TestType, name: string, options?: GenerateOptions): string
```

**参数：**

- `type` - 测试类型（`'unit'` | `'e2e'` | `'component'` | `'api'` | `'integration'`）
- `name` - 名称
- `options` - 生成选项

**示例：**

```typescript
// 生成单元测试
const unitTest = generator.generate('unit', 'UserService')

// 生成组件测试
const componentTest = generator.generate('component', 'Button', {
  framework: 'vue',
})

// 生成 API 测试
const apiTest = generator.generate('api', 'users')
```

## 类型定义

### GenerateOptions

```typescript
interface GenerateOptions {
  /** 输出文件路径 */
  outputPath?: string
  
  /** 组件框架 */
  framework?: ComponentFramework
  
  /** 是否覆盖已存在的文件 */
  overwrite?: boolean
  
  /** 是否包含示例测试 */
  includeExamples?: boolean
  
  /** 是否包含注释 */
  includeComments?: boolean
  
  /** 自定义变量 */
  variables?: Record<string, any>
}
```

### TestType

```typescript
type TestType = 'unit' | 'e2e' | 'component' | 'api' | 'integration'
```

### ComponentFramework

```typescript
type ComponentFramework = 'vue' | 'react' | 'angular' | 'svelte'
```

## 完整示例

### 生成并保存测试文件

```typescript
import { createTestGenerator } from '@ldesign/tester'
import fs from 'node:fs'
import path from 'node:path'

const generator = createTestGenerator()

// 生成单元测试
const unitTest = generator.generateUnitTest('UserService', {
  includeComments: true,
  includeExamples: true,
})

// 确保目录存在
const testDir = path.join(process.cwd(), 'tests', 'unit')
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true })
}

// 保存文件
const filePath = path.join(testDir, 'UserService.test.ts')
fs.writeFileSync(filePath, unitTest)

console.log(`✅ 已创建测试文件: ${filePath}`)
```

### 批量生成测试

```typescript
import { createTestGenerator } from '@ldesign/tester'

const generator = createTestGenerator()

const modules = ['UserService', 'ProductService', 'OrderService']

modules.forEach((moduleName) => {
  const test = generator.generateUnitTest(moduleName)
  // 保存到文件...
})
```

### 自定义模板变量

```typescript
const test = generator.generateUnitTest('UserService', {
  variables: {
    author: 'Your Name',
    date: new Date().toISOString(),
    customImports: ['import { mockUser } from \'./mocks\''],
  },
})
```

## 相关 API

- [ConfigGenerator](/api/config-generator) - 配置生成器
- [MockGenerator](/api/mock-generator) - Mock 生成器
- [ReportGenerator](/api/report-generator) - 报告生成器



