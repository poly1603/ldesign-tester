# 介绍

## 什么是 @ldesign/tester?

@ldesign/tester 是一个**企业级测试工具集**，旨在简化测试编写、Mock 数据生成、配置管理和 CI/CD 集成的复杂流程。

## 核心价值

### 🎯 提高效率

传统的测试编写需要：
- 手动创建测试文件
- 手动配置测试框架
- 手动编写 Mock 数据
- 手动配置 CI/CD

使用 @ldesign/tester，这些工作都可以**一键完成**。

### 📝 保证质量

- 生成的代码遵循最佳实践
- 完整的类型支持
- 详细的注释和示例
- 覆盖率报告和分析

### 🔧 灵活可定制

- 支持 Vue、React 等多种框架
- 支持 Vitest、Playwright 等多种工具
- 支持多种 CI/CD 平台
- 丰富的配置选项

## 主要功能

### 测试生成

自动生成各类测试文件：

- **单元测试** - 函数、类、工具库的测试
- **E2E 测试** - 端到端用户流程测试
- **组件测试** - Vue/React 组件测试
- **API 测试** - RESTful API 测试
- **集成测试** - 模块间协作测试

### Mock 系统

完整的 Mock 解决方案：

- **Faker.js 集成** - 生成逼真的假数据（支持中英文）
- **MSW 集成** - API 请求拦截和 Mock
- **模板库** - 常用数据类型模板（用户、产品、订单等）

### 配置生成

零配置启动测试环境：

- **Vitest 配置** - 现代化的测试框架配置
- **Playwright 配置** - E2E 测试配置
- **测试环境配置** - setup 文件、tsconfig 等

### CI/CD 集成

一键生成 CI/CD 配置：

- **GitHub Actions** - `.github/workflows/test.yml`
- **GitLab CI** - `.gitlab-ci.yml`
- **Jenkins** - `Jenkinsfile`
- **CircleCI** - `.circleci/config.yml`

### 性能测试

全面的性能测试工具：

- **基准测试** - 使用 tinybench
- **压力测试** - HTTP 负载测试
- **Lighthouse** - Web 性能分析

### 视觉回归

确保 UI 一致性：

- **Screenshot 对比** - 像素级对比
- **Percy 集成** - 云端视觉测试

### Dashboard

可视化测试结果：

- 测试运行历史
- 覆盖率趋势图表
- 失败用例追踪

## 设计理念

### 约定优于配置

提供合理的默认配置，减少配置工作量。同时保留灵活的配置选项。

### 最佳实践内置

生成的代码遵循业界最佳实践，包括：
- 清晰的命名规范
- 完整的类型定义
- 详细的注释
- 合理的目录结构

### 开发者友好

- 简单的命令行接口
- 友好的错误提示
- 详细的文档和示例
- 完整的 TypeScript 支持

## 技术栈

### 核心依赖

- **TypeScript 5.7+** - 类型安全
- **Commander** - CLI 框架
- **EJS** - 模板引擎

### 测试框架

- **Vitest** - 单元测试
- **Playwright** - E2E 测试
- **@testing-library** - 组件测试

### Mock 工具

- **Faker.js** - 假数据生成
- **MSW** - API Mock

### 性能工具

- **tinybench** - 基准测试
- **autocannon** - 压力测试
- **lighthouse** - 性能分析

### 视觉回归

- **pixelmatch** - 图片对比
- **@percy/playwright** - Percy 集成

## 下一步

- [快速开始](/guide/quick-start) - 5 分钟上手
- [测试生成](/guide/test-generation) - 学习如何生成测试
- [Mock 系统](/guide/mock-system) - 了解 Mock 功能
- [API 参考](/api/test-generator) - 查看完整 API



