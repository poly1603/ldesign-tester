# CIGenerator

CI/CD 配置生成器，支持多种 CI 平台。

## 创建实例

```typescript
import { createCIGenerator } from '@ldesign/tester'

const generator = createCIGenerator()
```

## 方法

### generateCI

生成 CI 配置文件。

**签名：**

```typescript
generateCI(options: CIOptions): string
```

**参数：**

- `options` - CI 配置选项
  - `platform` - CI 平台（`'github'` | `'gitlab'` | `'jenkins'` | `'circleci'`）
  - `nodeVersions?` - Node.js 版本数组，默认 `['18', '20']`
  - `uploadCoverage?` - 是否上传覆盖率，默认 `true`
  - `coverageService?` - 覆盖率服务（`'codecov'` | `'coveralls'`），默认 `'codecov'`
  - `cache?` - 是否缓存依赖，默认 `true`

**返回值：**

CI 配置文件内容

## 平台支持

### GitHub Actions

```typescript
const config = generator.generateCI({
  platform: 'github',
  nodeVersions: ['18', '20'],
  uploadCoverage: true,
  cache: true,
})
```

生成的配置包含：
- 多 Node.js 版本矩阵
- 依赖缓存
- 覆盖率上传
- 测试结果归档

### GitLab CI

```typescript
const config = generator.generateCI({
  platform: 'gitlab',
  nodeVersions: ['18', '20'],
})
```

生成的配置包含：
- 多阶段 pipeline
- 缓存配置
- 覆盖率报告
- Artifacts 管理

### Jenkins

```typescript
const config = generator.generateCI({
  platform: 'jenkins',
  nodeVersions: ['20'],
})
```

生成 Jenkinsfile（Groovy 语法）。

### CircleCI

```typescript
const config = generator.generateCI({
  platform: 'circleci',
  nodeVersions: ['20'],
})
```

## 类型定义

### CIOptions

```typescript
interface CIOptions {
  platform: CIPlatform
  nodeVersions?: string[]
  uploadCoverage?: boolean
  coverageService?: 'codecov' | 'coveralls'
  cache?: boolean
}
```

### CIPlatform

```typescript
type CIPlatform = 'github' | 'gitlab' | 'jenkins' | 'circleci' | 'travis'
```

## 完整示例

### 生成所有平台配置

```typescript
import { createCIGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const generator = createCIGenerator()

const platforms = [
  { name: 'github', path: '.github/workflows/test.yml' },
  { name: 'gitlab', path: '.gitlab-ci.yml' },
  { name: 'jenkins', path: 'Jenkinsfile' },
  { name: 'circleci', path: '.circleci/config.yml' },
]

platforms.forEach(({ name, path }) => {
  const config = generator.generateCI({
    platform: name as CIPlatform,
    nodeVersions: ['18', '20'],
    uploadCoverage: true,
  })
  
  const dir = path.split('/').slice(0, -1).join('/')
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(path, config)
  console.log(`✅ 已生成 ${name} 配置: ${path}`)
})
```

## 自定义

### 包管理器检测

生成器会自动检测项目使用的包管理器：

```typescript
// 自动检测
if (fs.existsSync('pnpm-lock.yaml')) {
  // 使用 pnpm 命令
}
else if (fs.existsSync('yarn.lock')) {
  // 使用 yarn 命令
}
else {
  // 使用 npm 命令
}
```

### 自定义命令

虽然生成器会自动生成合适的命令，但你可以手动修改生成的配置文件。

## 相关 API

- [ConfigGenerator](/api/config-generator)
- [CI/CD 指南](/guide/ci-cd)



