# 性能测试

@ldesign/tester 提供完整的性能测试工具，包括基准测试、压力测试和 Lighthouse 集成。

## 基准测试

基准测试用于比较不同实现的性能。

### 基本使用

```typescript
import { createBenchmarkTester } from '@ldesign/tester'

const tester = createBenchmarkTester()

// 添加测试
tester
  .add({
    name: 'Array.forEach',
    fn: () => {
      const arr = [1, 2, 3, 4, 5]
      arr.forEach(n => n * 2)
    },
  })
  .add({
    name: 'for loop',
    fn: () => {
      const arr = [1, 2, 3, 4, 5]
      for (let i = 0; i < arr.length; i++) {
        arr[i] * 2
      }
    },
  })

// 运行测试
const results = await tester.run()

// 输出结果
console.log(tester.formatResults(results))
```

输出结果：

```
📊 基准测试结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Array.forEach
   ⚡ Ops/sec: 1,234,567.89
   ⏱️  平均耗时: 0.0008ms
   ⬇️  最小耗时: 0.0006ms
   ⬆️  最大耗时: 0.0012ms

2. for loop
   ⚡ Ops/sec: 2,345,678.90
   ⏱️  平均耗时: 0.0004ms
   ⬇️  最小耗时: 0.0003ms
   ⬆️  最大耗时: 0.0006ms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 对比测试

```typescript
const tester = createBenchmarkTester()

const result = await tester.compare(
  () => {
    // 实现 A
    const arr = [1, 2, 3, 4, 5]
    return arr.map(n => n * 2)
  },
  () => {
    // 实现 B
    const arr = [1, 2, 3, 4, 5]
    const result = []
    for (let i = 0; i < arr.length; i++) {
      result.push(arr[i] * 2)
    }
    return result
  },
  'Array.map',
  'for loop',
)

console.log(`Winner: ${result.winner}`)
console.log(`Faster by: ${result.fasterBy.toFixed(2)}x`)
```

### 单个函数测试

```typescript
const result = await tester.runBenchmark(
  () => {
    // 测试函数
    JSON.parse(JSON.stringify({ a: 1, b: 2 }))
  },
  1000, // 迭代次数
)

console.log(`平均耗时: ${result.averageTime.toFixed(4)}ms`)
console.log(`Ops/sec: ${result.opsPerSecond.toFixed(2)}`)
```

## 压力测试

压力测试用于测试 HTTP 服务的性能。

### 基本使用

```typescript
import { createLoadTester } from '@ldesign/tester'

const tester = createLoadTester()

const result = await tester.runLoadTest({
  url: 'http://localhost:3000/api/users',
  connections: 100,      // 并发连接数
  duration: 30,          // 持续时间（秒）
  method: 'GET',
  headers: {
    'Authorization': 'Bearer token',
  },
})

console.log(tester.formatResult(result))
```

输出结果：

```
🔥 压力测试结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

URL: http://localhost:3000/api/users

📊 统计信息:
   总请求数: 15000
   总耗时: 30.00s
   吞吐量: 500.00 req/s
   成功率: 99.95%
   错误数: 8

⏱️  延迟 (ms):
   平均: 50.23
   p50: 45.00
   p90: 75.00
   p99: 120.00
   最大: 250.00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### POST 请求测试

```typescript
const result = await tester.runLoadTest({
  url: 'http://localhost:3000/api/users',
  connections: 50,
  duration: 10,
  method: 'POST',
  body: {
    name: 'Test User',
    email: 'test@example.com',
  },
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 自定义请求数量

```typescript
const result = await tester.runLoadTest({
  url: 'http://localhost:3000/api/users',
  connections: 10,
  amount: 1000, // 总请求数
})
```

## Lighthouse 测试

Lighthouse 用于 Web 性能分析。

### 基本使用

```typescript
import { createLighthouseTester } from '@ldesign/tester'

const tester = createLighthouseTester()

const result = await tester.runLighthouse({
  url: 'https://example.com',
  formFactor: 'mobile',
  throttling: true,
})

console.log(tester.formatResult(result))
```

输出结果：

```
🔦 Lighthouse 测试结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

URL: https://example.com

📊 得分:
   🟢 性能: 95/100
   🟢 可访问性: 100/100
   🟢 最佳实践: 92/100
   🟢 SEO: 100/100
   🟡 PWA: 67/100

⏱️  核心指标:
   FCP: 1.2s
   LCP: 2.1s
   TBT: 150ms
   CLS: 0.05
   Speed Index: 1.8s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 桌面模式

```typescript
const result = await tester.runLighthouse({
  url: 'https://example.com',
  formFactor: 'desktop',
  throttling: false, // 不限速
})
```

### 仅运行特定类别

```typescript
const result = await tester.runLighthouse({
  url: 'https://example.com',
  onlyCategories: ['performance', 'accessibility'],
})
```

## 性能回归检测

### 监控性能趋势

```typescript
import { createBenchmarkTester } from '@ldesign/tester'
import fs from 'node:fs'

const tester = createBenchmarkTester()

// 运行基准测试
const results = await tester.run()

// 保存结果
const history = JSON.parse(fs.readFileSync('benchmark-history.json', 'utf-8'))
history.push({
  timestamp: Date.now(),
  results,
})

fs.writeFileSync('benchmark-history.json', JSON.stringify(history, null, 2))

// 检查回归
const previous = history[history.length - 2]
const current = history[history.length - 1]

if (current.results[0].opsPerSecond < previous.results[0].opsPerSecond * 0.9) {
  console.error('⚠️ 性能回归检测：性能下降超过 10%')
  process.exit(1)
}
```

## 集成到 CI/CD

### GitHub Actions

```yaml
name: Performance Test

on:
  push:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run benchmark tests
        run: npm run test:benchmark
      
      - name: Run load tests
        run: npm run test:load
      
      - name: Run Lighthouse
        run: npm run test:lighthouse
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: performance-results/
```

### package.json

```json
{
  "scripts": {
    "test:benchmark": "node tests/benchmark.js",
    "test:load": "node tests/load-test.js",
    "test:lighthouse": "node tests/lighthouse.js"
  }
}
```

## 最佳实践

### 1. 预热

在基准测试前进行预热：

```typescript
// 预热
for (let i = 0; i < 100; i++) {
  myFunction()
}

// 开始测试
const result = await tester.runBenchmark(myFunction, 10000)
```

### 2. 稳定环境

- 关闭其他应用
- 使用相同的硬件
- 多次运行取平均值

### 3. 合理的阈值

设置性能回归阈值：

```typescript
const PERFORMANCE_THRESHOLD = 0.9 // 允许下降 10%

if (current.opsPerSecond < previous.opsPerSecond * PERFORMANCE_THRESHOLD) {
  console.error('性能回归')
  process.exit(1)
}
```

## 下一步

- [视觉回归](/guide/visual-regression)
- [Dashboard](/guide/dashboard)
- [性能测试 API](/api/performance)



