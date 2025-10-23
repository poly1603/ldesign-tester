/**
 * CLI 工具函数
 */

/**
 * 格式化输出成功消息
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`)
}

/**
 * 格式化输出错误消息
 */
export function logError(message: string): void {
  console.error(`❌ ${message}`)
}

/**
 * 格式化输出警告消息
 */
export function logWarning(message: string): void {
  console.warn(`⚠️  ${message}`)
}

/**
 * 格式化输出信息消息
 */
export function logInfo(message: string): void {
  console.log(`ℹ️  ${message}`)
}


