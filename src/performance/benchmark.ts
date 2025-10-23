/**
 * 基准测试 - 使用 tinybench
 */
import { Bench } from 'tinybench'
import type { PerformanceResult } from '../types/index.js'

/**
 * 基准测试选项
 */
export interface BenchmarkOptions {
  /** 测试名称 */
  name: string
  /** 测试函数 */
  fn: () => void | Promise<void>
  /** 迭代次数 */
  iterations?: number
  /** 预热次数 */
  warmup?: number
  /** 是否异步 */
  async?: boolean
}

/**
 * 基准测试器类
 */
export class BenchmarkTester {
  private bench: Bench

  constructor() {
    this.bench = new Bench({
      time: 1000, // 运行时间（毫秒）
      iterations: 10, // 迭代次数
      warmupIterations: 5, // 预热迭代
    })
  }

  /**
   * 添加测试
   * @param options 测试选项
   */
  add(options: BenchmarkOptions): this {
    const { name, fn } = options

    this.bench.add(name, fn)

    return this
  }

  /**
   * 添加多个测试
   * @param tests 测试列表
   */
  addMany(tests: BenchmarkOptions[]): this {
    tests.forEach(test => this.add(test))
    return this
  }

  /**
   * 运行基准测试
   * @returns 测试结果
   */
  async run(): Promise<PerformanceResult[]> {
    await this.bench.run()

    const results: PerformanceResult[] = []

    for (const task of this.bench.tasks) {
      if (task.result) {
        results.push({
          name: task.name,
          opsPerSecond: task.result.hz || 0,
          averageTime: task.result.mean || 0,
          minTime: task.result.min || 0,
          maxTime: task.result.max || 0,
        })
      }
    }

    return results
  }

  /**
   * 运行单个基准测试
   * @param fn 测试函数
   * @param iterations 迭代次数
   * @returns 测试结果
   */
  async runBenchmark(fn: () => void | Promise<void>, iterations = 1000): Promise<PerformanceResult> {
    const startTime = performance.now()
    const times: number[] = []

    // 预热
    for (let i = 0; i < 10; i++) {
      await fn()
    }

    // 实际测试
    for (let i = 0; i < iterations; i++) {
      const iterStartTime = performance.now()
      await fn()
      const iterEndTime = performance.now()
      times.push(iterEndTime - iterStartTime)
    }

    const endTime = performance.now()
    const totalTime = endTime - startTime

    const averageTime = times.reduce((a, b) => a + b, 0) / times.length
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)
    const opsPerSecond = 1000 / averageTime

    return {
      name: 'Benchmark',
      opsPerSecond,
      averageTime,
      minTime,
      maxTime,
    }
  }

  /**
   * 对比两个函数的性能
   * @param fn1 函数1
   * @param fn2 函数2
   * @param name1 函数1名称
   * @param name2 函数2名称
   * @returns 对比结果
   */
  async compare(
    fn1: () => void | Promise<void>,
    fn2: () => void | Promise<void>,
    name1 = 'Function 1',
    name2 = 'Function 2',
  ): Promise<{
    result1: PerformanceResult
    result2: PerformanceResult
    fasterBy: number
    winner: string
  }> {
    const bench = new Bench()

    bench
      .add(name1, fn1)
      .add(name2, fn2)

    await bench.run()

    const tasks = Array.from(bench.tasks)
    const result1 = tasks[0].result
    const result2 = tasks[1].result

    if (!result1 || !result2) {
      throw new Error('基准测试失败')
    }

    const hz1 = result1.hz || 0
    const hz2 = result2.hz || 0

    const fasterBy = hz1 > hz2 ? hz1 / hz2 : hz2 / hz1
    const winner = hz1 > hz2 ? name1 : name2

    return {
      result1: {
        name: name1,
        opsPerSecond: hz1,
        averageTime: result1.mean || 0,
        minTime: result1.min || 0,
        maxTime: result1.max || 0,
      },
      result2: {
        name: name2,
        opsPerSecond: hz2,
        averageTime: result2.mean || 0,
        minTime: result2.min || 0,
        maxTime: result2.max || 0,
      },
      fasterBy,
      winner,
    }
  }

  /**
   * 格式化输出结果
   * @param results 测试结果
   */
  formatResults(results: PerformanceResult[]): string {
    let output = '\n📊 基准测试结果\n'
    output += '━'.repeat(80) + '\n\n'

    results.forEach((result, index) => {
      output += `${index + 1}. ${result.name}\n`
      output += `   ⚡ Ops/sec: ${result.opsPerSecond.toFixed(2)}\n`
      output += `   ⏱️  平均耗时: ${result.averageTime.toFixed(4)}ms\n`
      output += `   ⬇️  最小耗时: ${result.minTime.toFixed(4)}ms\n`
      output += `   ⬆️  最大耗时: ${result.maxTime.toFixed(4)}ms\n\n`
    })

    output += '━'.repeat(80) + '\n'

    return output
  }
}

/**
 * 创建基准测试器实例
 */
export function createBenchmarkTester(): BenchmarkTester {
  return new BenchmarkTester()
}


