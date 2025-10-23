/**
 * E2E 测试生成器
 */
import type { GenerateOptions } from '../../types/index.js'
import { createTemplateEngine } from '../../core/template-engine.js'

export class E2ETestGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成页面对象类
   * @param pageName 页面名称
   * @param options 生成选项
   */
  generatePageObject(pageName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${pageName} 页面对象
 */
` : ''}import type { Page, Locator } from '@playwright/test'

export class ${pageName}Page {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  ${includeComments ? '// 页面元素定位器\n  ' : ''}get heading(): Locator {
    return this.page.locator('h1')
  }

  get submitButton(): Locator {
    return this.page.locator('button[type="submit"]')
  }

  ${includeComments ? '// 页面操作方法\n  ' : ''}async goto(): Promise<void> {
    await this.page.goto('/${pageName.toLowerCase()}')
  }

  async fillForm(data: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      await this.page.fill(\`input[name="\${key}"]\`, value)
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click()
  }

  async waitForSuccess(): Promise<void> {
    await this.page.waitForSelector('.success-message', { state: 'visible' })
  }
}
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成完整的 E2E 测试（带页面对象）
   * @param feature 功能名称
   * @param pageName 页面名称
   * @param options 生成选项
   */
  generateE2ETestWithPO(
    feature: string,
    pageName: string,
    options: GenerateOptions = {},
  ): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${feature} E2E 测试（使用页面对象模式）
 */
` : ''}import { test, expect } from '@playwright/test'
import { ${pageName}Page } from './pages/${pageName}Page'

test.describe('${feature}', () => {
  let page: ${pageName}Page

  test.beforeEach(async ({ page: playwrightPage }) => {
    page = new ${pageName}Page(playwrightPage)
    await page.goto()
  })

  test('should load the page correctly', async () => {
    await expect(page.heading).toBeVisible()
  })

  test('should fill and submit form', async () => {
    await page.fillForm({
      username: 'testuser',
      email: 'test@example.com',
    })
    await page.submit()
    await page.waitForSuccess()
  })

  test('should handle validation errors', async () => {
    await page.submit()
    await expect(page.page.locator('.error-message')).toBeVisible()
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成表单测试
   * @param formName 表单名称
   * @param options 生成选项
   */
  generateFormTest(formName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${formName} 表单 E2E 测试
 */
` : ''}import { test, expect } from '@playwright/test'

test.describe('${formName} Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should validate required fields', async ({ page }) => {
    await page.click('button[type="submit"]')
    await expect(page.locator('.field-error')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')
    await expect(page.locator('.email-error')).toBeVisible()
  })

  test('should submit form with valid data', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    await page.waitForURL('**/success')
    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('should clear form on reset', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser')
    await page.click('button[type="reset"]')
    await expect(page.locator('input[name="username"]')).toHaveValue('')
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成导航测试
   * @param options 生成选项
   */
  generateNavigationTest(options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * 页面导航 E2E 测试
 */
` : ''}import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')
    
    // 首页
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toBeVisible()
    
    // 导航到关于页
    await page.click('a[href="/about"]')
    await expect(page).toHaveURL('/about')
    
    // 导航到联系页
    await page.click('a[href="/contact"]')
    await expect(page).toHaveURL('/contact')
  })

  test('should handle back/forward navigation', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="/about"]')
    await page.goBack()
    await expect(page).toHaveURL('/')
    
    await page.goForward()
    await expect(page).toHaveURL('/about')
  })

  test('should highlight active nav item', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('nav a[href="/about"]')).toHaveClass(/active/)
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成认证流程测试
   * @param options 生成选项
   */
  generateAuthTest(options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * 用户认证 E2E 测试
 */
` : ''}import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await page.waitForURL('**/dashboard')
    await expect(page.locator('.user-menu')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="username"]', 'wronguser')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.error-message')).toContainText('Invalid credentials')
  })

  test('should logout successfully', async ({ page }) => {
    // 先登录
    await page.goto('/login')
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')
    
    // 登出
    await page.click('.user-menu')
    await page.click('text=Logout')
    await page.waitForURL('**/login')
  })

  test('should redirect to login when accessing protected page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login')
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成跨浏览器测试配置
   * @param testName 测试名称
   * @param options 生成选项
   */
  generateCrossBrowserTest(testName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${testName} 跨浏览器测试
 */
` : ''}import { test, expect, devices } from '@playwright/test'

const browsers = ['chromium', 'firefox', 'webkit'] as const
const mobileDevices = [devices['iPhone 12'], devices['Pixel 5']]

browsers.forEach((browserName) => {
  test.describe(\`${testName} on \${browserName}\`, () => {
    test.use({ browserName })

    test('should work correctly', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
    })
  })
})

mobileDevices.forEach((device) => {
  test.describe(\`${testName} on \${device.name}\`, () => {
    test.use(device)

    test('should be mobile-responsive', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('.mobile-menu')).toBeVisible()
    })
  })
})
`

    return this.templateEngine.formatCode(template)
  }
}

/**
 * 创建 E2E 测试生成器实例
 */
export function createE2ETestGenerator(): E2ETestGenerator {
  return new E2ETestGenerator()
}




