/**
 * 数据库管理 - 使用 SQLite
 */
import Database from 'better-sqlite3'
import * as path from 'node:path'
import type { CoverageData, TestResult } from '../types/index.js'

/**
 * 测试运行记录
 */
export interface TestRun {
  id: number
  timestamp: number
  totalTests: number
  passedTests: number
  failedTests: number
  duration: number
  coverageData?: string // JSON 字符串
}

/**
 * 数据库类
 */
export class TestDatabase {
  private db: Database.Database

  constructor(dbPath = 'test-history.db') {
    this.db = new Database(dbPath)
    this.initialize()
  }

  /**
   * 初始化数据库表
   */
  private initialize(): void {
    // 创建测试运行表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS test_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        total_tests INTEGER NOT NULL,
        passed_tests INTEGER NOT NULL,
        failed_tests INTEGER NOT NULL,
        duration REAL NOT NULL,
        coverage_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建测试结果表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        passed INTEGER NOT NULL,
        error TEXT,
        duration REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (run_id) REFERENCES test_runs(id)
      )
    `)

    // 创建覆盖率表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS coverage_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id INTEGER NOT NULL,
        lines_percentage REAL NOT NULL,
        branches_percentage REAL NOT NULL,
        functions_percentage REAL NOT NULL,
        statements_percentage REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (run_id) REFERENCES test_runs(id)
      )
    `)
  }

  /**
   * 保存测试运行
   * @param results 测试结果
   * @param coverage 覆盖率数据
   * @returns 运行ID
   */
  saveTestRun(results: TestResult[], coverage?: CoverageData): number {
    const totalTests = results.length
    const passedTests = results.filter(r => r.passed).length
    const failedTests = totalTests - passedTests
    const duration = results.reduce((sum, r) => sum + r.duration, 0)
    const timestamp = Date.now()

    const stmt = this.db.prepare(`
      INSERT INTO test_runs (timestamp, total_tests, passed_tests, failed_tests, duration, coverage_data)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const info = stmt.run(
      timestamp,
      totalTests,
      passedTests,
      failedTests,
      duration,
      coverage ? JSON.stringify(coverage) : null,
    )

    const runId = info.lastInsertRowid as number

    // 保存测试结果
    const resultStmt = this.db.prepare(`
      INSERT INTO test_results (run_id, name, passed, error, duration, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    for (const result of results) {
      resultStmt.run(
        runId,
        result.name,
        result.passed ? 1 : 0,
        result.error || null,
        result.duration,
        result.timestamp,
      )
    }

    // 保存覆盖率历史
    if (coverage) {
      const linesPercentage = coverage.totalLines > 0
        ? (coverage.coveredLines / coverage.totalLines) * 100
        : 0
      const branchesPercentage = coverage.totalBranches > 0
        ? (coverage.coveredBranches / coverage.totalBranches) * 100
        : 0
      const functionsPercentage = coverage.totalFunctions > 0
        ? (coverage.coveredFunctions / coverage.totalFunctions) * 100
        : 0
      const statementsPercentage = coverage.totalStatements > 0
        ? (coverage.coveredStatements / coverage.totalStatements) * 100
        : 0

      const coverageStmt = this.db.prepare(`
        INSERT INTO coverage_history 
        (run_id, lines_percentage, branches_percentage, functions_percentage, statements_percentage, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      coverageStmt.run(
        runId,
        linesPercentage,
        branchesPercentage,
        functionsPercentage,
        statementsPercentage,
        timestamp,
      )
    }

    return runId
  }

  /**
   * 获取所有测试运行
   * @param limit 限制数量
   * @returns 测试运行列表
   */
  getTestRuns(limit = 50): TestRun[] {
    const stmt = this.db.prepare(`
      SELECT * FROM test_runs
      ORDER BY timestamp DESC
      LIMIT ?
    `)

    const rows = stmt.all(limit) as any[]

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      totalTests: row.total_tests,
      passedTests: row.passed_tests,
      failedTests: row.failed_tests,
      duration: row.duration,
      coverageData: row.coverage_data,
    }))
  }

  /**
   * 获取覆盖率历史
   * @param limit 限制数量
   * @returns 覆盖率历史
   */
  getCoverageHistory(limit = 30): any[] {
    const stmt = this.db.prepare(`
      SELECT * FROM coverage_history
      ORDER BY timestamp DESC
      LIMIT ?
    `)

    return stmt.all(limit) as any[]
  }

  /**
   * 获取失败的测试
   * @param limit 限制数量
   * @returns 失败测试列表
   */
  getFailedTests(limit = 20): any[] {
    const stmt = this.db.prepare(`
      SELECT tr.*, r.timestamp as run_timestamp
      FROM test_results tr
      JOIN test_runs r ON tr.run_id = r.id
      WHERE tr.passed = 0
      ORDER BY tr.timestamp DESC
      LIMIT ?
    `)

    return stmt.all(limit) as any[]
  }

  /**
   * 关闭数据库
   */
  close(): void {
    this.db.close()
  }
}

/**
 * 创建测试数据库实例
 */
export function createTestDatabase(dbPath?: string): TestDatabase {
  return new TestDatabase(dbPath)
}



