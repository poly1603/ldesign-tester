# 安装

## 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) / npm >= 9.0.0 / yarn >= 1.22.0

## 包管理器安装

::: code-group

```bash [pnpm]
pnpm add -D @ldesign/tester
```

```bash [npm]
npm install --save-dev @ldesign/tester
```

```bash [yarn]
yarn add -D @ldesign/tester
```

:::

## 全局安装（CLI）

如果你想在任何地方使用 CLI：

```bash
npm install -g @ldesign/tester
```

然后可以直接使用：

```bash
ldesign-test --help
```

## 依赖说明

@ldesign/tester 包含以下主要依赖：

### 核心依赖

- **TypeScript** - 类型系统
- **Commander** - CLI 框架

### 测试框架（可选）

需要根据使用的功能安装：

```bash
# Vitest (单元测试)
pnpm add -D vitest

# Playwright (E2E 测试)
pnpm add -D @playwright/test

# Vue Testing Library
pnpm add -D @vue/test-utils

# React Testing Library
pnpm add -D @testing-library/react @testing-library/user-event
```

### Mock 工具（可选）

```bash
# Faker.js
pnpm add -D @faker-js/faker

# MSW
pnpm add -D msw
```

## 验证安装

```bash
# 检查版本
npx ldesign-test --version

# 查看帮助
npx ldesign-test --help
```

## 项目配置

安装后，建议在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:benchmark": "ldesign-test benchmark"
  }
}
```

## TypeScript 配置

确保 `tsconfig.json` 包含测试文件：

```json
{
  "include": [
    "src/**/*",
    "tests/**/*",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

## 下一步

- [快速开始](/guide/getting-started) - 开始使用
- [配置指南](/guide/config-generation) - 详细配置



