/**
 * 测试数据库 - 使用 better-sqlite3 存储测试历史
 */
import Database from 'better-sqlite3'
import type { CoverageData, TestResult } from '../types/index.js'
import { DashboardError } from '../errors/index.js'

/**
 * 测试运行记录
 */
export interface TestRun {
  id: string
  timestamp: number
  totalTests: number
  passedTests: number
  failedTests: number
  passRate: number
  duration: number
  coverage?: CoverageData
}

/**
 * 测试数据库类
 */
export class TestDatabase {
  private db: Database.Database

  /**
   * 创建测试数据库
   * @param dbPath 数据库文件路径
   */
  constructor(dbPath = './test-history.db') {
    try {
      this.db = new Database(dbPath)
      this.initDatabase()
    }
    catch (err) {
      throw new DashboardError('数据库初始化失败', {
        path: dbPath,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 初始化数据库表结构
   */
  private initDatabase(): void {
    // 创建测试运行表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS test_runs (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        total_tests INTEGER NOT NULL,
        passed_tests INTEGER NOT NULL,
        failed_tests INTEGER NOT NULL,
        pass_rate REAL NOT NULL,
        duration REAL NOT NULL,
        coverage_data TEXT
      )
    `)

    // 创建测试结果表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        name TEXT NOT NULL,
        passed INTEGER NOT NULL,
        error TEXT,
        duration REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (run_id) REFERENCES test_runs(id)
      )
    `)

    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_test_runs_timestamp 
      ON test_runs(timestamp DESC)
    `)

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_test_results_run_id 
      ON test_results(run_id)
    `)
  }

  /**
   * 保存测试运行结果
   * @param results 测试结果数组
   * @param coverage 覆盖率数据
   * @returns 运行 ID
   */
  saveTestRun(results: TestResult[], coverage?: CoverageData): string {
    const runId = `run-${Date.now()}`
    const timestamp = Date.now()
    const totalTests = results.length
    const passedTests = results.filter(r => r.passed).length
    const failedTests = totalTests - passedTests
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0
    const duration = results.reduce((sum, r) => sum + r.duration, 0)

    try {
      // 使用事务保存数据
      const transaction = this.db.transaction(() => {
        // 保存测试运行记录
        const insertRun = this.db.prepare(`
          INSERT INTO test_runs 
          (id, timestamp, total_tests, passed_tests, failed_tests, pass_rate, duration, coverage_data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)

        insertRun.run(
          runId,
          timestamp,
          totalTests,
          passedTests,
          failedTests,
          passRate,
          duration,
          coverage ? JSON.stringify(coverage) : null,
        )

        // 保存每个测试结果
        const insertResult = this.db.prepare(`
          INSERT INTO test_results 
          (run_id, name, passed, error, duration, timestamp)
          VALUES (?, ?, ?, ?, ?, ?)
        `)

        for (const result of results) {
          insertResult.run(
            runId,
            result.name,
            result.passed ? 1 : 0,
            result.error || null,
            result.duration,
            result.timestamp,
          )
        }
      })

      transaction()
      console.log(`💾 保存测试运行: ${runId}`)
      return runId
    }
    catch (err) {
      throw new DashboardError('保存测试运行失败', {
        runId,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 获取测试历史
   * @param limit 返回数量限制
   * @returns 测试运行记录数组
   */
  getHistory(limit = 10): TestRun[] {
    try {
      const query = this.db.prepare(`
        SELECT * FROM test_runs 
        ORDER BY timestamp DESC 
        LIMIT ?
      `)

      const rows = query.all(limit) as any[]

      return rows.map(row => ({
        id: row.id,
        timestamp: row.timestamp,
        totalTests: row.total_tests,
        passedTests: row.passed_tests,
        failedTests: row.failed_tests,
        passRate: row.pass_rate,
        duration: row.duration,
        coverage: row.coverage_data ? JSON.parse(row.coverage_data) : undefined,
      }))
    }
    catch (err) {
      throw new DashboardError('获取测试历史失败', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 获取单个测试运行的详细信息
   * @param runId 运行 ID
   * @returns 测试运行详情
   */
  getTestRun(runId: string): TestRun | null {
    try {
      const query = this.db.prepare('SELECT * FROM test_runs WHERE id = ?')
      const row = query.get(runId) as any

      if (!row) {
        return null
      }

      return {
        id: row.id,
        timestamp: row.timestamp,
        totalTests: row.total_tests,
        passedTests: row.passed_tests,
        failedTests: row.failed_tests,
        passRate: row.pass_rate,
        duration: row.duration,
        coverage: row.coverage_data ? JSON.parse(row.coverage_data) : undefined,
      }
    }
    catch (err) {
      throw new DashboardError('获取测试运行失败', {
        runId,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 获取测试运行的详细结果
   * @param runId 运行 ID
   * @returns 测试结果数组
   */
  getTestResults(runId: string): TestResult[] {
    try {
      const query = this.db.prepare(`
        SELECT * FROM test_results 
        WHERE run_id = ? 
        ORDER BY timestamp ASC
      `)

      const rows = query.all(runId) as any[]

      return rows.map(row => ({
        name: row.name,
        passed: row.passed === 1,
        error: row.error,
        duration: row.duration,
        timestamp: row.timestamp,
      }))
    }
    catch (err) {
      throw new DashboardError('获取测试结果失败', {
        runId,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 获取统计信息
   * @returns 统计信息
   */
  getStatistics(): {
    totalRuns: number
    averagePassRate: number
    totalTests: number
    recentTrend: 'up' | 'down' | 'stable'
  } {
    try {
      const totalRunsQuery = this.db.prepare('SELECT COUNT(*) as count FROM test_runs')
      const totalRuns = (totalRunsQuery.get() as any).count

      const avgPassRateQuery = this.db.prepare('SELECT AVG(pass_rate) as avg FROM test_runs')
      const averagePassRate = (avgPassRateQuery.get() as any).avg || 0

      const totalTestsQuery = this.db.prepare('SELECT SUM(total_tests) as total FROM test_runs')
      const totalTests = (totalTestsQuery.get() as any).total || 0

      // 计算趋势
      const recentQuery = this.db.prepare(`
        SELECT pass_rate FROM test_runs 
        ORDER BY timestamp DESC 
        LIMIT 5
      `)
      const recentRuns = recentQuery.all() as any[]

      let recentTrend: 'up' | 'down' | 'stable' = 'stable'
      if (recentRuns.length >= 2) {
        const latest = recentRuns[0].pass_rate
        const previous = recentRuns[1].pass_rate
        if (latest > previous) {
          recentTrend = 'up'
        }
        else if (latest < previous) {
          recentTrend = 'down'
        }
      }

      return {
        totalRuns,
        averagePassRate,
        totalTests,
        recentTrend,
      }
    }
    catch (err) {
      throw new DashboardError('获取统计信息失败', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 清空历史记录
   */
  clear(): void {
    try {
      this.db.exec('DELETE FROM test_results')
      this.db.exec('DELETE FROM test_runs')
      console.log('🗑️  清空测试历史')
    }
    catch (err) {
      throw new DashboardError('清空历史失败', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    try {
      this.db.close()
    }
    catch (err) {
      throw new DashboardError('关闭数据库失败', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
}

/**
 * 创建测试数据库实例
 * @param dbPath 数据库文件路径
 * @returns 测试数据库实例
 */
export function createTestDatabase(dbPath?: string): TestDatabase {
  return new TestDatabase(dbPath)
}



