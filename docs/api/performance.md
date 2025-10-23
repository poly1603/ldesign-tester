# Performance API

性能测试工具 API 文档。

## BenchmarkTester

基准测试器，用于性能基准测试。

### 创建实例

```typescript
import { createBenchmarkTester } from '@ldesign/tester'

const tester = createBenchmarkTester()
```

### add

添加测试用例。

**签名：**

```typescript
add(options: BenchmarkOptions): this
```

**参数：**

```typescript
interface BenchmarkOptions {
  name: string
  fn: () => void | Promise<void>
  iterations?: number
  warmup?: number
  async?: boolean
}
```

**示例：**

```typescript
tester.add({
  name: 'String concatenation',
  fn: () => {
    let str = ''
    for (let i = 0; i < 100; i++) {
      str += 'a'
    }
  },
})
```

### addMany

批量添加测试。

**签名：**

```typescript
addMany(tests: BenchmarkOptions[]): this
```

### run

运行所有基准测试。

**签名：**

```typescript
run(): Promise<PerformanceResult[]>
```

**返回值：**

```typescript
interface PerformanceResult {
  name: string
  opsPerSecond: number
  averageTime: number
  minTime: number
  maxTime: number
}
```

### compare

对比两个函数的性能。

**签名：**

```typescript
compare(
  fn1: () => void | Promise<void>,
  fn2: () => void | Promise<void>,
  name1?: string,
  name2?: string
): Promise<{
  result1: PerformanceResult
  result2: PerformanceResult
  fasterBy: number
  winner: string
}>
```

**示例：**

```typescript
const result = await tester.compare(
  () => Array(1000).fill(0).map((_, i) => i),
  () => {
    const arr = []
    for (let i = 0; i < 1000; i++) {
      arr.push(i)
    }
    return arr
  },
  'Array.map',
  'for loop',
)

console.log(`Winner: ${result.winner}`)
console.log(`Faster by: ${result.fasterBy.toFixed(2)}x`)
```

## LoadTester

压力测试器，用于 HTTP 负载测试。

### 创建实例

```typescript
import { createLoadTester } from '@ldesign/tester'

const tester = createLoadTester()
```

### runLoadTest

运行压力测试。

**签名：**

```typescript
runLoadTest(options: LoadTestOptions): Promise<LoadTestResult>
```

**参数：**

```typescript
interface LoadTestOptions {
  url: string
  connections?: number
  duration?: number
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}
```

**返回值：**

```typescript
interface LoadTestResult {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageLatency: number
  minLatency: number
  maxLatency: number
  requestsPerSecond: number
  transactionsPerSecond: number
}
```

**示例：**

```typescript
const result = await tester.runLoadTest({
  url: 'http://localhost:3000/api/users',
  connections: 100,
  duration: 30,
  method: 'GET',
  headers: {
    'Authorization': 'Bearer token',
  },
})

console.log(tester.formatResult(result))
```

## LighthouseTester

Lighthouse 测试器，用于 Web 性能分析。

### 创建实例

```typescript
import { createLighthouseTester } from '@ldesign/tester'

const tester = createLighthouseTester()
```

### runLighthouse

运行 Lighthouse 测试。

**签名：**

```typescript
runLighthouse(options: LighthouseOptions): Promise<LighthouseResult>
```

**参数：**

```typescript
interface LighthouseOptions {
  url: string
  formFactor?: 'mobile' | 'desktop'
  throttling?: boolean
  onlyCategories?: string[]
}
```

**返回值：**

```typescript
interface LighthouseResult {
  url: string
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
  pwa?: number
  fcp: number
  lcp: number
  tbt: number
  cls: number
  speedIndex: number
}
```

**示例：**

```typescript
const result = await tester.runLighthouse({
  url: 'https://example.com',
  formFactor: 'mobile',
  throttling: true,
})

console.log(`性能得分: ${result.performance}`)
console.log(`FCP: ${result.fcp}ms`)
console.log(`LCP: ${result.lcp}ms`)
```

## 完整示例

```typescript
import {
  createBenchmarkTester,
  createLoadTester,
  createLighthouseTester,
} from '@ldesign/tester'

// 1. 基准测试
const benchmarkTester = createBenchmarkTester()

benchmarkTester
  .add({ name: 'Test 1', fn: () => { /* ... */ } })
  .add({ name: 'Test 2', fn: () => { /* ... */ } })

const benchResults = await benchmarkTester.run()
console.log(benchmarkTester.formatResults(benchResults))

// 2. 压力测试
const loadTester = createLoadTester()

const loadResult = await loadTester.runLoadTest({
  url: 'http://localhost:3000/api/users',
  connections: 100,
  duration: 30,
})

console.log(loadTester.formatResult(loadResult))

// 3. Lighthouse 测试
const lighthouse = createLighthouseTester()

const lighthouseResult = await lighthouse.runLighthouse({
  url: 'https://example.com',
  formFactor: 'mobile',
})

console.log(lighthouse.formatResult(lighthouseResult))
```

## 下一步

- [性能测试指南](/guide/performance)
- [视觉回归 API](/api/visual)



