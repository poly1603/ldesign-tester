/**
 * Mock 生成器 - Mock 系统统一接口
 */
import type { APISpec, MockOptions, MockType } from '../types/index.js'
import { createFakerGenerator, type MockUser, type MockProduct, type MockOrder } from './faker-generator.js'
import { createMSWGenerator, type Endpoint } from './msw-generator.js'

/**
 * Mock 生成器类 - 统一的 Mock 生成接口
 */
export class MockGenerator {
  private fakerGenerator = createFakerGenerator()
  private mswGenerator = createMSWGenerator()

  /**
   * 生成 Mock 数据或代码
   * @param type Mock 类型
   * @param options Mock 选项
   * @returns Mock 数据或代码
   */
  generate(type: MockType, options: MockOptions): unknown | string {
    switch (type) {
      case 'faker':
        return this.fakerGenerator.generateMockData(options)

      case 'msw':
        if (!options.apiSpec) {
          throw new Error('MSW Mock 需要提供 apiSpec 参数')
        }
        return this.mswGenerator.generateHandler(options.apiSpec)

      case 'function':
        return this.generateFunctionMock(options)

      case 'module':
        return this.generateModuleMock(options)

      case 'component':
        return this.generateComponentMock(options)

      default:
        throw new Error(`不支持的 Mock 类型: ${type}`)
    }
  }

  /**
   * 生成 Faker Mock 数据
   * @param options Mock 选项
   * @returns Mock 数据
   */
  generateFakerMock(options: MockOptions): unknown {
    return this.fakerGenerator.generateMockData(options)
  }

  /**
   * 生成 MSW Handler 代码
   * @param apiSpec API 规范
   * @returns Handler 代码
   */
  generateMSWHandler(apiSpec: APISpec): string {
    return this.mswGenerator.generateHandler(apiSpec)
  }

  /**
   * 生成多个 MSW Handlers
   * @param endpoints 端点列表
   * @returns Handlers 代码
   */
  generateMSWHandlers(endpoints: Endpoint[]): string {
    return this.mswGenerator.generateRESTHandlers(endpoints)
  }

  /**
   * 生成 CRUD Handlers
   * @param resource 资源名称
   * @param basePath 基础路径
   * @returns Handlers 代码
   */
  generateCRUDHandlers(resource: string, basePath = '/api'): string {
    return this.mswGenerator.generateCRUDHandlers(resource, basePath)
  }

  /**
   * 生成函数 Mock
   * @param options Mock 选项
   * @returns Mock 代码
   */
  private generateFunctionMock(options: MockOptions): string {
    const { variables = {} } = options
    const { functionName = 'mockFunction', returnValue = 'undefined' } = variables

    return `import { vi } from 'vitest'

/**
 * Mock ${functionName}
 */
export const ${functionName} = vi.fn(() => ${JSON.stringify(returnValue)})
`
  }

  /**
   * 生成模块 Mock
   * @param options Mock 选项
   * @returns Mock 代码
   */
  private generateModuleMock(options: MockOptions): string {
    const { variables = {} } = options
    const { moduleName = './module', exports: moduleExports = {} } = variables

    const exportsStr = Object.entries(moduleExports as Record<string, unknown>)
      .map(([key, value]) => `  ${key}: vi.fn(() => ${JSON.stringify(value)})`)
      .join(',\n')

    return `import { vi } from 'vitest'

/**
 * Mock ${moduleName}
 */
vi.mock('${moduleName}', () => ({
${exportsStr},
}))
`
  }

  /**
   * 生成组件 Mock（Vue）
   * @param options Mock 选项
   * @returns Mock 代码
   */
  private generateComponentMock(options: MockOptions): string {
    const { variables = {} } = options
    const { componentName = 'Component', framework = 'vue' } = variables

    if (framework === 'vue') {
      return `import { vi } from 'vitest'

/**
 * Mock ${componentName} 组件
 */
vi.mock('./${componentName}.vue', () => ({
  default: {
    name: '${componentName}',
    template: '<div data-testid="${componentName.toLowerCase()}-mock">Mock ${componentName}</div>',
  },
}))
`
    }

    if (framework === 'react') {
      return `import { vi } from 'vitest'

/**
 * Mock ${componentName} 组件
 */
vi.mock('./${componentName}', () => ({
  default: () => <div data-testid="${componentName.toLowerCase()}-mock">Mock ${componentName}</div>,
}))
`
    }

    throw new Error(`不支持的框架: ${framework}`)
  }

  /**
   * 生成常用数据类型的 Mock
   * @param dataType 数据类型
   * @param count 数量
   * @param locale 语言环境
   * @returns Mock 数据
   */
  generateCommonData(
    dataType: 'user' | 'product' | 'order',
    count = 1,
    locale: 'zh_CN' | 'en_US' = 'zh_CN',
  ): MockUser[] | MockProduct[] | MockOrder[] {
    this.fakerGenerator.setLocale(locale)

    switch (dataType) {
      case 'user':
        return this.fakerGenerator.generateUsers(count)
      case 'product':
        return this.fakerGenerator.generateProducts(count)
      case 'order':
        return this.fakerGenerator.generateOrders(count)
      default:
        throw new Error(`不支持的数据类型: ${dataType}`)
    }
  }

  /**
   * 生成 MSW 完整脚手架
   * @param options 配置选项
   * @returns 文件映射
   */
  generateMSWScaffold(options: {
    endpoints?: Endpoint[]
    resources?: string[]
    environment: 'browser' | 'node'
  }): Record<string, string> {
    return this.mswGenerator.generateMSWScaffold(options)
  }
}

/**
 * 创建 Mock 生成器实例
 */
export function createMockGenerator(): MockGenerator {
  return new MockGenerator()
}



