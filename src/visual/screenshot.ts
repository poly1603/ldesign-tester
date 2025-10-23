/**
 * 截图对比
 */
import type { VisualRegressionResult } from '../types/index.js'

export class ScreenshotComparator {
  /**
   * 生成截图测试代码
   */
  generateScreenshotTest(pageName: string): string {
    return `import { test, expect } from '@playwright/test'

test.describe('${pageName} Visual Regression', () => {
  test('should match screenshot', async ({ page }) => {
    await page.goto('/${pageName.toLowerCase()}')
    await expect(page).toHaveScreenshot('${pageName.toLowerCase()}.png')
  })
  
  test('should match screenshot on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/${pageName.toLowerCase()}')
    await expect(page).toHaveScreenshot('${pageName.toLowerCase()}-mobile.png')
  })
})
`
  }

  /**
   * 生成 Percy 集成代码
   */
  generatePercyTest(pageName: string): string {
    return `import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test.describe('${pageName} Percy', () => {
  test('should capture snapshot', async ({ page }) => {
    await page.goto('/${pageName.toLowerCase()}')
    await percySnapshot(page, '${pageName}')
  })
})
`
  }
}

export function createScreenshotComparator(): ScreenshotComparator {
  return new ScreenshotComparator()
}



