/**
 * 测试脚手架 - 创建测试文件结构
 */
import type { ScaffoldOptions } from '../types/index.js'

export class TestScaffold {
  /**
   * 创建测试目录结构
   */
  async createStructure(options: ScaffoldOptions): Promise<string[]> {
    const { testDir = '__tests__', e2eDir = 'e2e', createHelpers = true, createExamples = true } = options

    const directories = [
      testDir,
      `${testDir}/unit`,
      `${testDir}/integration`,
      e2eDir,
      `${e2eDir}/pages`,
      `${testDir}/fixtures`,
      `${testDir}/__mocks__`,
    ]

    if (createHelpers) {
      directories.push(`${testDir}/helpers`)
    }

    return directories
  }

  /**
   * 生成测试辅助函数文件
   */
  generateHelpers(): string {
    return `/**
 * 测试辅助函数
 */
import { vi } from 'vitest'

export function createMockFn<T = any>(): jest.Mock<T> {
  return vi.fn()
}

export function waitForAsync(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve))
}

export const testHelpers = {
  createMockFn,
  waitForAsync,
  flushPromises,
}
`
  }

  /**
   * 生成 fixtures 文件
   */
  generateFixtures(): string {
    return `/**
 * 测试 Fixtures
 */

export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
}

export const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
}

export const fixtures = {
  user: mockUser,
  product: mockProduct,
}
`
  }
}

export function createTestScaffold(): TestScaffold {
  return new TestScaffold()
}



