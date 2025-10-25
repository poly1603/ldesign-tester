/**
 * 测试脚手架生成器 - 创建标准测试目录结构
 */
import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import type { ScaffoldOptions } from '../types/index.js'
import { ScaffoldError } from '../errors/index.js'

/**
 * 测试脚手架生成器类
 */
export class ScaffoldGenerator {
  /**
   * 生成测试脚手架
   * @param options 脚手架选项
   */
  async scaffold(options: ScaffoldOptions): Promise<void> {
    const {
      projectRoot,
      testDir = 'tests',
      e2eDir = 'e2e',
      createHelpers = true,
      createFixtures = true,
      createMocks = true,
    } = options

    // 创建目录结构
    await this.createDirectoryStructure(projectRoot, testDir, e2eDir)

    // 创建辅助函数
    if (createHelpers) {
      await this.createHelpers(projectRoot, testDir)
    }

    // 创建 fixtures
    if (createFixtures) {
      await this.createFixtures(projectRoot, testDir)
    }

    // 创建 Mock 文件
    if (createMocks) {
      await this.createMocks(projectRoot, testDir)
    }

    // 创建示例测试
    await this.createExampleTests(projectRoot, testDir)

    console.log('✅ 测试脚手架创建完成')
    console.log(`📁 测试目录: ${testDir}/`)
    console.log(`📁 E2E 目录: ${e2eDir}/`)
  }

  /**
   * 创建目录结构
   */
  private async createDirectoryStructure(
    projectRoot: string,
    testDir: string,
    e2eDir: string,
  ): Promise<void> {
    const directories = [
      // 单元测试
      path.join(projectRoot, testDir),
      path.join(projectRoot, testDir, 'unit'),
      path.join(projectRoot, testDir, 'integration'),
      path.join(projectRoot, testDir, 'helpers'),
      path.join(projectRoot, testDir, 'fixtures'),
      path.join(projectRoot, testDir, 'mocks'),

      // E2E 测试
      path.join(projectRoot, e2eDir),
      path.join(projectRoot, e2eDir, 'fixtures'),
    ]

    try {
      // 并行创建所有目录
      await Promise.all(
        directories.map(async (dir) => {
          try {
            await fs.mkdir(dir, { recursive: true })
            console.log(`📁 创建目录: ${dir}`)
          }
          catch (err) {
            // 目录已存在，忽略错误
            if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
              throw err
            }
          }
        }),
      )
    }
    catch (err) {
      throw new ScaffoldError('目录创建失败', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 创建辅助函数
   */
  private async createHelpers(projectRoot: string, testDir: string): Promise<void> {
    const helpersDir = path.join(projectRoot, testDir, 'helpers')

    // 测试工具函数
    const testUtilsContent = `/**
 * 测试工具函数
 */

/**
 * 延迟函数
 * @param ms 毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 等待条件满足
 * @param condition 条件函数
 * @param timeout 超时时间（毫秒）
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await delay(50)
  }

  throw new Error(\`等待超时: \${timeout}ms\`)
}

/**
 * 创建 Mock 函数
 * @param returnValue 返回值
 */
export function createMockFn<T>(returnValue?: T): (...args: any[]) => T {
  const fn = (..._args: any[]): T => returnValue as T
  return fn
}

/**
 * 生成随机字符串
 * @param length 长度
 */
export function randomString(length = 10): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * 生成随机数字
 * @param min 最小值
 * @param max 最大值
 */
export function randomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
`

    await fs.writeFile(path.join(helpersDir, 'test-utils.ts'), testUtilsContent, 'utf-8')
    console.log('📄 创建文件: helpers/test-utils.ts')

    // DOM 测试辅助函数
    const domHelpersContent = `/**
 * DOM 测试辅助函数
 */

/**
 * 查询元素
 * @param selector 选择器
 * @param container 容器元素
 */
export function query<T extends Element = Element>(
  selector: string,
  container: Element | Document = document,
): T | null {
  return container.querySelector<T>(selector)
}

/**
 * 查询所有元素
 * @param selector 选择器
 * @param container 容器元素
 */
export function queryAll<T extends Element = Element>(
  selector: string,
  container: Element | Document = document,
): T[] {
  return Array.from(container.querySelectorAll<T>(selector))
}

/**
 * 触发事件
 * @param element 元素
 * @param eventType 事件类型
 * @param eventInit 事件初始化选项
 */
export function fireEvent(
  element: Element,
  eventType: string,
  eventInit?: EventInit,
): void {
  const event = new Event(eventType, eventInit)
  element.dispatchEvent(event)
}

/**
 * 等待元素出现
 * @param selector 选择器
 * @param timeout 超时时间
 */
export async function waitForElement(
  selector: string,
  timeout = 5000,
): Promise<Element> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const element = query(selector)
    if (element) {
      return element
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  throw new Error(\`元素未找到: \${selector}\`)
}
`

    await fs.writeFile(path.join(helpersDir, 'dom-helpers.ts'), domHelpersContent, 'utf-8')
    console.log('📄 创建文件: helpers/dom-helpers.ts')

    // 导出文件
    const indexContent = `/**
 * 测试辅助函数导出
 */

export * from './test-utils.js'
export * from './dom-helpers.js'
`

    await fs.writeFile(path.join(helpersDir, 'index.ts'), indexContent, 'utf-8')
    console.log('📄 创建文件: helpers/index.ts')
  }

  /**
   * 创建 Fixtures
   */
  private async createFixtures(projectRoot: string, testDir: string): Promise<void> {
    const fixturesDir = path.join(projectRoot, testDir, 'fixtures')

    // 用户数据 fixture
    const userFixture = `/**
 * 用户数据 Fixture
 */
export const userFixture = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date('2024-01-01'),
}

export const usersFixture = [
  userFixture,
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: new Date('2024-01-02'),
  },
]
`

    await fs.writeFile(path.join(fixturesDir, 'users.ts'), userFixture, 'utf-8')
    console.log('📄 创建文件: fixtures/users.ts')

    // 导出文件
    const indexContent = `/**
 * Fixtures 导出
 */

export * from './users.js'
`

    await fs.writeFile(path.join(fixturesDir, 'index.ts'), indexContent, 'utf-8')
    console.log('📄 创建文件: fixtures/index.ts')
  }

  /**
   * 创建 Mock 文件
   */
  private async createMocks(projectRoot: string, testDir: string): Promise<void> {
    const mocksDir = path.join(projectRoot, testDir, 'mocks')

    // API Mock
    const apiMockContent = `/**
 * API Mock
 */
import { vi } from 'vitest'

export const apiMock = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

/**
 * 重置所有 Mock
 */
export function resetApiMocks(): void {
  apiMock.get.mockReset()
  apiMock.post.mockReset()
  apiMock.put.mockReset()
  apiMock.delete.mockReset()
}
`

    await fs.writeFile(path.join(mocksDir, 'api.ts'), apiMockContent, 'utf-8')
    console.log('📄 创建文件: mocks/api.ts')

    // 导出文件
    const indexContent = `/**
 * Mocks 导出
 */

export * from './api.js'
`

    await fs.writeFile(path.join(mocksDir, 'index.ts'), indexContent, 'utf-8')
    console.log('📄 创建文件: mocks/index.ts')
  }

  /**
   * 创建示例测试
   */
  private async createExampleTests(projectRoot: string, testDir: string): Promise<void> {
    const unitDir = path.join(projectRoot, testDir, 'unit')

    // 示例单元测试
    const exampleTestContent = `/**
 * 示例单元测试
 */
import { describe, it, expect } from 'vitest'

describe('示例测试套件', () => {
  it('应该通过基本断言', () => {
    expect(1 + 1).toBe(2)
  })

  it('应该处理异步操作', async () => {
    const result = await Promise.resolve('success')
    expect(result).toBe('success')
  })

  it('应该测试对象', () => {
    const obj = { name: 'test', value: 123 }
    expect(obj).toEqual({ name: 'test', value: 123 })
  })
})
`

    await fs.writeFile(path.join(unitDir, 'example.test.ts'), exampleTestContent, 'utf-8')
    console.log('📄 创建文件: unit/example.test.ts')
  }
}

/**
 * 创建脚手架生成器实例
 */
export function createScaffoldGenerator(): ScaffoldGenerator {
  return new ScaffoldGenerator()
}



