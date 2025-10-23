# 介绍

## @ldesign/tester 是什么？

@ldesign/tester 是一个**企业级测试工具集**，提供从测试编写到CI/CD的完整解决方案。

它不仅仅是一个测试生成器，而是一个集成了多种测试工具和最佳实践的完整工具集。

## 核心价值

### 🚀 提升效率

- 自动生成测试代码，减少80%的重复工作
- 一键配置测试环境，立即开始测试
- 内置Mock系统，无需手动编写Mock数据

### 📚 最佳实践

- 遵循测试最佳实践，生成高质量测试代码
- 支持TDD/BDD开发模式
- 完整的测试覆盖率支持

### 🔧 灵活可扩展

- 模块化设计，按需使用
- 支持自定义模板
- 丰富的配置选项

## 功能特性

### 测试生成

支持生成5种类型的测试：

- **单元测试** - 函数、类、工具测试
- **E2E测试** - Playwright端到端测试
- **组件测试** - Vue和React组件测试
- **API测试** - REST和GraphQL API测试
- **集成测试** - 多模块集成测试

### Mock系统

完整的Mock解决方案：

- **Faker.js** - 假数据生成，支持30+字段类型
- **MSW** - API Mock，支持REST和GraphQL
- **组件Mock** - Vue和React组件Mock
- **函数Mock** - vi.fn/vi.mock/vi.spyOn

### 配置生成

零配置启动测试：

- **Vitest配置** - 自动检测框架，生成最优配置
- **Playwright配置** - 多浏览器、多设备配置
- **覆盖率配置** - c8/istanbul集成
- **TypeScript配置** - 测试专用tsconfig

### CI/CD集成

生产就绪的CI/CD模板：

- **GitHub Actions** - 矩阵测试、覆盖率上传
- **GitLab CI** - Pipeline配置、Artifacts保存
- **Jenkins** - 声明式Pipeline
- **CircleCI** - 并行执行、缓存优化

### 性能测试

完整的性能测试方案：

- **基准测试** - tinybench集成
- **压力测试** - autocannon集成
- **Lighthouse** - Web性能评分
- **Web Vitals** - LCP/FID/CLS监控

### 视觉回归

确保UI一致性：

- **Screenshot对比** - Playwright截图对比
- **Percy集成** - 自动化视觉测试
- **差异检测** - 像素级差异分析

### Dashboard

可视化测试数据：

- **测试历史** - SQLite存储历史数据
- **覆盖率趋势** - 折线图展示趋势
- **失败追踪** - 失败用例追踪和分析

## 使用场景

### 新项目启动

```bash
# 初始化测试环境
npx ldesign-test init --framework vue --coverage --e2e

# 生成测试脚手架
npx ldesign-test scaffold

# 开始编写业务代码和测试
```

### 已有项目接入

```bash
# 安装工具
pnpm add -D @ldesign/tester

# 为现有代码生成测试
npx ldesign-test generate unit src/utils/format.ts
npx ldesign-test generate component src/components/Button.vue --framework vue

# 添加CI/CD
npx ldesign-test ci github
```

### 持续集成

```bash
# 在CI中运行测试
pnpm test:coverage

# 启动Dashboard查看结果
pnpm ldesign-test dashboard
```

## 与其他工具对比

| 功能 | @ldesign/tester | Vitest | Playwright | Jest |
|------|----------------|--------|-----------|------|
| 测试生成 | ✅ | ❌ | ⚠️ 部分 | ❌ |
| Mock系统 | ✅ 完整 | ✅ | ✅ | ✅ |
| 配置生成 | ✅ | ❌ | ❌ | ❌ |
| CI/CD模板 | ✅ | ❌ | ❌ | ❌ |
| 性能测试 | ✅ | ⚠️ Bench | ❌ | ❌ |
| 视觉回归 | ✅ | ❌ | ✅ | ❌ |
| Dashboard | ✅ | ✅ UI | ✅ Trace | ❌ |

**总结**: @ldesign/tester 是唯一集成了测试生成、配置生成和CI/CD模板的完整工具集。

## 下一步

- [快速开始](/guide/getting-started) - 开始使用
- [测试生成](/guide/test-generation) - 了解测试生成
- [Mock系统](/guide/mock-system) - 使用Mock系统
- [API参考](/api/) - 查看API文档



