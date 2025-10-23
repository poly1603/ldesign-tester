/**
 * 覆盖率报告器
 */
import type { CoverageData, CoverageThresholds } from '../types/index.js'

export class CoverageReporter {
  /**
   * 解析覆盖率数据
   */
  parseCoverage(coverageJson: any): CoverageData {
    const totals = coverageJson.total || {}

    return {
      totalLines: totals.lines?.total || 0,
      coveredLines: totals.lines?.covered || 0,
      totalBranches: totals.branches?.total || 0,
      coveredBranches: totals.branches?.covered || 0,
      totalFunctions: totals.functions?.total || 0,
      coveredFunctions: totals.functions?.covered || 0,
      totalStatements: totals.statements?.total || 0,
      coveredStatements: totals.statements?.covered || 0,
      files: this.parseFileCoverage(coverageJson),
    }
  }

  /**
   * 解析文件覆盖率
   */
  private parseFileCoverage(coverageJson: any): Record<string, any> {
    const files: Record<string, any> = {}

    for (const [path, data] of Object.entries(coverageJson as Record<string, any>)) {
      if (path === 'total')
        continue

      const fileData = data as any
      files[path] = {
        path,
        lines: {
          total: fileData.lines?.total || 0,
          covered: fileData.lines?.covered || 0,
          percentage: fileData.lines?.pct || 0,
        },
        branches: {
          total: fileData.branches?.total || 0,
          covered: fileData.branches?.covered || 0,
          percentage: fileData.branches?.pct || 0,
        },
        functions: {
          total: fileData.functions?.total || 0,
          covered: fileData.functions?.covered || 0,
          percentage: fileData.functions?.pct || 0,
        },
        statements: {
          total: fileData.statements?.total || 0,
          covered: fileData.statements?.covered || 0,
          percentage: fileData.statements?.pct || 0,
        },
        uncoveredLines: this.getUncoveredLines(fileData),
      }
    }

    return files
  }

  /**
   * 获取未覆盖行
   */
  private getUncoveredLines(fileData: any): number[] {
    const uncovered: number[] = []
    const lineCoverage = fileData.s || {}

    for (const [line, hits] of Object.entries(lineCoverage)) {
      if (hits === 0) {
        uncovered.push(Number.parseInt(line))
      }
    }

    return uncovered
  }

  /**
   * 检查是否达到阈值
   */
  checkThresholds(coverage: CoverageData, thresholds: CoverageThresholds): {
    passed: boolean
    failures: string[]
  } {
    const failures: string[] = []
    const global = thresholds.global || {}

    if (global.lines && coverage.totalLines > 0) {
      const pct = (coverage.coveredLines / coverage.totalLines) * 100
      if (pct < global.lines) {
        failures.push(`Lines coverage ${pct.toFixed(2)}% is below threshold ${global.lines}%`)
      }
    }

    if (global.branches && coverage.totalBranches > 0) {
      const pct = (coverage.coveredBranches / coverage.totalBranches) * 100
      if (pct < global.branches) {
        failures.push(`Branches coverage ${pct.toFixed(2)}% is below threshold ${global.branches}%`)
      }
    }

    if (global.functions && coverage.totalFunctions > 0) {
      const pct = (coverage.coveredFunctions / coverage.totalFunctions) * 100
      if (pct < global.functions) {
        failures.push(`Functions coverage ${pct.toFixed(2)}% is below threshold ${global.functions}%`)
      }
    }

    if (global.statements && coverage.totalStatements > 0) {
      const pct = (coverage.coveredStatements / coverage.totalStatements) * 100
      if (pct < global.statements) {
        failures.push(`Statements coverage ${pct.toFixed(2)}% is below threshold ${global.statements}%`)
      }
    }

    return {
      passed: failures.length === 0,
      failures,
    }
  }
}

export function createCoverageReporter(): CoverageReporter {
  return new CoverageReporter()
}



