/**
 * @ldesign/tester - 测试工具集主入口
 * 
 * 提供完整的测试解决方案：
 * - 测试生成（单元/E2E/组件/API/集成）
 * - Mock 系统（Faker + MSW）
 * - 配置生成（Vitest + Playwright）
 * - CI/CD 集成（GitHub Actions/GitLab CI/Jenkins/CircleCI）
 * - 性能测试（Benchmark + Load Test + Lighthouse）
 * - 视觉回归（Screenshot 对比 + Percy）
 * - Dashboard（测试历史和趋势）
 */

// 核心模块
export * from './core/index.js'

// 类型定义
export * from './types/index.js'

// Mock 系统
export * from './mock/index.js'

// CLI 工具（仅导出类型和工具函数，命令由 bin/cli.js 执行）
export * from './cli/utils.js'

// 测试脚手架
export * from './scaffold/index.js'

// CI/CD
export * from './ci/index.js'

// 性能测试
export * from './performance/index.js'

// 视觉回归
export * from './visual/index.js'

// Dashboard
export * from './dashboard/index.js'

// 版本信息
export const version = '1.0.0'
