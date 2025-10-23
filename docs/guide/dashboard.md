# Dashboard

@ldesign/tester 提供一个 Web Dashboard，用于可视化测试结果、覆盖率趋势和失败用例。

## 启动 Dashboard

### CLI 方式

```bash
# 启动 Dashboard（默认端口 3000）
npx ldesign-test dashboard

# 指定端口
npx ldesign-test dashboard --port 8080

# 不自动打开浏览器
npx ldesign-test dashboard --no-open
```

### 编程方式

```typescript
import { createDashboardServer } from '@ldesign/tester'

const dashboard = createDashboardServer({
  port: 3000,
  dbPath: './test-history.db',
  open: true,
})

await dashboard.start()
```

## 数据存储

Dashboard 使用 SQLite 数据库存储测试历史。

### 保存测试结果

```typescript
import { createTestDatabase } from '@ldesign/tester'
import type { TestResult, CoverageData } from '@ldesign/tester'

const db = createTestDatabase('./test-history.db')

// 测试结果
const results: TestResult[] = [
  {
    name: 'UserService.test.ts',
    passed: true,
    duration: 150,
    timestamp: Date.now(),
  },
  {
    name: 'ProductService.test.ts',
    passed: false,
    error: 'Assertion failed',
    duration: 200,
    timestamp: Date.now(),
  },
]

// 覆盖率数据
const coverage: CoverageData = {
  totalLines: 1000,
  coveredLines: 850,
  totalBranches: 200,
  coveredBranches: 160,
  totalFunctions: 100,
  coveredFunctions: 85,
  totalStatements: 1200,
  coveredStatements: 1000,
}

// 保存测试运行
const runId = db.saveTestRun(results, coverage)

console.log(`测试运行已保存，ID: ${runId}`)
```

## API 端点

Dashboard 提供 RESTful API：

### 获取测试运行列表

```bash
GET http://localhost:3000/api/test-runs?limit=50
```

响应：

```json
[
  {
    "id": 1,
    "timestamp": 1698123456789,
    "totalTests": 50,
    "passedTests": 48,
    "failedTests": 2,
    "duration": 5000,
    "coverageData": "{...}"
  }
]
```

### 获取覆盖率历史

```bash
GET http://localhost:3000/api/coverage-history?limit=30
```

响应：

```json
[
  {
    "id": 1,
    "run_id": 1,
    "lines_percentage": 85.5,
    "branches_percentage": 80.0,
    "functions_percentage": 85.0,
    "statements_percentage": 83.3,
    "timestamp": 1698123456789
  }
]
```

### 获取失败测试

```bash
GET http://localhost:3000/api/failed-tests?limit=20
```

### 获取统计信息

```bash
GET http://localhost:3000/api/stats
```

响应：

```json
{
  "totalRuns": 100,
  "averagePassRate": "96.50",
  "averageDuration": "4500.00",
  "latestRun": {
    "id": 100,
    "totalTests": 50,
    "passedTests": 49,
    "failedTests": 1,
    "duration": 4800
  }
}
```

## 集成到测试流程

### Vitest 集成

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...其他配置
    reporters: [
      'default',
      ['custom', { saveToDb: true }],
    ],
  },
})
```

创建自定义 reporter：

```typescript
// tests/reporters/db-reporter.ts
import type { Reporter } from 'vitest'
import { createTestDatabase } from '@ldesign/tester'

export class DbReporter implements Reporter {
  private db = createTestDatabase()

  onFinished(files: File[], errors: unknown[]) {
    const results = files.flatMap(file =>
      file.tasks.map(task => ({
        name: task.name,
        passed: task.result?.state === 'pass',
        error: task.result?.error?.message,
        duration: task.result?.duration || 0,
        timestamp: Date.now(),
      })),
    )

    this.db.saveTestRun(results)
  }
}
```

### 自动上传

```typescript
// tests/utils/upload-results.ts
import { createTestDatabase } from '@ldesign/tester'
import fs from 'node:fs'

export async function uploadTestResults() {
  const db = createTestDatabase()
  
  // 读取测试结果
  const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'))
  const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf-8'))
  
  // 保存到数据库
  const runId = db.saveTestRun(results, coverage)
  
  console.log(`✅ 测试结果已上传，运行 ID: ${runId}`)
}
```

在 CI 中使用：

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:coverage

- name: Upload results to Dashboard
  run: node tests/utils/upload-results.js
```

## 数据库操作

### 查询测试历史

```typescript
import { createTestDatabase } from '@ldesign/tester'

const db = createTestDatabase()

// 获取最近 50 次测试运行
const runs = db.getTestRuns(50)

runs.forEach((run) => {
  console.log(`Run #${run.id}:`)
  console.log(`  时间: ${new Date(run.timestamp).toLocaleString()}`)
  console.log(`  通过: ${run.passedTests}/${run.totalTests}`)
  console.log(`  耗时: ${run.duration}ms`)
})
```

### 查询覆盖率趋势

```typescript
const history = db.getCoverageHistory(30)

const trend = history.map(h => ({
  date: new Date(h.timestamp).toLocaleDateString(),
  lines: h.lines_percentage,
  branches: h.branches_percentage,
  functions: h.functions_percentage,
}))

console.table(trend)
```

### 查询失败测试

```typescript
const failedTests = db.getFailedTests(20)

failedTests.forEach((test) => {
  console.log(`❌ ${test.name}`)
  console.log(`   错误: ${test.error}`)
  console.log(`   时间: ${new Date(test.timestamp).toLocaleString()}`)
})
```

## 数据可视化

虽然当前版本的 Dashboard 是 API-only，但你可以使用这些 API 创建自定义前端：

### React 前端示例

```tsx
// components/DashboardChart.tsx
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

export function DashboardChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/coverage-history')
      .then(res => res.json())
      .then(setData)
  }, [])

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Lines',
        data: data.map(d => d.lines_percentage),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Functions',
        data: data.map(d => d.functions_percentage),
        borderColor: 'rgb(255, 99, 132)',
      },
    ],
  }

  return <Line data={chartData} />
}
```

### Vue 前端示例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const testRuns = ref([])

onMounted(async () => {
  const response = await fetch('http://localhost:3000/api/test-runs')
  testRuns.value = await response.json()
})
</script>

<template>
  <div class="dashboard">
    <h1>测试历史</h1>
    <table>
      <thead>
        <tr>
          <th>时间</th>
          <th>总测试数</th>
          <th>通过</th>
          <th>失败</th>
          <th>通过率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="run in testRuns" :key="run.id">
          <td>{{ new Date(run.timestamp).toLocaleString() }}</td>
          <td>{{ run.totalTests }}</td>
          <td>{{ run.passedTests }}</td>
          <td>{{ run.failedTests }}</td>
          <td>{{ ((run.passedTests / run.totalTests) * 100).toFixed(2) }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

## 配置选项

```typescript
interface DashboardConfig {
  /** 端口号 */
  port?: number
  
  /** 数据库路径 */
  dbPath?: string
  
  /** 是否自动打开浏览器 */
  open?: boolean
}
```

## 完整示例

```typescript
import {
  createDashboardServer,
  createTestDatabase,
} from '@ldesign/tester'

// 创建数据库
const db = createTestDatabase('./test-history.db')

// 保存测试结果
const results = [
  { name: 'test1', passed: true, duration: 100, timestamp: Date.now() },
  { name: 'test2', passed: true, duration: 150, timestamp: Date.now() },
]

const coverage = {
  totalLines: 1000,
  coveredLines: 850,
  totalBranches: 200,
  coveredBranches: 160,
  totalFunctions: 100,
  coveredFunctions: 85,
  totalStatements: 1200,
  coveredStatements: 1000,
}

db.saveTestRun(results, coverage)

// 启动 Dashboard
const dashboard = createDashboardServer({ port: 3000 })
await dashboard.start()

// Dashboard 现在运行在 http://localhost:3000
```

## 下一步

- [性能测试](/guide/performance)
- [视觉回归](/guide/visual-regression)
- [Dashboard API](/api/dashboard)



