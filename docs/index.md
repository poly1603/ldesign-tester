---
layout: home

hero:
  name: "@ldesign/tester"
  text: "企业级测试工具集"
  tagline: 一键生成测试、Mock、配置和CI/CD
  image:
    src: /logo.svg
    alt: LDesign Tester
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看示例
      link: /examples/basic

features:
  - icon: 🎯
    title: 完整测试生成
    details: 自动生成单元、E2E、组件、API、集成测试，支持Vue和React
  
  - icon: 🎭
    title: 强大Mock系统
    details: Faker.js + MSW完整集成，轻松生成Mock数据和API
  
  - icon: ⚙️
    title: 零配置启动
    details: 一键生成Vitest和Playwright配置，立即开始测试
  
  - icon: 🚀
    title: CI/CD就绪
    details: 内置GitHub Actions、GitLab CI、Jenkins等CI/CD模板
  
  - icon: ⚡
    title: 性能测试
    details: 基准测试、压力测试、Lighthouse集成
  
  - icon: 📸
    title: 视觉回归
    details: Screenshot对比和Percy集成，确保UI一致性
  
  - icon: 📊
    title: 测试Dashboard
    details: 可视化测试历史、覆盖率趋势和失败追踪
  
  - icon: 🎨
    title: TypeScript优先
    details: 完整的类型定义和智能提示支持
---

## 快速开始

### 安装

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

### 初始化

```bash
# 初始化测试配置
npx ldesign-test init

# 生成单元测试
npx ldesign-test generate unit UserService

# 生成Vue组件测试
npx ldesign-test generate component Button --framework vue
```

### 编程方式使用

```typescript
import { createTestGenerator, createMockGenerator } from '@ldesign/tester'

// 生成测试
const testGen = createTestGenerator()
const test = testGen.generateUnitTest('calculateTotal')

// 生成Mock数据
const mockGen = createMockGenerator()
const users = mockGen.generateCommonData('user', 10)
```

## 为什么选择 @ldesign/tester？

### 🎯 完整的测试解决方案

不仅仅是测试生成器，而是一个完整的测试工具集，包含从测试编写到CI/CD的全流程支持。

### 🚀 提升开发效率

自动生成测试代码，减少重复工作，让开发者专注于业务逻辑。

### 📚 最佳实践内置

遵循测试最佳实践，生成的代码结构清晰、易于维护。

### 🔧 灵活可扩展

模块化设计，可以单独使用任何功能，也可以组合使用。

## 主要功能

### 测试生成

- ✅ 单元测试（函数、类、工具）
- ✅ E2E测试（Playwright）
- ✅ 组件测试（Vue + React）
- ✅ API测试（REST + GraphQL）
- ✅ 集成测试

### Mock系统

- ✅ Faker.js集成（假数据生成）
- ✅ MSW集成（API Mock）
- ✅ 组件Mock（Vue + React）
- ✅ 函数Mock（vi.fn/vi.mock）

### 配置生成

- ✅ Vitest配置
- ✅ Playwright配置
- ✅ 测试环境配置
- ✅ TypeScript配置

### CI/CD集成

- ✅ GitHub Actions
- ✅ GitLab CI
- ✅ Jenkins Pipeline
- ✅ CircleCI

### 性能与视觉

- ✅ 基准测试（Benchmark）
- ✅ 压力测试（Load Test）
- ✅ Lighthouse集成
- ✅ Screenshot对比
- ✅ Percy集成

## 社区

- [GitHub](https://github.com/ldesign/ldesign)
- [Issues](https://github.com/ldesign/ldesign/issues)
- [Discussions](https://github.com/ldesign/ldesign/discussions)

## License

MIT © LDesign Team


