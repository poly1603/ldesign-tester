/**
 * API 测试生成器
 */
import type { APISpec, GenerateOptions } from '../../types/index.js'
import { createTemplateEngine } from '../../core/template-engine.js'

export class APITestGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成 REST API 测试
   */
  generateRESTTest(apiName: string, endpoints: APISpec[] = [], options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const endpointTests = endpoints.map(endpoint => `
  it('${endpoint.method} ${endpoint.path} should work', async () => {
    const response = await request(app)
      .${endpoint.method.toLowerCase()}('${endpoint.path}')
      ${endpoint.method === 'POST' || endpoint.method === 'PUT' ? `.send({ data: 'test' })` : ''}
      .expect(${endpoint.statusCode || 200})
    
    expect(response.body).toBeDefined()
  })
`).join('\n')

    const template = `${includeComments ? `/**
 * ${apiName} REST API 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('${apiName} API', () => {
  ${endpointTests || `it('should respond successfully', async () => {
    const response = await request(app).get('/api/${apiName.toLowerCase()}').expect(200)
    expect(response.body).toBeDefined()
  })`}
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 GraphQL 测试
   */
  generateGraphQLTest(apiName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${apiName} GraphQL 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('${apiName} GraphQL', () => {
  it('should execute query', async () => {
    const query = \`
      query {
        ${apiName.toLowerCase()} {
          id
          name
        }
      }
    \`
    
    const response = await request(app)
      .post('/graphql')
      .send({ query })
      .expect(200)
    
    expect(response.body.data).toBeDefined()
  })

  it('should execute mutation', async () => {
    const mutation = \`
      mutation {
        create${apiName}(input: { name: "test" }) {
          id
          name
        }
      }
    \`
    
    const response = await request(app)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
    
    expect(response.body.data.create${apiName}).toBeDefined()
  })
})
`

    return this.templateEngine.formatCode(template)
  }
}

export function createAPITestGenerator(): APITestGenerator {
  return new APITestGenerator()
}



