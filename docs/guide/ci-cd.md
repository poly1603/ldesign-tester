# CI/CD 集成

@ldesign/tester 可以生成多种 CI/CD 平台的配置文件，快速集成自动化测试。

## GitHub Actions

### 生成配置

```bash
npx ldesign-test ci github --node-versions 18,20 --coverage
```

生成的 `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

      - name: Archive test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results-${{ matrix.node-version }}
          path: |
            coverage/
            test-results/
```

### 编程方式

```typescript
import { createGitHubActionsGenerator } from '@ldesign/tester'
import fs from 'node:fs'

const generator = createGitHubActionsGenerator()

const config = generator.generate({
  platform: 'github',
  nodeVersions: ['18', '20'],
  uploadCoverage: true,
  cache: true,
})

fs.mkdirSync('.github/workflows', { recursive: true })
fs.writeFileSync('.github/workflows/test.yml', config)
```

## GitLab CI

### 生成配置

```bash
npx ldesign-test ci gitlab
```

生成的 `.gitlab-ci.yml`:

```yaml
image: node:20

stages:
  - install
  - lint
  - test
  - coverage

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

lint:
  stage: lint
  dependencies:
    - install
  script:
    - npm run lint

test:
  stage: test
  dependencies:
    - install
  script:
    - npm test

coverage:
  stage: coverage
  dependencies:
    - install
  script:
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    paths:
      - coverage/
```

## Jenkins

### 生成配置

```bash
npx ldesign-test ci jenkins
```

生成的 `Jenkinsfile`:

```groovy
pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Coverage') {
            steps {
                sh 'npm run test:coverage'
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
```

## CircleCI

### 生成配置

```bash
npx ldesign-test ci circleci
```

生成的 `.circleci/config.yml`:

```yaml
version: 2.1

orbs:
  node: circleci/node@5.1.0

jobs:
  test:
    docker:
      - image: cimg/node:20
    
    steps:
      - checkout
      
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
      
      - run:
          name: Install Dependencies
          command: npm ci
      
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      
      - run:
          name: Run Tests
          command: npm test
      
      - run:
          name: Generate Coverage
          command: npm run test:coverage
      
      - store_test_results:
          path: test-results
      
      - store_artifacts:
          path: coverage
          destination: coverage

workflows:
  version: 2
  test-workflow:
    jobs:
      - test
```

## 自定义配置

### 多 Node.js 版本

```typescript
import { createGitHubActionsGenerator } from '@ldesign/tester'

const generator = createGitHubActionsGenerator()

const config = generator.generate({
  platform: 'github',
  nodeVersions: ['16', '18', '20', '21'], // 多个版本
  uploadCoverage: true,
})
```

### pnpm 支持

生成器会自动检测项目使用的包管理器（通过检查 lock 文件）：

- `pnpm-lock.yaml` → 使用 pnpm
- `yarn.lock` → 使用 yarn
- `package-lock.json` → 使用 npm

生成的配置会使用对应的命令：

```yaml
# pnpm 项目
- run: pnpm install --frozen-lockfile
- run: pnpm test
- run: pnpm test:coverage

# yarn 项目
- run: yarn install --frozen-lockfile
- run: yarn test
- run: yarn test:coverage

# npm 项目
- run: npm ci
- run: npm test
- run: npm run test:coverage
```

## 覆盖率上传

### Codecov

默认集成 Codecov：

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
    flags: unittests
    name: codecov-${{ matrix.node-version }}
```

### Coveralls

如果使用 Coveralls：

```typescript
const config = generator.generate({
  platform: 'github',
  coverageService: 'coveralls',
})
```

## E2E 测试集成

在 CI 中运行 Playwright：

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 缓存优化

所有生成的配置都包含缓存优化：

### GitHub Actions

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
    cache: 'npm'  # 自动缓存
```

### GitLab CI

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
```

## 最佳实践

### 1. 分离测试流程

创建多个工作流：

- `test.yml` - 单元测试和集成测试
- `e2e.yml` - E2E 测试
- `coverage.yml` - 覆盖率检查

### 2. 矩阵测试

测试多个版本和环境：

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### 3. 条件执行

```yaml
# 只在 main 分支上传覆盖率
- name: Upload coverage
  if: github.ref == 'refs/heads/main'
  uses: codecov/codecov-action@v3
```

### 4. 失败通知

```yaml
- name: Send notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
```

## 下一步

- [性能测试](/guide/performance)
- [视觉回归](/guide/visual-regression)
- [Dashboard](/guide/dashboard)



