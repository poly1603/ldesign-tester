/**
 * 单元测试生成器
 */
import type { GenerateOptions, TemplateVariables } from '../../types/index.js'
import { createTemplateEngine } from '../../core/template-engine.js'

export class UnitTestGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成函数测试
   * @param functionName 函数名
   * @param params 函数参数
   * @param returnType 返回类型
   * @param options 生成选项
   */
  generateFunctionTest(
    functionName: string,
    params: string[] = [],
    returnType: string = 'any',
    options: GenerateOptions = {},
  ): string {
    const { includeComments = true } = options

    const variables: TemplateVariables = {
      name: functionName,
      functions: [{
        name: functionName,
        params: params.join(', '),
        returnType,
      }],
    }

    const template = `${includeComments ? `/**
 * ${functionName} 函数测试
 */
` : ''}import { describe, it, expect, vi } from 'vitest'
import { ${functionName} } from './${functionName}'

describe('${functionName}', () => {
  it('should return expected result', () => {
    const result = ${functionName}(${params.map((_, i) => `param${i + 1}`).join(', ')})
    expect(result).toBeDefined()
  })

  it('should handle invalid input', () => {
    expect(() => ${functionName}(${params.map(() => 'null').join(', ')})).toThrow()
  })

  it('should be called with correct arguments', () => {
    const spy = vi.fn(${functionName})
    spy(${params.map((_, i) => `param${i + 1}`).join(', ')})
    expect(spy).toHaveBeenCalledWith(${params.map((_, i) => `param${i + 1}`).join(', ')})
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成类测试
   * @param className 类名
   * @param methods 方法列表
   * @param options 生成选项
   */
  generateClassTest(
    className: string,
    methods: Array<{ name: string; params?: string[]; returnType?: string }> = [],
    options: GenerateOptions = {},
  ): string {
    const { includeComments = true } = options

    const methodTests = methods.map(method => `
  it('should call ${method.name} method', () => {
    const instance = new ${className}()
    ${method.params && method.params.length > 0
        ? `const result = instance.${method.name}(${method.params.map((_, i) => `param${i + 1}`).join(', ')})`
        : `const result = instance.${method.name}()`
      }
    expect(result).toBeDefined()
  })
`).join('\n')

    const template = `${includeComments ? `/**
 * ${className} 类测试
 */
` : ''}import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ${className} } from './${className}'

describe('${className}', () => {
  let instance: ${className}

  beforeEach(() => {
    instance = new ${className}()
  })

  afterEach(() => {
    // 清理
  })

  it('should create instance', () => {
    expect(instance).toBeInstanceOf(${className})
  })
${methodTests}
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成工具函数测试
   * @param utilName 工具名称
   * @param functions 函数列表
   * @param options 生成选项
   */
  generateUtilTest(
    utilName: string,
    functions: string[] = [],
    options: GenerateOptions = {},
  ): string {
    const { includeComments = true } = options

    const functionTests = functions.map(fn => `
  describe('${fn}', () => {
    it('should work correctly', () => {
      const result = ${fn}()
      expect(result).toBeDefined()
    })

    it('should handle edge cases', () => {
      // TODO: 添加边界条件测试
      expect(true).toBe(true)
    })
  })
`).join('\n')

    const template = `${includeComments ? `/**
 * ${utilName} 工具测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import { ${functions.join(', ')} } from './${utilName}'

describe('${utilName}', () => {
${functionTests}
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成异步函数测试
   * @param functionName 函数名
   * @param options 生成选项
   */
  generateAsyncTest(functionName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${functionName} 异步函数测试
 */
` : ''}import { describe, it, expect, vi } from 'vitest'
import { ${functionName} } from './${functionName}'

describe('${functionName}', () => {
  it('should resolve with correct value', async () => {
    const result = await ${functionName}()
    expect(result).toBeDefined()
  })

  it('should reject on error', async () => {
    await expect(${functionName}()).rejects.toThrow()
  })

  it('should handle timeout', async () => {
    vi.useFakeTimers()
    const promise = ${functionName}()
    vi.advanceTimersByTime(5000)
    await expect(promise).resolves.toBeDefined()
    vi.useRealTimers()
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 Hook 测试（Vue Composition API 或 React Hooks）
   * @param hookName Hook 名称
   * @param framework 框架
   * @param options 生成选项
   */
  generateHookTest(
    hookName: string,
    framework: 'vue' | 'react',
    options: GenerateOptions = {},
  ): string {
    const { includeComments = true } = options

    if (framework === 'vue') {
      const template = `${includeComments ? `/**
 * ${hookName} Composable 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import { ${hookName} } from './${hookName}'

describe('${hookName}', () => {
  it('should return expected values', () => {
    const result = ${hookName}()
    expect(result).toBeDefined()
  })

  it('should be reactive', () => {
    const { value, setValue } = ${hookName}()
    expect(value.value).toBeDefined()
    setValue('new value')
    expect(value.value).toBe('new value')
  })
})
`
      return this.templateEngine.formatCode(template)
    }
    else {
      const template = `${includeComments ? `/**
 * ${hookName} Hook 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
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
})
`
      return this.templateEngine.formatCode(template)
    }
  }
}

/**
 * 创建单元测试生成器实例
 */
export function createUnitTestGenerator(): UnitTestGenerator {
  return new UnitTestGenerator()
}




