/**
 * @ldesign/tester - 参数验证工具
 * 
 * 提供统一的参数验证函数
 */

import { ValidationError } from '../errors/index.js'

/**
 * 验证必需参数
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值为 undefined、null 或空字符串时
 * 
 * @example
 * ```typescript
 * validateRequired(componentName, '组件名称')
 * ```
 */
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} 是必需的`)
  }
}

/**
 * 验证字符串类型
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是字符串时
 * 
 * @example
 * ```typescript
 * validateString(name, '名称')
 * ```
 */
export function validateString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} 必须是字符串`)
  }
}

/**
 * 验证非空字符串
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是字符串或为空字符串时
 * 
 * @example
 * ```typescript
 * validateNonEmptyString(componentName, '组件名称')
 * ```
 */
export function validateNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  validateString(value, fieldName)
  if (value.trim() === '') {
    throw new ValidationError(`${fieldName} 不能为空`)
  }
}

/**
 * 验证数字类型
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是数字时
 * 
 * @example
 * ```typescript
 * validateNumber(count, '数量')
 * ```
 */
export function validateNumber(value: unknown, fieldName: string): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new ValidationError(`${fieldName} 必须是有效数字`)
  }
}

/**
 * 验证正数
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是正数时
 * 
 * @example
 * ```typescript
 * validatePositiveNumber(count, '数量')
 * ```
 */
export function validatePositiveNumber(value: unknown, fieldName: string): asserts value is number {
  validateNumber(value, fieldName)
  if (value <= 0) {
    throw new ValidationError(`${fieldName} 必须是正数`)
  }
}

/**
 * 验证非负数
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值是负数时
 * 
 * @example
 * ```typescript
 * validateNonNegativeNumber(index, '索引')
 * ```
 */
export function validateNonNegativeNumber(value: unknown, fieldName: string): asserts value is number {
  validateNumber(value, fieldName)
  if (value < 0) {
    throw new ValidationError(`${fieldName} 不能是负数`)
  }
}

/**
 * 验证数字范围
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @throws {ValidationError} 当值不在指定范围内时
 * 
 * @example
 * ```typescript
 * validateNumberRange(port, '端口号', 1, 65535)
 * ```
 */
export function validateNumberRange(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
): asserts value is number {
  validateNumber(value, fieldName)
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} 必须在 ${min} 和 ${max} 之间`)
  }
}

/**
 * 验证布尔类型
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是布尔类型时
 * 
 * @example
 * ```typescript
 * validateBoolean(enabled, '启用状态')
 * ```
 */
export function validateBoolean(value: unknown, fieldName: string): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new ValidationError(`${fieldName} 必须是布尔值`)
  }
}

/**
 * 验证数组类型
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是数组时
 * 
 * @example
 * ```typescript
 * validateArray(items, '选项列表')
 * ```
 */
export function validateArray(value: unknown, fieldName: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} 必须是数组`)
  }
}

/**
 * 验证非空数组
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是数组或为空数组时
 * 
 * @example
 * ```typescript
 * validateNonEmptyArray(handlers, 'Handlers')
 * ```
 */
export function validateNonEmptyArray(value: unknown, fieldName: string): asserts value is unknown[] {
  validateArray(value, fieldName)
  if (value.length === 0) {
    throw new ValidationError(`${fieldName} 不能为空数组`)
  }
}

/**
 * 验证对象类型
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是对象时
 * 
 * @example
 * ```typescript
 * validateObject(config, '配置对象')
 * ```
 */
export function validateObject(value: unknown, fieldName: string): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ValidationError(`${fieldName} 必须是对象`)
  }
}

/**
 * 验证函数类型
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是函数时
 * 
 * @example
 * ```typescript
 * validateFunction(callback, '回调函数')
 * ```
 */
export function validateFunction(value: unknown, fieldName: string): asserts value is Function {
  if (typeof value !== 'function') {
    throw new ValidationError(`${fieldName} 必须是函数`)
  }
}

/**
 * 验证枚举值
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @param allowedValues - 允许的值列表
 * @throws {ValidationError} 当值不在允许的值列表中时
 * 
 * @example
 * ```typescript
 * validateEnum(framework, '框架', ['vue', 'react', 'angular'])
 * ```
 */
export function validateEnum<T>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[],
): asserts value is T {
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(
      `${fieldName} 必须是以下值之一: ${allowedValues.join(', ')}`,
    )
  }
}

/**
 * 验证文件路径
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是有效路径时
 * 
 * @example
 * ```typescript
 * validatePath(filePath, '文件路径')
 * ```
 */
export function validatePath(value: unknown, fieldName: string): asserts value is string {
  validateNonEmptyString(value, fieldName)

  // 检查是否包含非法字符（Windows和Unix共同的非法字符）
  const illegalChars = /[<>"|?*\0]/
  if (illegalChars.test(value)) {
    throw new ValidationError(`${fieldName} 包含非法字符`)
  }
}

/**
 * 验证 URL
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是有效 URL 时
 * 
 * @example
 * ```typescript
 * validateURL(url, 'API 地址')
 * ```
 */
export function validateURL(value: unknown, fieldName: string): asserts value is string {
  validateNonEmptyString(value, fieldName)

  try {
    new URL(value)
  }
  catch {
    throw new ValidationError(`${fieldName} 必须是有效的 URL`)
  }
}

/**
 * 验证正则表达式
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @param pattern - 正则表达式模式
 * @throws {ValidationError} 当值不匹配正则表达式时
 * 
 * @example
 * ```typescript
 * validatePattern(email, '邮箱', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
 * ```
 */
export function validatePattern(
  value: unknown,
  fieldName: string,
  pattern: RegExp,
): asserts value is string {
  validateString(value, fieldName)
  if (!pattern.test(value)) {
    throw new ValidationError(`${fieldName} 格式不正确`)
  }
}

/**
 * 验证端口号
 * 
 * @param value - 待验证的值
 * @param fieldName - 字段名称
 * @throws {ValidationError} 当值不是有效端口号时
 * 
 * @example
 * ```typescript
 * validatePort(port, '端口号')
 * ```
 */
export function validatePort(value: unknown, fieldName: string): asserts value is number {
  validateNumberRange(value, fieldName, 1, 65535)
}

