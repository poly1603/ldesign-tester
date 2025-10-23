/**
 * 配置生成器 - 生成 Vitest 和 Playwright 配置
 */
import type { PlaywrightOptions, VitestOptions } from '../types/index.js'
import { createTemplateEngine } from './template-engine.js'

export class ConfigGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成 Vitest 配置
   * @param options Vitest 配置选项
   * @returns 配置文件内容
   */
  generateVitestConfig(options: VitestOptions = {}): string {
    const {
      environment = 'jsdom',
      globals = true,
      coverage = {},
      include = [
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        '__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],
      exclude = [
        'node_modules',
        'dist',
        'lib',
        'es',
        'types',
        'coverage',
      ],
      plugins = [],
    } = options

    const {
      provider = 'v8',
      reporter = ['text', 'json', 'html'],
      reportsDirectory = './coverage',
      exclude: coverageExclude = [
        'node_modules/',
        'dist/',
        'lib/',
        'es/',
        'types/',
        'coverage/',
        'tests/',
        '__tests__/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
      thresholds = {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    } = coverage

    const template = `import { defineConfig } from 'vitest/config'
${plugins.includes('vue') ? 'import vue from \'@vitejs/plugin-vue\'' : ''}
${plugins.includes('react') ? 'import react from \'@vitejs/plugin-react\'' : ''}

export default defineConfig({
  ${plugins.length > 0 ? `plugins: [${plugins.map(p => `${p}()`).join(', ')}],` : ''}
  test: {
    globals: ${globals},
    environment: '${environment}',
    include: ${JSON.stringify(include, null, 6).replace(/\n/g, '\n    ')},
    exclude: ${JSON.stringify(exclude, null, 6).replace(/\n/g, '\n    ')},
    coverage: {
      provider: '${provider}',
      reporter: ${JSON.stringify(reporter, null, 8).replace(/\n/g, '\n      ')},
      reportsDirectory: '${reportsDirectory}',
      exclude: ${JSON.stringify(coverageExclude, null, 8).replace(/\n/g, '\n        ')},
      thresholds: ${JSON.stringify(thresholds, null, 8).replace(/\n/g, '\n        ')},
    },
  },
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 Playwright 配置
   * @param options Playwright 配置选项
   * @returns 配置文件内容
   */
  generatePlaywrightConfig(options: PlaywrightOptions = {}): string {
    const {
      testDir = './e2e',
      baseURL = 'http://localhost:5173',
      fullyParallel = true,
      retries = 0,
      projects = [
        { name: 'chromium', use: { ...{ channel: 'chrome' } } },
        { name: 'firefox' },
        { name: 'webkit' },
      ],
      trace = true,
      screenshot = true,
      video = true,
    } = options

    const template = `import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: '${testDir}',
  /* Run tests in files in parallel */
  fullyParallel: ${fullyParallel},
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : ${retries},
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like \`await page.goto('/')\`. */
    baseURL: '${baseURL}',
    /* Collect trace when retrying the failed test. */
    trace: ${trace ? '\'on-first-retry\'' : '\'off\''},
    /* Take screenshot only when test fails */
    screenshot: ${screenshot ? '\'only-on-failure\'' : '\'off\''},
    /* Record video only when test fails */
    video: ${video ? '\'retain-on-failure\'' : '\'off\''},
  },

  /* Configure projects for major browsers */
  projects: [
${projects.map((p) => {
      const useStr = p.use ? `, use: { ...devices['Desktop ${p.name.charAt(0).toUpperCase() + p.name.slice(1)}'] }` : ''
      return `    {
      name: '${p.name}'${useStr},
    }`
    }).join(',\n')},
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: '${baseURL}',
    reuseExistingServer: !process.env.CI,
  },
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成测试 setup 文件
   * @param framework 组件框架
   * @returns setup 文件内容
   */
  generateSetupFile(framework?: 'vue' | 'react'): string {
    let template = `/**
 * 测试环境配置
 */
import { vi } from 'vitest'

// 全局配置
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
`

    if (framework === 'vue') {
      template += `
// Vue 测试配置
import { config } from '@vue/test-utils'

// 全局存根组件
config.global.stubs = {
  Transition: false,
  TransitionGroup: false,
}
`
    }
    else if (framework === 'react') {
      template += `
// React 测试配置
import '@testing-library/jest-dom'
`
    }

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 tsconfig 测试配置
   * @returns tsconfig 内容
   */
  generateTsConfig(): string {
    const config = {
      extends: './tsconfig.json',
      compilerOptions: {
        types: ['vitest/globals', '@testing-library/jest-dom'],
      },
      include: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'tests/**/*.ts',
        '__tests__/**/*.ts',
      ],
    }

    return JSON.stringify(config, null, 2) + '\n'
  }
}

/**
 * 创建配置生成器实例
 */
export function createConfigGenerator(): ConfigGenerator {
  return new ConfigGenerator()
}




