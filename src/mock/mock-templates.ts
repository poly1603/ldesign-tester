/**
 * Mock 模板生成器
 */

export class MockTemplates {
  /**
   * 生成 localStorage Mock
   */
  generateLocalStorageMock(): string {
    return `/**
 * localStorage Mock
 */
export const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem(key: string): string | null {
      return store[key] || null
    },
    setItem(key: string, value: string): void {
      store[key] = value.toString()
    },
    removeItem(key: string): void {
      delete store[key]
    },
    clear(): void {
      store = {}
    },
    get length(): number {
      return Object.keys(store).length
    },
    key(index: number): string | null {
      const keys = Object.keys(store)
      return keys[index] || null
    },
  }
})()

// 使用: Object.defineProperty(window, 'localStorage', { value: localStorageMock })
`
  }

  /**
   * 生成 Timer Mock
   */
  generateTimerMock(): string {
    return `/**
 * Timer Mock 示例
 */
import { vi } from 'vitest'

// 启用假计时器
vi.useFakeTimers()

// 快进时间
vi.advanceTimersByTime(1000) // 1秒

// 运行所有定时器
vi.runAllTimers()

// 运行待处理的定时器
vi.runOnlyPendingTimers()

// 恢复真实计时器
vi.useRealTimers()
`
  }

  /**
   * 生成函数 Mock 模板
   */
  generateFunctionMock(): string {
    return `/**
 * 函数 Mock 模板
 */
import { vi } from 'vitest'

// 创建 Mock 函数
const mockFn = vi.fn()

// Mock 函数返回值
mockFn.mockReturnValue('result')

// Mock 函数返回Promise
mockFn.mockResolvedValue('async result')

// Mock 函数抛出错误
mockFn.mockRejectedValue(new Error('error'))

// Mock 实现
mockFn.mockImplementation((arg) => {
  return \`result: \${arg}\`
})

// 检查调用
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg')
expect(mockFn).toHaveBeenCalledTimes(1)

// 清除 Mock
mockFn.mockClear()
mockFn.mockReset()
mockFn.mockRestore()
`
  }

  /**
   * 生成模块 Mock 模板
   */
  generateModuleMock(moduleName: string): string {
    return `/**
 * ${moduleName} 模块 Mock
 */
import { vi } from 'vitest'

vi.mock('./${moduleName}', () => ({
  ${moduleName}: vi.fn(),
  default: vi.fn(),
}))

// 或使用自动 Mock
vi.mock('./${moduleName}')

// Spy on 模块方法
import * as ${moduleName}Module from './${moduleName}'
const spy = vi.spyOn(${moduleName}Module, 'methodName')

// 检查调用
expect(spy).toHaveBeenCalled()

// 清理
spy.mockRestore()
`
  }

  /**
   * 生成 Fetch Mock
   */
  generateFetchMock(): string {
    return `/**
 * Fetch API Mock
 */
import { vi } from 'vitest'

global.fetch = vi.fn((url, options) => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: 'mocked' }),
    text: () => Promise.resolve('mocked text'),
    blob: () => Promise.resolve(new Blob()),
    headers: new Headers(),
  } as Response)
})

// 使用
const response = await fetch('/api/data')
const data = await response.json()
expect(data).toEqual({ data: 'mocked' })

// 清理
vi.restoreAllMocks()
`
  }

  /**
   * 生成 Vue 组件 Mock
   */
  generateVueComponentMock(componentName: string): string {
    return `/**
 * ${componentName} 组件 Mock
 */
import { defineComponent, h } from 'vue'

export const Mock${componentName} = defineComponent({
  name: 'Mock${componentName}',
  props: ['modelValue', 'placeholder'],
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => h('div', { 'data-testid': '${componentName.toLowerCase()}-mock' }, 'Mock ${componentName}')
  },
})

// 在测试中使用
import { mount } from '@vue/test-utils'

const wrapper = mount(ParentComponent, {
  global: {
    stubs: {
      ${componentName}: Mock${componentName},
    },
  },
})
`
  }

  /**
   * 生成 React 组件 Mock
   */
  generateReactComponentMock(componentName: string): string {
    return `/**
 * ${componentName} 组件 Mock
 */
import { vi } from 'vitest'

vi.mock('./${componentName}', () => ({
  default: ({ children, ...props }: any) => (
    <div data-testid="${componentName.toLowerCase()}-mock" {...props}>
      {children}
    </div>
  ),
}))

// 或使用 jest.fn()
const Mock${componentName} = vi.fn(({ children }) => <div>{children}</div>)

export default Mock${componentName}
`
  }
}

export function createMockTemplates(): MockTemplates {
  return new MockTemplates()
}



