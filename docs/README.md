# @ldesign/tester 文档

欢迎来到 @ldesign/tester 的完整文档！

## 📚 文档结构

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress 配置
├── guide/                 # 使用指南
│   ├── introduction.md    # 介绍
│   ├── quick-start.md     # 快速开始
│   ├── test-generation.md # 测试生成
│   ├── mock-system.md     # Mock 系统
│   ├── config-generation.md
│   ├── ci-cd.md
│   ├── performance-testing.md
│   ├── visual-regression.md
│   ├── dashboard.md
│   ├── cli-overview.md
│   └── cli-reference.md
├── api/                   # API 文档
│   ├── test-generator.md
│   ├── config-generator.md
│   ├── mock-generator.md
│   ├── faker-generator.md
│   ├── msw-generator.md
│   └── ...
├── examples/              # 示例代码
│   ├── unit-test.md
│   ├── e2e-test.md
│   ├── component-test.md
│   ├── faker-mock.md
│   ├── msw-handlers.md
│   └── ...
├── best-practices/        # 最佳实践
│   ├── testing-strategy.md
│   ├── naming-conventions.md
│   ├── project-structure.md
│   └── performance.md
├── index.md               # 首页
└── package.json
```

## 🚀 启动文档

### 1. 安装依赖

```bash
cd tools/tester/docs
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm docs:dev
```

访问 `http://localhost:5173` 查看文档。

### 3. 构建文档

```bash
pnpm docs:build
```

生成的静态文件在 `.vitepress/dist/` 目录。

### 4. 预览构建结果

```bash
pnpm docs:preview
```

## 📖 已完成的文档

### 指南 (Guide)

- ✅ **介绍** - 什么是 @ldesign/tester
- ✅ **快速开始** - 5 分钟上手指南
- ✅ **测试生成** - 如何生成各种测试
- ✅ **Mock 系统** - Faker 和 MSW 使用
- ⏳ **配置生成** - 待完成
- ⏳ **CI/CD 集成** - 待完成
- ⏳ **性能测试** - 待完成
- ⏳ **视觉回归** - 待完成
- ⏳ **Dashboard** - 待完成
- ⏳ **CLI 概览** - 待完成
- ⏳ **CLI 命令参考** - 待完成

### API 文档 (API)

- ✅ **TestGenerator** - 测试生成器 API
- ⏳ **ConfigGenerator** - 配置生成器 API
- ⏳ **MockGenerator** - Mock 生成器 API
- ⏳ **FakerGenerator** - Faker 生成器 API
- ⏳ **MSWGenerator** - MSW 生成器 API
- ⏳ **ReportGenerator** - 报告生成器 API
- ⏳ **PerformanceTester** - 性能测试 API
- ⏳ **VisualRegression** - 视觉回归 API
- ⏳ **Dashboard** - Dashboard API

### 示例 (Examples)

- ✅ **单元测试** - 完整的单元测试示例
- ⏳ **E2E 测试** - 待完成
- ⏳ **组件测试** - 待完成
- ⏳ **Faker Mock** - 待完成
- ⏳ **MSW Handlers** - 待完成
- ⏳ **Vue 项目集成** - 待完成
- ⏳ **React 项目集成** - 待完成

### 最佳实践 (Best Practices)

- ⏳ **测试策略** - 待完成
- ⏳ **命名规范** - 待完成
- ⏳ **项目结构** - 待完成
- ⏳ **性能优化** - 待完成

## 🎨 文档特性

### 主题配置

- ✅ 导航栏
- ✅ 侧边栏
- ✅ 搜索功能
- ✅ 暗色模式
- ✅ 代码高亮
- ✅ 多语言支持（预留）

### Markdown 增强

- ✅ 代码组 (Code Groups)
- ✅ 代码行号
- ✅ 提示框 (Tip/Warning/Danger)
- ✅ 自定义容器
- ✅ Emoji 支持

## 📝 编写指南

### 1. 创建新页面

在相应目录下创建 `.md` 文件：

```bash
# 创建指南页面
touch docs/guide/new-guide.md

# 创建 API 文档
touch docs/api/new-api.md

# 创建示例
touch docs/examples/new-example.md
```

### 2. 更新导航/侧边栏

编辑 `docs/.vitepress/config.ts`，添加新页面到相应的导航或侧边栏配置。

### 3. Markdown 语法

#### 提示框

```markdown
::: tip 提示
这是一个提示
:::

::: warning 警告
这是一个警告
:::

::: danger 危险
这是一个危险提示
:::
```

#### 代码组

```markdown
::: code-group

\`\`\`bash [pnpm]
pnpm add @ldesign/tester
\`\`\`

\`\`\`bash [npm]
npm install @ldesign/tester
\`\`\`

:::
```

#### 徽章

```markdown
<Badge type="tip" text="新功能" />
<Badge type="warning" text="实验性" />
<Badge type="danger" text="已废弃" />
```

## 🔗 相关链接

- [VitePress 文档](https://vitepress.dev/)
- [Markdown 语法](https://vitepress.dev/guide/markdown)
- [主题配置](https://vitepress.dev/reference/default-theme-config)

## 📊 文档完成进度

- **总页面数**: ~30 页（计划）
- **已完成**: 8 页
- **进度**: 27%

### 下一步

1. 完成所有指南页面
2. 完成所有 API 文档
3. 添加更多示例
4. 编写最佳实践
5. 添加搜索优化
6. 部署到 GitHub Pages



