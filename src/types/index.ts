/**
 * @ldesign/tester - 类型定义
 */

/** 测试类型 */
export type TestType = 'unit' | 'e2e' | 'component' | 'api' | 'integration'

/** 测试框架 */
export type TestFramework = 'vitest' | 'jest' | 'playwright' | 'cypress'

/** 组件框架 */
export type ComponentFramework = 'vue' | 'react' | 'angular' | 'svelte'

/** 测试环境 */
export type TestEnvironment = 'node' | 'jsdom' | 'happy-dom'

/** 覆盖率提供商 */
export type CoverageProvider = 'v8' | 'istanbul' | 'c8'

/** 覆盖率报告格式 */
export type CoverageReporter = 'text' | 'json' | 'html' | 'lcov' | 'json-summary'

/** CI/CD 平台 */
export type CIPlatform = 'github' | 'gitlab' | 'jenkins' | 'circleci' | 'travis'

/** 生成选项 */
export interface GenerateOptions {
  /** 输出文件路径 */
  outputPath?: string
  /** 组件框架 */
  framework?: ComponentFramework
  /** 是否覆盖已存在的文件 */
  overwrite?: boolean
  /** 是否包含示例测试 */
  includeExamples?: boolean
  /** 是否包含注释 */
  includeComments?: boolean
  /** 自定义变量 */
  variables?: Record<string, any>
}

/** Vitest 配置选项 */
export interface VitestOptions {
  /** 测试环境 */
  environment?: TestEnvironment
  /** 全局变量 */
  globals?: boolean
  /** 覆盖率配置 */
  coverage?: {
    provider?: CoverageProvider
    reporter?: CoverageReporter[]
    reportsDirectory?: string
    exclude?: string[]
    thresholds?: CoverageThresholds
  }
  /** 包含的测试文件 */
  include?: string[]
  /** 排除的文件 */
  exclude?: string[]
  /** 插件 */
  plugins?: string[]
}

/** Playwright 配置选项 */
export interface PlaywrightOptions {
  /** 测试目录 */
  testDir?: string
  /** 基础URL */
  baseURL?: string
  /** 是否并行执行 */
  fullyParallel?: boolean
  /** 重试次数 */
  retries?: number
  /** 浏览器项目 */
  projects?: Array<{
    name: string
    use?: Record<string, any>
  }>
  /** 是否启用trace */
  trace?: boolean
  /** 是否启用screenshot */
  screenshot?: boolean
  /** 是否启用video */
  video?: boolean
}

/** 覆盖率阈值 */
export interface CoverageThresholds {
  global?: {
    branches?: number
    functions?: number
    lines?: number
    statements?: number
  }
  [filePath: string]: {
    branches?: number
    functions?: number
    lines?: number
    statements?: number
  } | undefined
}

/** Mock 类型 */
export type MockType = 'faker' | 'msw' | 'component' | 'function' | 'module'

/** Mock 选项 */
export interface MockOptions {
  /** Mock 类型 */
  type: MockType
  /** 数据模式 (for faker) */
  schema?: Record<string, any>
  /** API 规范 (for MSW) */
  apiSpec?: APISpec
  /** 生成数量 */
  count?: number
  /** Locale */
  locale?: 'zh_CN' | 'en_US'
}

/** API 规范 */
export interface APISpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  response?: any
  statusCode?: number
}

/** 测试结果 */
export interface TestResult {
  /** 测试名称 */
  name: string
  /** 是否通过 */
  passed: boolean
  /** 失败原因 */
  error?: string
  /** 执行时间(ms) */
  duration: number
  /** 时间戳 */
  timestamp: number
}

/** 覆盖率数据 */
export interface CoverageData {
  /** 总行数 */
  totalLines: number
  /** 已覆盖行数 */
  coveredLines: number
  /** 总分支数 */
  totalBranches: number
  /** 已覆盖分支数 */
  coveredBranches: number
  /** 总函数数 */
  totalFunctions: number
  /** 已覆盖函数数 */
  coveredFunctions: number
  /** 总语句数 */
  totalStatements: number
  /** 已覆盖语句数 */
  coveredStatements: number
  /** 文件级覆盖率 */
  files?: Record<string, FileCoverage>
}

/** 文件覆盖率 */
export interface FileCoverage {
  path: string
  lines: { total: number; covered: number; percentage: number }
  branches: { total: number; covered: number; percentage: number }
  functions: { total: number; covered: number; percentage: number }
  statements: { total: number; covered: number; percentage: number }
  uncoveredLines?: number[]
}

/** 模板变量 */
export interface TemplateVariables {
  /** 组件/文件名 */
  name: string
  /** 组件框架 */
  framework?: ComponentFramework
  /** 导入路径 */
  importPath?: string
  /** Props 定义 */
  props?: Array<{ name: string; type: string; required?: boolean }>
  /** Events */
  events?: Array<{ name: string; payload?: string }>
  /** 函数签名 */
  functions?: Array<{ name: string; params: string; returnType: string }>
  /** 其他自定义变量 */
  [key: string]: any
}

/** 脚手架选项 */
export interface ScaffoldOptions {
  /** 项目根目录 */
  projectRoot: string
  /** 测试目录 */
  testDir?: string
  /** E2E测试目录 */
  e2eDir?: string
  /** 是否创建示例 */
  createExamples?: boolean
  /** 是否创建helpers */
  createHelpers?: boolean
}

/** 性能测试结果 */
export interface PerformanceResult {
  /** 测试名称 */
  name: string
  /** 操作/秒 */
  opsPerSecond: number
  /** 平均时间(ms) */
  averageTime: number
  /** 最小时间(ms) */
  minTime: number
  /** 最大时间(ms) */
  maxTime: number
}

/** 视觉回归结果 */
export interface VisualRegressionResult {
  /** 截图名称 */
  name: string
  /** 是否有差异 */
  hasDiff: boolean
  /** 差异百分比 */
  diffPercentage?: number
  /** 基准图路径 */
  baselinePath: string
  /** 当前图路径 */
  currentPath: string
  /** 差异图路径 */
  diffPath?: string
}

/** Dashboard 配置 */
export interface DashboardConfig {
  /** 端口 */
  port?: number
  /** 数据库路径 */
  dbPath?: string
  /** 是否自动打开浏览器 */
  open?: boolean
}

/** CI 配置选项 */
export interface CIOptions {
  /** CI 平台 */
  platform: CIPlatform
  /** Node.js 版本矩阵 */
  nodeVersions?: string[]
  /** 是否启用覆盖率上传 */
  uploadCoverage?: boolean
  /** 覆盖率服务 (codecov, coveralls) */
  coverageService?: 'codecov' | 'coveralls'
  /** 是否缓存依赖 */
  cache?: boolean
}




