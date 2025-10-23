/**
 * MSW (Mock Service Worker) 集成
 */
import type { APISpec } from '../types/index.js'

export class MSWIntegration {
  /**
   * 生成 MSW Handler 代码
   */
  generateHandlers(apis: APISpec[]): string {
    const handlers = apis.map(api => this.generateHandler(api)).join('\n\n')

    return `import { http, HttpResponse } from 'msw'

export const handlers = [
${handlers}
]
`
  }

  /**
   * 生成单个 Handler
   */
  private generateHandler(api: APISpec): string {
    const method = api.method.toLowerCase()
    const response = api.response || { message: 'Success' }
    const statusCode = api.statusCode || 200

    return `  http.${method}('${api.path}', () => {
    return HttpResponse.json(${JSON.stringify(response, null, 4).replace(/\n/g, '\n    ')}, { status: ${statusCode} })
  })`
  }

  /**
   * 生成 MSW 浏览器配置
   */
  generateBrowserSetup(): string {
    return `import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
`
  }

  /**
   * 生成 MSW Node 配置
   */
  generateNodeSetup(): string {
    return `import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
`
  }

  /**
   * 生成测试配置
   */
  generateTestSetup(): string {
    return `import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
`
  }
}

export function createMSWIntegration(): MSWIntegration {
  return new MSWIntegration()
}



