/**
 * @ldesign/tester - 统一错误处理
 * 
 * 提供统一的错误类型系统，便于错误识别和处理
 */

/**
 * 基础测试错误类
 * 
 * @example
 * ```typescript
 * throw new TesterError('操作失败', 'OPERATION_FAILED', { detail: 'xxx' })
 * ```
 */
export class TesterError extends Error {
  /**
   * 创建测试错误
   * @param message - 错误消息
   * @param code - 错误代码
   * @param details - 错误详情（可选）
   */
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'TesterError'
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 参数验证错误
 * 
 * 用于参数验证失败的场景
 * 
 * @example
 * ```typescript
 * throw new ValidationError('名称不能为空')
 * ```
 */
export class ValidationError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

/**
 * 生成器错误
 * 
 * 用于测试生成器相关错误
 * 
 * @example
 * ```typescript
 * throw new GeneratorError('生成测试失败', { component: 'Button' })
 * ```
 */
export class GeneratorError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'GENERATOR_ERROR', details)
    this.name = 'GeneratorError'
  }
}

/**
 * 配置错误
 * 
 * 用于配置相关错误
 * 
 * @example
 * ```typescript
 * throw new ConfigError('配置文件无效')
 * ```
 */
export class ConfigError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIG_ERROR', details)
    this.name = 'ConfigError'
  }
}

/**
 * Mock 错误
 * 
 * 用于 Mock 系统相关错误
 * 
 * @example
 * ```typescript
 * throw new MockError('Mock 数据生成失败')
 * ```
 */
export class MockError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'MOCK_ERROR', details)
    this.name = 'MockError'
  }
}

/**
 * 脚手架错误
 * 
 * 用于脚手架生成相关错误
 * 
 * @example
 * ```typescript
 * throw new ScaffoldError('目录创建失败', { path: '/xxx' })
 * ```
 */
export class ScaffoldError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'SCAFFOLD_ERROR', details)
    this.name = 'ScaffoldError'
  }
}

/**
 * 文件操作错误
 * 
 * 用于文件操作相关错误
 * 
 * @example
 * ```typescript
 * throw new FileError('文件写入失败', { path: '/xxx' })
 * ```
 */
export class FileError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'FILE_ERROR', details)
    this.name = 'FileError'
  }
}

/**
 * 性能测试错误
 * 
 * 用于性能测试相关错误
 * 
 * @example
 * ```typescript
 * throw new PerformanceError('基准测试失败')
 * ```
 */
export class PerformanceError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'PERFORMANCE_ERROR', details)
    this.name = 'PerformanceError'
  }
}

/**
 * Dashboard 错误
 * 
 * 用于 Dashboard 相关错误
 * 
 * @example
 * ```typescript
 * throw new DashboardError('服务器启动失败', { port: 3000 })
 * ```
 */
export class DashboardError extends TesterError {
  constructor(message: string, details?: unknown) {
    super(message, 'DASHBOARD_ERROR', details)
    this.name = 'DashboardError'
  }
}

