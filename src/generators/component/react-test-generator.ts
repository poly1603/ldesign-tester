/**
 * React 组件测试生成器
 */
import type { GenerateOptions } from '../../types/index.js'
import { createTemplateEngine } from '../../core/template-engine.js'

export class ReactTestGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成 React 组件完整测试
   * @param componentName 组件名称
   * @param options 生成选项
   */
  generateComponentTest(componentName: string, options: GenerateOptions = {}): string {
    const { includeComments = true, variables = {} } = options
    const { props = [], events = [] } = variables

    const template = `${includeComments ? `/**
 * ${componentName} 组件测试
 */
` : ''}import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ${componentName} from './${componentName}'

describe('${componentName}', () => {
  ${includeComments ? '// 组件渲染测试\n  ' : ''}it('should render successfully', () => {
    render(<${componentName} />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  ${props.length > 0 ? `${includeComments ? '// Props 测试\n  ' : ''}describe('Props', () => {
${props.map((prop: any) => `    it('should accept ${prop.name} prop', () => {
      render(<${componentName} ${prop.name}={${this.getMockValue(prop.type)}} />)
      ${prop.type === 'string' ? `expect(screen.getByText(${this.getMockValue(prop.type)})).toBeInTheDocument()` : 'expect(screen.getByRole(\'main\')).toBeInTheDocument()'}
    })
`).join('\n')}  })

  ` : ''}${includeComments ? '// 用户交互测试\n  ' : ''}describe('User Interactions', () => {
    it('should handle button click', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<${componentName} onClick={handleClick} />)
      const button = screen.getByRole('button')
      
      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle input change', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(<${componentName} onChange={handleChange} />)
      const input = screen.getByRole('textbox')
      
      await user.type(input, 'test value')
      expect(input).toHaveValue('test value')
    })

    it('should handle form submission', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn((e) => e.preventDefault())
      
      render(<${componentName} onSubmit={handleSubmit} />)
      const submitButton = screen.getByRole('button', { name: /submit/i })
      
      await user.click(submitButton)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  ${includeComments ? '// Children 测试\n  ' : ''}describe('Children', () => {
    it('should render children', () => {
      render(
        <${componentName}>
          <div data-testid="child">Child Content</div>
        </${componentName}>
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <${componentName}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </${componentName}>
      )
      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })
  })

  ${includeComments ? '// 条件渲染测试\n  ' : ''}describe('Conditional Rendering', () => {
    it('should show/hide elements based on props', () => {
      const { rerender } = render(<${componentName} show={true} />)
      expect(screen.getByTestId('conditional-element')).toBeInTheDocument()
      
      rerender(<${componentName} show={false} />)
      expect(screen.queryByTestId('conditional-element')).not.toBeInTheDocument()
    })
  })

  ${includeComments ? '// 异步操作测试\n  ' : ''}describe('Async Operations', () => {
    it('should load data asynchronously', async () => {
      render(<${componentName} />)
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByText(/data loaded/i)).toBeInTheDocument()
      })
    })

    it('should handle error states', async () => {
      render(<${componentName} shouldError={true} />)
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })

  ${includeComments ? '// 快照测试\n  ' : ''}it('should match snapshot', () => {
    const { container } = render(<${componentName} />)
    expect(container).toMatchSnapshot()
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 React Hooks 测试
   * @param hookName Hook 名称
   * @param options 生成选项
   */
  generateHookTest(hookName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${hookName} Hook 测试
 */
` : ''}import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { ${hookName} } from './${hookName}'

describe('${hookName}', () => {
  it('should return expected values', () => {
    const { result } = renderHook(() => ${hookName}())
    expect(result.current).toBeDefined()
  })

  it('should update state', () => {
    const { result } = renderHook(() => ${hookName}())
    
    act(() => {
      result.current.setValue('new value')
    })
    
    expect(result.current.value).toBe('new value')
  })

  it('should handle side effects', () => {
    const mockCallback = vi.fn()
    const { result } = renderHook(() => ${hookName}({ onEffect: mockCallback }))
    
    act(() => {
      result.current.trigger()
    })
    
    expect(mockCallback).toHaveBeenCalled()
  })

  it('should cleanup on unmount', () => {
    const cleanup = vi.fn()
    const { unmount } = renderHook(() => ${hookName}({ onCleanup: cleanup }))
    
    unmount()
    expect(cleanup).toHaveBeenCalled()
  })

  it('should handle async operations', async () => {
    const { result } = renderHook(() => ${hookName}())
    
    act(() => {
      result.current.fetchData()
    })
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })

  it('should re-render when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ dep }) => ${hookName}(dep),
      { initialProps: { dep: 'initial' } }
    )
    
    const initialValue = result.current.value
    
    rerender({ dep: 'updated' })
    expect(result.current.value).not.toBe(initialValue)
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 Context Provider 测试
   * @param contextName Context 名称
   * @param options 生成选项
   */
  generateContextTest(contextName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${contextName} Context 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ${contextName}Provider, use${contextName} } from './${contextName}Context'

function TestComponent() {
  const context = use${contextName}()
  return <div data-testid="value">{context.value}</div>
}

describe('${contextName} Context', () => {
  it('should provide context values', () => {
    render(
      <${contextName}Provider value={{ value: 'test' }}>
        <TestComponent />
      </${contextName}Provider>
    )
    
    expect(screen.getByTestId('value')).toHaveTextContent('test')
  })

  it('should update context values', () => {
    const { rerender } = render(
      <${contextName}Provider value={{ value: 'initial' }}>
        <TestComponent />
      </${contextName}Provider>
    )
    
    expect(screen.getByTestId('value')).toHaveTextContent('initial')
    
    rerender(
      <${contextName}Provider value={{ value: 'updated' }}>
        <TestComponent />
      </${contextName}Provider>
    )
    
    expect(screen.getByTestId('value')).toHaveTextContent('updated')
  })

  it('should throw error when used outside provider', () => {
    // 使用 console.error mock 来避免错误输出
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow()
    
    spy.mockRestore()
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 Redux Store 测试
   * @param storeName Store 名称
   * @param options 生成选项
   */
  generateReduxTest(storeName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${storeName} Redux Store 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import ${storeName}Reducer, { 
  initialState,
  increment,
  decrement,
  setValue
} from './${storeName}Slice'

describe('${storeName} Redux Store', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ${storeName}: ${storeName}Reducer,
      },
    })
  })

  it('should have initial state', () => {
    const state = store.getState().${storeName}
    expect(state).toEqual(initialState)
  })

  it('should handle increment action', () => {
    store.dispatch(increment())
    const state = store.getState().${storeName}
    expect(state.count).toBe(1)
  })

  it('should handle decrement action', () => {
    store.dispatch(decrement())
    const state = store.getState().${storeName}
    expect(state.count).toBe(-1)
  })

  it('should handle setValue action', () => {
    store.dispatch(setValue(10))
    const state = store.getState().${storeName}
    expect(state.value).toBe(10)
  })

  it('should handle async thunks', async () => {
    await store.dispatch(fetchData())
    const state = store.getState().${storeName}
    expect(state.data).toBeDefined()
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 获取类型的 Mock 值
   */
  private getMockValue(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return '"test"'
      case 'number':
        return '42'
      case 'boolean':
        return 'true'
      case 'array':
        return '[]'
      case 'object':
        return '{}'
      case 'function':
        return 'vi.fn()'
      default:
        return 'null'
    }
  }
}

/**
 * 创建 React 测试生成器实例
 */
export function createReactTestGenerator(): ReactTestGenerator {
  return new ReactTestGenerator()
}



