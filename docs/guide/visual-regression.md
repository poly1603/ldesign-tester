# 视觉回归测试

视觉回归测试用于确保 UI 的一致性，防止意外的样式变化。

## Screenshot 对比

### 基本使用

```typescript
import { test, expect } from '@playwright/test'
import { createVisualRegression } from '@ldesign/tester'

const visualRegression = createVisualRegression()

test('homepage visual regression', async ({ page }) => {
  await page.goto('https://example.com')
  
  // 拍摄并对比截图
  const result = await visualRegression.captureAndCompare(
    page,
    'homepage',
  )
  
  // 断言无差异
  expect(result.hasDiff).toBe(false)
})
```

### 自定义选项

```typescript
const result = await visualRegression.captureAndCompare(
  page,
  'homepage',
  {
    fullPage: true,        // 全页截图
    clip: {                // 裁剪区域
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
    },
  },
)
```

### 更新基准图

当 UI 变化是预期的，需要更新基准图：

```typescript
// 更新基准图
visualRegression.updateBaseline('homepage')
```

或使用 CLI：

```bash
# 更新所有基准图
npx playwright test --update-snapshots

# 更新特定测试
npx playwright test homepage.spec.ts --update-snapshots
```

## 像素级对比

### 使用 ScreenshotComparer

```typescript
import { createScreenshotComparer } from '@ldesign/tester'

const comparer = createScreenshotComparer()

const result = await comparer.compareScreenshots({
  baselinePath: 'screenshots/baseline/homepage.png',
  currentPath: 'screenshots/current/homepage.png',
  diffPath: 'screenshots/diffs/homepage-diff.png',
  threshold: 0.1,        // 差异阈值 (0-1)
  includeAA: false,      // 不包含抗锯齿
})

console.log(comparer.formatResult(result))
```

输出结果：

```
📸 视觉回归测试: homepage
状态: ✅ 无差异
差异: 0.0000%
基准图: screenshots/baseline/homepage.png
当前图: screenshots/current/homepage.png
```

### 批量对比

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
  {
    baselinePath: 'baseline/contact.png',
    currentPath: 'current/contact.png',
    diffPath: 'diffs/contact-diff.png',
  },
])

console.log(comparer.formatResults(results))
```

## Percy 集成

Percy 是一个云端视觉测试平台。

### 配置 Percy

```bash
# 安装 Percy
pnpm add -D @percy/cli @percy/playwright

# 设置环境变量
export PERCY_TOKEN=your_token_here
```

### 使用 Percy

```typescript
import { test } from '@playwright/test'
import { createPercyIntegration } from '@ldesign/tester'

const percy = createPercyIntegration()

test('percy snapshot', async ({ page }) => {
  await page.goto('https://example.com')
  
  // 拍摄 Percy 快照
  await percy.snapshot(page, {
    name: 'Homepage',
    widths: [375, 768, 1280], // 多个视口宽度
  })
})
```

### 多视口测试

```typescript
await percy.snapshot(page, {
  name: 'Responsive Homepage',
  widths: [375, 768, 1024, 1280, 1920],
  minHeight: 1024,
  enableJavaScript: true,
})
```

### 批量快照

```typescript
const snapshots = [
  { name: 'Homepage', url: '/' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
]

for (const snapshot of snapshots) {
  await page.goto(snapshot.url)
  await percy.snapshot(page, {
    name: snapshot.name,
    widths: [375, 768, 1280],
  })
}
```

## 生成视觉测试代码

```typescript
import { createVisualRegression } from '@ldesign/tester'

const visualRegression = createVisualRegression()

// 生成测试代码
const testCode = visualRegression.generateVisualTest(
  'Homepage visual test',
  'homepage',
)

console.log(testCode)
```

生成的代码：

```typescript
import { test, expect } from '@playwright/test'

test('Homepage visual test', async ({ page }) => {
  // 访问页面
  await page.goto('/')
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle')
  
  // 拍摄截图并对比
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
  })
})
```

## 目录结构

```
tests/
└── visual/
    ├── screenshots/          # 当前截图
    │   ├── homepage.png
    │   └── about.png
    ├── baseline/             # 基准图
    │   ├── homepage.png
    │   └── about.png
    └── diffs/                # 差异图
        ├── homepage-diff.png
        └── about-diff.png
```

## 在 CI 中运行

### GitHub Actions

```yaml
name: Visual Regression

on:
  pull_request:
    branches: [main]

jobs:
  percy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Percy tests
        run: npx percy exec -- npm run test:visual
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

### 本地测试

```bash
# 运行视觉测试
npm run test:visual

# 更新基准图
npm run test:visual -- --update-snapshots
```

## Playwright 内置截图对比

Playwright 内置了截图对比功能：

```typescript
import { test, expect } from '@playwright/test'

test('visual regression', async ({ page }) => {
  await page.goto('https://example.com')
  
  // 使用 Playwright 内置对比
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100,      // 允许的差异像素数
    threshold: 0.2,           // 差异阈值
  })
})
```

### 元素截图

```typescript
test('button visual test', async ({ page }) => {
  await page.goto('/')
  
  // 截图特定元素
  const button = page.locator('button.primary')
  
  await expect(button).toHaveScreenshot('primary-button.png', {
    animations: 'disabled',   // 禁用动画
  })
})
```

## 忽略动态内容

### 使用 Mask

```typescript
test('ignore dynamic content', async ({ page }) => {
  await page.goto('/')
  
  await expect(page).toHaveScreenshot('homepage.png', {
    mask: [
      page.locator('.timestamp'),  // 遮罩时间戳
      page.locator('.ad-banner'),  // 遮罩广告
    ],
  })
})
```

### 使用 CSS

```typescript
await percy.snapshot(page, {
  name: 'Homepage',
  percyCSS: `
    .timestamp { visibility: hidden; }
    .ad-banner { display: none; }
  `,
})
```

## 最佳实践

### 1. 稳定的测试环境

```typescript
test.beforeEach(async ({ page }) => {
  // 禁用动画
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  })
  
  // 设置固定视口
  await page.setViewportSize({ width: 1280, height: 720 })
})
```

### 2. 等待内容加载

```typescript
await page.goto('/')

// 等待网络空闲
await page.waitForLoadState('networkidle')

// 等待特定元素
await page.waitForSelector('.content')

// 拍摄截图
await expect(page).toHaveScreenshot()
```

### 3. 命名规范

```typescript
// 使用描述性名称
await expect(page).toHaveScreenshot('homepage-desktop-1280.png')
await expect(page).toHaveScreenshot('homepage-mobile-375.png')
await expect(page).toHaveScreenshot('login-form-empty-state.png')
await expect(page).toHaveScreenshot('login-form-error-state.png')
```

## 下一步

- [Dashboard](/guide/dashboard)
- [视觉回归 API](/api/visual)
- [Playwright 文档](https://playwright.dev/)
- [Percy 文档](https://percy.io/)



