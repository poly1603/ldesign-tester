/**
 * CLI 工具函数
 */

import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import type { ComponentFramework } from '../types/index.js'
import { FileError, ValidationError } from '../errors/index.js'

/**
 * 格式化输出成功消息
 * 
 * @param message - 消息内容
 * @returns 格式化后的成功消息
 */
export function success(message: string): string {
  return `✅ ${message}`
}

/**
 * 格式化输出错误消息
 * 
 * @param message - 消息内容
 * @returns 格式化后的错误消息
 */
export function error(message: string): string {
  return `❌ ${message}`
}

/**
 * 格式化输出警告消息
 * 
 * @param message - 消息内容
 * @returns 格式化后的警告消息
 */
export function warning(message: string): string {
  return `⚠️  ${message}`
}

/**
 * 格式化输出信息消息
 * 
 * @param message - 消息内容
 * @returns 格式化后的信息消息
 */
export function info(message: string): string {
  return `ℹ️  ${message}`
}

// 保留旧的日志函数以保持向后兼容
/**
 * @deprecated 请使用 success() 函数
 */
export function logSuccess(message: string): void {
  console.log(success(message))
}

/**
 * @deprecated 请使用 error() 函数
 */
export function logError(message: string): void {
  console.error(error(message))
}

/**
 * @deprecated 请使用 warning() 函数
 */
export function logWarning(message: string): void {
  console.warn(warning(message))
}

/**
 * @deprecated 请使用 info() 函数
 */
export function logInfo(message: string): void {
  console.log(info(message))
}

/**
 * 写入文件（自动创建目录）
 * 
 * @param filePath - 文件路径
 * @param content - 文件内容
 * @throws {FileError} 文件写入失败时
 * 
 * @example
 * ```typescript
 * await writeFile('./src/test.ts', 'export const test = true')
 * ```
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, content, 'utf-8')
  }
  catch (err) {
    throw new FileError(`文件写入失败: ${filePath}`, {
      path: filePath,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

/**
 * 检查文件是否存在
 * 
 * @param filePath - 文件路径
 * @returns 文件是否存在
 * 
 * @example
 * ```typescript
 * if (await fileExists('./package.json')) {
 *   console.log('package.json exists')
 * }
 * ```
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  }
  catch {
    return false
  }
}

/**
 * 解析路径（相对于当前工作目录）
 * 
 * @param paths - 路径片段
 * @returns 解析后的绝对路径
 * 
 * @example
 * ```typescript
 * const configPath = resolvePath('config', 'vitest.config.ts')
 * ```
 */
export function resolvePath(...paths: string[]): string {
  return path.resolve(process.cwd(), ...paths)
}

/**
 * 检测项目使用的框架
 * 
 * @returns 检测到的框架名称
 * 
 * @example
 * ```typescript
 * const framework = await detectFramework()
 * console.log(`Detected framework: ${framework}`)
 * ```
 */
export async function detectFramework(): Promise<ComponentFramework> {
  const cwd = process.cwd()
  const packageJsonPath = path.join(cwd, 'package.json')

  try {
    // 检查 package.json 是否存在
    const exists = await fileExists(packageJsonPath)
    if (!exists) {
      return 'vue' // 默认值
    }

    // 读取并解析 package.json
    const content = await fs.readFile(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(content)
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }

    // 按优先级检测框架
    if (deps.vue) return 'vue'
    if (deps.react) return 'react'
    if (deps['@angular/core']) return 'angular'
    if (deps.svelte) return 'svelte'

    return 'vue' // 默认值
  }
  catch (err) {
    // 读取或解析失败，返回默认值
    return 'vue'
  }
}

/**
 * 读取文件内容
 * 
 * @param filePath - 文件路径
 * @returns 文件内容
 * @throws {FileError} 文件读取失败时
 * 
 * @example
 * ```typescript
 * const content = await readFile('./package.json')
 * ```
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8')
  }
  catch (err) {
    throw new FileError(`文件读取失败: ${filePath}`, {
      path: filePath,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

/**
 * 删除文件
 * 
 * @param filePath - 文件路径
 * @throws {FileError} 文件删除失败时
 * 
 * @example
 * ```typescript
 * await deleteFile('./temp.txt')
 * ```
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  }
  catch (err) {
    throw new FileError(`文件删除失败: ${filePath}`, {
      path: filePath,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

/**
 * 创建目录
 * 
 * @param dirPath - 目录路径
 * @throws {FileError} 目录创建失败时
 * 
 * @example
 * ```typescript
 * await createDirectory('./tests/unit')
 * ```
 */
export async function createDirectory(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  }
  catch (err) {
    throw new FileError(`目录创建失败: ${dirPath}`, {
      path: dirPath,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}


