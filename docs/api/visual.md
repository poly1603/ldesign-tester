# Visual Regression API

视觉回归测试 API 文档。

## VisualRegression

视觉回归测试类，提供截图和对比功能。

### 创建实例

```typescript
import { createVisualRegression } from '@ldesign/tester'

const visualRegression = createVisualRegression()
```

### setScreenshotsDir

设置截图目录。

**签名：**

```typescript
setScreenshotsDir(dir: string): void
```

**示例：**

```typescript
visualRegression.setScreenshotsDir('./screenshots')
```

### captureScreenshot

拍摄页面截图。

**签名：**

```typescript
captureScreenshot(page: Page, options: CaptureOptions): Promise<string>
```

**参数：**

```typescript
interface CaptureOptions {
  name: string
  outputDir?: string
  fullPage?: boolean
  clip?: {
    x: number
    y: number
    width: number
    height: number
  }
}
```

**示例：**

```typescript
const screenshotPath = await visualRegression.captureScreenshot(page, {
  name: 'homepage',
  fullPage: true,
})
```

### captureAndCompare

拍摄截图并与基准图对比。

**签名：**

```typescript
captureAndCompare(
  page: Page,
  name: string,
  options?: Omit<CaptureOptions, 'name'>
): Promise<VisualRegressionResult>
```

**返回值：**

```typescript
interface VisualRegressionResult {
  name: string
  hasDiff: boolean
  diffPercentage?: number
  baselinePath: string
  currentPath: string
  diffPath?: string
}
```

**示例：**

```typescript
const result = await visualRegression.captureAndCompare(page, 'homepage')

if (result.hasDiff) {
  console.log(`❌ 发现差异: ${result.diffPercentage}%`)
  console.log(`差异图: ${result.diffPath}`)
}
else {
  console.log('✅ 无差异')
}
```

### compareScreenshots

对比两张已存在的截图。

**签名：**

```typescript
compareScreenshots(
  baselinePath: string,
  currentPath: string,
  options?: Partial<CompareOptions>
): Promise<VisualRegressionResult>
```

**示例：**

```typescript
const result = await visualRegression.compareScreenshots(
  'screenshots/baseline/home.png',
  'screenshots/current/home.png',
  {
    diffPath: 'screenshots/diffs/home-diff.png',
    threshold: 0.1,
  },
)
```

### updateBaseline

更新基准图。

**签名：**

```typescript
updateBaseline(name: string): void
```

**示例：**

```typescript
// 将当前截图设为新的基准图
visualRegression.updateBaseline('homepage')
```

### percySnapshot

拍摄 Percy 快照。

**签名：**

```typescript
percySnapshot(page: Page, options: PercySnapshotOptions): Promise<void>
```

**参数：**

```typescript
interface PercySnapshotOptions {
  name: string
  widths?: number[]
  minHeight?: number
  enableJavaScript?: boolean
  waitFor?: string
  percyCSS?: string
}
```

**示例：**

```typescript
await visualRegression.percySnapshot(page, {
  name: 'Homepage',
  widths: [375, 768, 1280],
  enableJavaScript: true,
  waitFor: '.content',
})
```

### generateVisualTest

生成视觉测试代码。

**签名：**

```typescript
generateVisualTest(testName: string, screenshotName: string): string
```

**示例：**

```typescript
const testCode = visualRegression.generateVisualTest(
  'Homepage visual test',
  'homepage',
)

console.log(testCode)
```

## ScreenshotComparer

像素级截图对比器。

### 创建实例

```typescript
import { createScreenshotComparer } from '@ldesign/tester'

const comparer = createScreenshotComparer()
```

### compareScreenshots

对比两张截图。

**签名：**

```typescript
compareScreenshots(options: CompareOptions): Promise<VisualRegressionResult>
```

**参数：**

```typescript
interface CompareOptions {
  baselinePath: string
  currentPath: string
  diffPath?: string
  threshold?: number      // 0-1, 默认 0.1
  includeAA?: boolean     // 包含抗锯齿，默认 false
}
```

**示例：**

```typescript
const result = await comparer.compareScreenshots({
  baselinePath: 'baseline/home.png',
  currentPath: 'current/home.png',
  diffPath: 'diffs/home-diff.png',
  threshold: 0.1,
})
```

### compareMany

批量对比截图。

**签名：**

```typescript
compareMany(comparisons: CompareOptions[]): Promise<VisualRegressionResult[]>
```

**示例：**

```typescript
const results = await comparer.compareMany([
  {
    baselinePath: 'baseline/home.png',
    currentPath: 'current/home.png',
    diffPath: 'diffs/home-diff.png',
  },
  {
    baselinePath: 'baseline/about.png',
    currentPath: 'current/about.png',
    diffPath: 'diffs/about-diff.png',
  },
])

results.forEach((result) => {
  console.log(comparer.formatResult(result))
})
```

## PercyIntegration

Percy 云端视觉测试集成。

### 创建实例

```typescript
import { createPercyIntegration } from '@ldesign/tester'

const percy = createPercyIntegration()
```

### snapshot

拍摄 Percy 快照。

**签名：**

```typescript
snapshot(page: Page, options: PercySnapshotOptions): Promise<void>
```

**示例：**

```typescript
await percy.snapshot(page, {
  name: 'Homepage',
  widths: [375, 768, 1280],
  minHeight: 1024,
  enableJavaScript: true,
})
```

### snapshotMany

批量拍摄快照。

**签名：**

```typescript
snapshotMany(page: Page, snapshots: PercySnapshotOptions[]): Promise<void>
```

**示例：**

```typescript
await percy.snapshotMany(page, [
  { name: 'Homepage - Mobile', widths: [375] },
  { name: 'Homepage - Tablet', widths: [768] },
  { name: 'Homepage - Desktop', widths: [1280] },
])
```

### generatePercyTest

生成 Percy 测试代码。

**签名：**

```typescript
generatePercyTest(testName: string, url: string, snapshotName: string): string
```

**示例：**

```typescript
const testCode = percy.generatePercyTest(
  'Homepage Percy test',
  '/',
  'Homepage',
)
```

## 完整示例

### 在 Playwright 测试中使用

```typescript
import { test, expect } from '@playwright/test'
import { createVisualRegression } from '@ldesign/tester'

const visualRegression = createVisualRegression()

test.describe('Visual Regression Tests', () => {
  test('homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const result = await visualRegression.captureAndCompare(
      page,
      'homepage',
      { fullPage: true },
    )
    
    expect(result.hasDiff).toBe(false)
  })

  test('login page', async ({ page }) => {
    await page.goto('/login')
    
    const result = await visualRegression.captureAndCompare(
      page,
      'login',
    )
    
    expect(result.hasDiff).toBe(false)
  })
})
```

### 使用 Percy

```typescript
import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test.describe('Percy Tests', () => {
  test('responsive homepage', async ({ page }) => {
    await page.goto('/')
    
    await percySnapshot(page, 'Homepage', {
      widths: [375, 768, 1280],
    })
  })
})
```

## 相关 API

- [视觉回归指南](/guide/visual-regression)
- [Playwright 文档](https://playwright.dev/)
- [Percy 文档](https://percy.io/)



