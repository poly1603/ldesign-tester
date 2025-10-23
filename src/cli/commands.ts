/**
 * CLI 命令实现
 */
import type { ComponentFramework, TestType } from '../types/index.js'
import { createTestGenerator } from '../core/test-generator.js'
import { createConfigGenerator } from '../core/config-generator.js'
import { createMockGenerator } from '../mock/mock-generator.js'
import { createScaffoldGenerator } from '../scaffold/scaffold-generator.js'
import { createCIGenerator } from '../ci/ci-generator.js'
import { error, info, success, warning, writeFile, fileExists, resolvePath, detectFramework } from './utils.js'

/**
 * 初始化测试环境
 */
export async function initCommand(options: {
  framework?: ComponentFramework
  coverage?: boolean
  e2e?: boolean
}): Promise<void> {
  console.log(info('初始化测试环境...'))

  const framework = options.framework || detectFramework()
  const configGenerator = createConfigGenerator()

  try {
    // 1. 生成 Vitest 配置
    console.log(info('生成 Vitest 配置...'))
    const vitestConfig = configGenerator.generateVitestConfig({
      environment: framework === 'vue' || framework === 'react' ? 'jsdom' : 'node',
      globals: true,
      coverage: options.coverage
        ? {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          thresholds: {
            global: {
              branches: 80,
              functions: 80,
              lines: 80,
              statements: 80,
            },
          },
        }
        : undefined,
      plugins: framework !== 'none' ? [framework] : [],
    })

    const vitestConfigPath = resolvePath('vitest.config.ts')
    writeFile(vitestConfigPath, vitestConfig)
    console.log(success(`已创建 ${vitestConfigPath}`))

    // 2. 生成测试 setup 文件
    if (framework !== 'none') {
      console.log(info('生成测试 setup 文件...'))
      const setupFile = configGenerator.generateSetupFile(framework)
      const setupPath = resolvePath('tests/setup.ts')
      writeFile(setupPath, setupFile)
      console.log(success(`已创建 ${setupPath}`))
    }

    // 3. 生成 tsconfig.test.json
    if (fileExists(resolvePath('tsconfig.json'))) {
      console.log(info('生成测试 TypeScript 配置...'))
      const tsConfig = configGenerator.generateTsConfig()
      const tsConfigPath = resolvePath('tsconfig.test.json')
      writeFile(tsConfigPath, tsConfig)
      console.log(success(`已创建 ${tsConfigPath}`))
    }

    // 4. 生成 Playwright 配置（如果需要）
    if (options.e2e) {
      console.log(info('生成 Playwright 配置...'))
      const playwrightConfig = configGenerator.generatePlaywrightConfig({
        testDir: './e2e',
        baseURL: 'http://localhost:5173',
      })
      const playwrightConfigPath = resolvePath('playwright.config.ts')
      writeFile(playwrightConfigPath, playwrightConfig)
      console.log(success(`已创建 ${playwrightConfigPath}`))
    }

    console.log(success('✨ 测试环境初始化完成！'))
    console.log(info('下一步：运行 ldesign-test scaffold 创建测试目录结构'))
  }
  catch (err) {
    console.error(error(`初始化失败: ${err instanceof Error ? err.message : String(err)}`))
    process.exit(1)
  }
}

/**
 * 生成测试文件
 */
export async function generateCommand(
  type: TestType,
  name: string,
  options: {
    framework?: ComponentFramework
    output?: string
    comments?: boolean
    examples?: boolean
  },
): Promise<void> {
  console.log(info(`生成 ${type} 测试: ${name}`))

  const generator = createTestGenerator()

  try {
    // 检测框架
    const framework = options.framework || detectFramework()

    // 生成测试代码
    const testCode = generator.generate(type, name, {
      framework: framework !== 'none' ? framework : undefined,
      includeComments: options.comments ?? true,
      includeExamples: options.examples ?? true,
    })

    // 确定输出路径
    let outputPath: string
    if (options.output) {
      outputPath = resolvePath(options.output)
    }
    else {
      // 默认路径
      const ext = framework === 'none' ? 'ts' : 'ts'
      if (type === 'e2e') {
        outputPath = resolvePath(`e2e/${name}.spec.${ext}`)
      }
      else {
        outputPath = resolvePath(`tests/${type}/${name}.test.${ext}`)
      }
    }

    // 检查文件是否已存在
    if (fileExists(outputPath)) {
      console.log(warning(`文件已存在: ${outputPath}`))
      console.log(info('使用 --force 选项覆盖现有文件'))
      return
    }

    // 写入文件
    writeFile(outputPath, testCode)
    console.log(success(`已创建测试文件: ${outputPath}`))
  }
  catch (err) {
    console.error(error(`生成测试失败: ${err instanceof Error ? err.message : String(err)}`))
    process.exit(1)
  }
}

/**
 * 生成测试脚手架
 */
export async function scaffoldCommand(options: {
  dir?: string
  helpers?: boolean
  fixtures?: boolean
  mocks?: boolean
}): Promise<void> {
  console.log(info('生成测试脚手架...'))

  const scaffoldGenerator = createScaffoldGenerator()

  try {
    await scaffoldGenerator.scaffold({
      projectRoot: resolvePath(options.dir || '.'),
      createHelpers: options.helpers ?? true,
      createFixtures: options.fixtures ?? true,
      createMocks: options.mocks ?? true,
    })

    console.log(success('✨ 测试脚手架创建完成！'))
  }
  catch (err) {
    console.error(error(`脚手架生成失败: ${err instanceof Error ? err.message : String(err)}`))
    process.exit(1)
  }
}

/**
 * 生成 Mock 数据或代码
 */
export async function mockCommand(
  mockType: 'faker' | 'msw' | 'function' | 'component',
  options: {
    type?: string
    count?: number
    output?: string
    resource?: string
  },
): Promise<void> {
  console.log(info(`生成 ${mockType} Mock...`))

  const mockGenerator = createMockGenerator()

  try {
    let result: unknown

    if (mockType === 'faker') {
      // 生成 Faker 数据
      const dataType = (options.type as 'user' | 'product' | 'order') || 'user'
      result = mockGenerator.generateCommonData(dataType, options.count || 10)

      const outputPath = options.output || resolvePath(`mocks/${dataType}-data.json`)
      writeFile(outputPath, JSON.stringify(result, null, 2))
      console.log(success(`已生成 ${dataType} 数据: ${outputPath}`))
    }
    else if (mockType === 'msw') {
      // 生成 MSW Handlers
      if (!options.resource) {
        console.error(error('MSW Mock 需要指定 --resource 参数'))
        process.exit(1)
      }

      result = mockGenerator.generateCRUDHandlers(options.resource)
      const outputPath = options.output || resolvePath(`mocks/${options.resource}-handlers.ts`)
      writeFile(outputPath, result as string)
      console.log(success(`已生成 MSW Handlers: ${outputPath}`))
    }

    console.log(success('✨ Mock 生成完成！'))
  }
  catch (err) {
    console.error(error(`Mock 生成失败: ${err instanceof Error ? err.message : String(err)}`))
    process.exit(1)
  }
}

/**
 * 生成配置文件
 */
export async function configCommand(
  configType: 'vitest' | 'playwright',
  options: {
    output?: string
    coverage?: boolean
    e2e?: boolean
  },
): Promise<void> {
  console.log(info(`生成 ${configType} 配置...`))

  const configGenerator = createConfigGenerator()

  try {
    let config: string
    let defaultPath: string

    if (configType === 'vitest') {
      const framework = detectFramework()
      config = configGenerator.generateVitestConfig({
        environment: framework === 'vue' || framework === 'react' ? 'jsdom' : 'node',
        globals: true,
        coverage: options.coverage
          ? {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
          }
          : undefined,
        plugins: framework !== 'none' ? [framework] : [],
      })
      defaultPath = 'vitest.config.ts'
    }
    else {
      config = configGenerator.generatePlaywrightConfig({
        testDir: './e2e',
        baseURL: 'http://localhost:5173',
      })
      defaultPath = 'playwright.config.ts'
    }

    const outputPath = options.output || resolvePath(defaultPath)
    writeFile(outputPath, config)
    console.log(success(`已创建配置文件: ${outputPath}`))
  }
  catch (err) {
    console.error(error(`配置生成失败: ${err instanceof Error ? err.message : String(err)}`))
    process.exit(1)
  }
}

/**
 * 生成 CI/CD 配置
 */
export async function ciCommand(
  platform: 'github' | 'gitlab' | 'jenkins' | 'circleci',
  options: {
    output?: string
    nodeVersions?: string
    coverage?: boolean
  },
): Promise<void> {
  console.log(info(`生成 ${platform} CI/CD 配置...`))

  const ciGenerator = createCIGenerator()

  try {
    const nodeVersions = options.nodeVersions
      ? options.nodeVersions.split(',')
      : ['18', '20']

    const config = ciGenerator.generateCI({
      platform,
      nodeVersions,
      uploadCoverage: options.coverage ?? true,
      cache: true,
    })

    const defaultPaths: Record<string, string> = {
      github: '.github/workflows/test.yml',
      gitlab: '.gitlab-ci.yml',
      jenkins: 'Jenkinsfile',
      circleci: '.circleci/config.yml',
    }

    const outputPath = options.output || resolvePath(defaultPaths[platform])
    writeFile(outputPath, config)
    console.log(success(`已创建 CI 配置: ${outputPath}`))
  }
  catch (err) {
    console.error(error(`CI 配置生成失败: ${err instanceof Error ? err.message : String(err)}`))
    process.exit(1)
  }
}



