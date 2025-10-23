/**
 * MSW Handler 生成器 - 生成 MSW (Mock Service Worker) Handler 代码
 */
import type { APISpec } from '../types/index.js'
import { createTemplateEngine } from '../core/template-engine.js'

/**
 * API 端点定义
 */
export interface Endpoint {
  /** HTTP 方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** API 路径 */
  path: string
  /** 响应数据 */
  response?: unknown
  /** 状态码 */
  statusCode?: number
  /** 描述 */
  description?: string
}

/**
 * MSW Handler 生成器类
 */
export class MSWGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成单个 Handler
   * @param apiSpec API 规范
   * @returns Handler 代码
   */
  generateHandler(apiSpec: APISpec): string {
    const { method, path, response = {}, statusCode = 200 } = apiSpec

    const methodLower = method.toLowerCase()
    const responseStr = JSON.stringify(response, null, 2).replace(/\n/g, '\n      ')

    const template = `http.${methodLower}('${path}', () => {
  return HttpResponse.json(
    ${responseStr},
    { status: ${statusCode} }
  )
})`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 REST API Handlers
   * @param endpoints 端点列表
   * @returns Handlers 代码
   */
  generateRESTHandlers(endpoints: Endpoint[]): string {
    const imports = this.templateEngine.generateImports([
      { from: 'msw', imports: ['http', 'HttpResponse'] },
    ])

    const handlers = endpoints
      .map(endpoint => this.generateHandler(endpoint))
      .join(',\n  ')

    const template = `${imports}

/**
 * Mock API Handlers
 */
export const handlers = [
  ${handlers},
]
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 CRUD Handlers（完整的增删改查）
   * @param resource 资源名称（如 'users'）
   * @param basePath 基础路径（如 '/api'）
   * @returns Handlers 代码
   */
  generateCRUDHandlers(resource: string, basePath = '/api'): string {
    const resourcePath = `${basePath}/${resource}`
    const singlePath = `${resourcePath}/:id`

    const template = `import { http, HttpResponse } from 'msw'

/**
 * ${resource} CRUD Handlers
 */

// 模拟数据存储
let ${resource}Data: any[] = []

export const ${resource}Handlers = [
  // 获取列表
  http.get('${resourcePath}', () => {
    return HttpResponse.json(${resource}Data)
  }),

  // 获取单个
  http.get('${singlePath}', ({ params }) => {
    const item = ${resource}Data.find(d => d.id === params.id)
    if (!item) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(item)
  }),

  // 创建
  http.post('${resourcePath}', async ({ request }) => {
    const newItem = await request.json() as any
    const item = {
      id: String(Date.now()),
      ...newItem,
      createdAt: new Date().toISOString(),
    }
    ${resource}Data.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // 更新
  http.put('${singlePath}', async ({ params, request }) => {
    const index = ${resource}Data.findIndex(d => d.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    const updates = await request.json() as any
    ${resource}Data[index] = {
      ...${resource}Data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(${resource}Data[index])
  }),

  // 删除
  http.delete('${singlePath}', ({ params }) => {
    const index = ${resource}Data.findIndex(d => d.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    ${resource}Data.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 GraphQL Handler
   * @param operations GraphQL 操作列表
   * @returns Handler 代码
   */
  generateGraphQLHandlers(operations: Array<{ name: string; type: 'query' | 'mutation'; response: unknown }>): string {
    const imports = this.templateEngine.generateImports([
      { from: 'msw', imports: ['graphql', 'HttpResponse'] },
    ])

    const handlers = operations.map((op) => {
      const responseStr = JSON.stringify(op.response, null, 2).replace(/\n/g, '\n      ')
      const handlerType = op.type === 'query' ? 'query' : 'mutation'

      return `  graphql.${handlerType}('${op.name}', () => {
    return HttpResponse.json({
      data: ${responseStr},
    })
  })`
    }).join(',\n')

    const template = `${imports}

/**
 * GraphQL Mock Handlers
 */
export const graphqlHandlers = [
${handlers},
]
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 MSW 浏览器配置
   * @returns 浏览器配置代码
   */
  generateBrowserSetup(): string {
    const template = `import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW 浏览器 Worker
 */
export const worker = setupWorker(...handlers)

/**
 * 启动 MSW
 */
export function startMocking(): void {
  worker.start({
    onUnhandledRequest: 'warn',
  })
}
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 MSW Node.js 配置
   * @returns Node.js 配置代码
   */
  generateNodeSetup(): string {
    const template = `import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * MSW 服务器
 */
export const server = setupServer(...handlers)

/**
 * 测试前启动 MSW
 */
export function setupMSW(): void {
  // 在所有测试前启动服务器
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

  // 每个测试后重置 handlers
  afterEach(() => server.resetHandlers())

  // 所有测试后关闭服务器
  afterAll(() => server.close())
}
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成完整的 MSW 脚手架
   * @param options 配置选项
   * @returns 文件映射 { 文件路径: 内容 }
   */
  generateMSWScaffold(options: {
    endpoints?: Endpoint[]
    resources?: string[]
    environment: 'browser' | 'node'
  }): Record<string, string> {
    const { endpoints = [], resources = [], environment } = options
    const files: Record<string, string> = {}

    // 生成 handlers
    if (endpoints.length > 0) {
      files['mocks/handlers.ts'] = this.generateRESTHandlers(endpoints)
    }

    // 生成 CRUD handlers
    resources.forEach((resource) => {
      files[`mocks/${resource}-handlers.ts`] = this.generateCRUDHandlers(resource)
    })

    // 生成环境配置
    if (environment === 'browser') {
      files['mocks/browser.ts'] = this.generateBrowserSetup()
    }
    else {
      files['mocks/server.ts'] = this.generateNodeSetup()
    }

    return files
  }
}

/**
 * 创建 MSW 生成器实例
 */
export function createMSWGenerator(): MSWGenerator {
  return new MSWGenerator()
}



