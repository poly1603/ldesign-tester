/**
 * 报告生成器 - 生成测试报告和覆盖率报告
 */
import type { CoverageData, TestResult } from '../types/index.js'
import { createTemplateEngine } from './template-engine.js'

export class ReportGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成 HTML 测试报告
   * @param results 测试结果数组
   * @returns HTML 报告内容
   */
  generateHTMLReport(results: TestResult[]): string {
    const totalTests = results.length
    const passedTests = results.filter(r => r.passed).length
    const failedTests = totalTests - passedTests
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00'
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

    const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试报告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 30px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .stat { padding: 20px; border-radius: 6px; text-align: center; }
    .stat.total { background: #e3f2fd; color: #1976d2; }
    .stat.passed { background: #e8f5e9; color: #388e3c; }
    .stat.failed { background: #ffebee; color: #d32f2f; }
    .stat.rate { background: #f3e5f5; color: #7b1fa2; }
    .stat-value { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
    .stat-label { font-size: 14px; opacity: 0.8; }
    .test-list { margin-top: 30px; }
    .test-item { padding: 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid; }
    .test-item.passed { background: #f1f8f4; border-color: #4caf50; }
    .test-item.failed { background: #fef5f5; border-color: #f44336; }
    .test-name { font-weight: 500; margin-bottom: 5px; }
    .test-meta { font-size: 12px; color: #666; }
    .test-error { margin-top: 10px; padding: 10px; background: #fff; border-radius: 4px; font-family: monospace; font-size: 12px; color: #d32f2f; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 测试报告</h1>
    <div class="summary">
      <div class="stat total">
        <div class="stat-value">${totalTests}</div>
        <div class="stat-label">总测试数</div>
      </div>
      <div class="stat passed">
        <div class="stat-value">${passedTests}</div>
        <div class="stat-label">通过</div>
      </div>
      <div class="stat failed">
        <div class="stat-value">${failedTests}</div>
        <div class="stat-label">失败</div>
      </div>
      <div class="stat rate">
        <div class="stat-value">${passRate}%</div>
        <div class="stat-label">通过率</div>
      </div>
    </div>
    <div>
      <strong>总耗时:</strong> ${totalDuration.toFixed(2)}ms
    </div>
    <div class="test-list">
      <h2>测试详情</h2>
      ${results.map(r => `
        <div class="test-item ${r.passed ? 'passed' : 'failed'}">
          <div class="test-name">${r.passed ? '✅' : '❌'} ${r.name}</div>
          <div class="test-meta">
            耗时: ${r.duration.toFixed(2)}ms | 
            时间: ${new Date(r.timestamp).toLocaleString('zh-CN')}
          </div>
          ${r.error ? `<div class="test-error">${this.escapeHtml(r.error)}</div>` : ''}
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`

    return template
  }

  /**
   * 生成覆盖率 HTML 报告
   * @param coverage 覆盖率数据
   * @returns HTML 报告内容
   */
  generateCoverageHTML(coverage: CoverageData): string {
    const linePercentage = coverage.totalLines > 0
      ? ((coverage.coveredLines / coverage.totalLines) * 100).toFixed(2)
      : '0.00'
    const branchPercentage = coverage.totalBranches > 0
      ? ((coverage.coveredBranches / coverage.totalBranches) * 100).toFixed(2)
      : '0.00'
    const functionPercentage = coverage.totalFunctions > 0
      ? ((coverage.coveredFunctions / coverage.totalFunctions) * 100).toFixed(2)
      : '0.00'
    const statementPercentage = coverage.totalStatements > 0
      ? ((coverage.coveredStatements / coverage.totalStatements) * 100).toFixed(2)
      : '0.00'

    const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>覆盖率报告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 30px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .coverage-item { padding: 20px; border-radius: 6px; background: #f9f9f9; }
    .coverage-label { font-size: 14px; color: #666; margin-bottom: 10px; }
    .progress-bar { width: 100%; height: 24px; background: #e0e0e0; border-radius: 12px; overflow: hidden; position: relative; }
    .progress-fill { height: 100%; transition: width 0.3s ease; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; }
    .progress-fill.high { background: linear-gradient(90deg, #4caf50, #66bb6a); }
    .progress-fill.medium { background: linear-gradient(90deg, #ff9800, #ffa726); }
    .progress-fill.low { background: linear-gradient(90deg, #f44336, #ef5350); }
    .file-list { margin-top: 30px; }
    .file-item { padding: 15px; margin-bottom: 10px; border-radius: 6px; background: #f9f9f9; }
    .file-name { font-weight: 500; margin-bottom: 10px; }
    .file-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 覆盖率报告</h1>
    <div class="summary">
      ${this.renderCoverageItem('Lines', linePercentage, coverage.coveredLines, coverage.totalLines)}
      ${this.renderCoverageItem('Branches', branchPercentage, coverage.coveredBranches, coverage.totalBranches)}
      ${this.renderCoverageItem('Functions', functionPercentage, coverage.coveredFunctions, coverage.totalFunctions)}
      ${this.renderCoverageItem('Statements', statementPercentage, coverage.coveredStatements, coverage.totalStatements)}
    </div>
    ${coverage.files ? `
      <div class="file-list">
        <h2>文件覆盖率</h2>
        ${Object.entries(coverage.files).map(([path, fileCov]) => `
          <div class="file-item">
            <div class="file-name">📄 ${path}</div>
            <div class="file-stats">
              <div>Lines: ${fileCov.lines.percentage.toFixed(2)}%</div>
              <div>Branches: ${fileCov.branches.percentage.toFixed(2)}%</div>
              <div>Functions: ${fileCov.functions.percentage.toFixed(2)}%</div>
              <div>Statements: ${fileCov.statements.percentage.toFixed(2)}%</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  </div>
</body>
</html>`

    return template
  }

  /**
   * 渲染覆盖率项
   */
  private renderCoverageItem(label: string, percentage: string, covered: number, total: number): string {
    const percent = Number.parseFloat(percentage)
    const level = percent >= 80 ? 'high' : percent >= 60 ? 'medium' : 'low'

    return `
      <div class="coverage-item">
        <div class="coverage-label">${label}</div>
        <div class="progress-bar">
          <div class="progress-fill ${level}" style="width: ${percentage}%">
            ${percentage}%
          </div>
        </div>
        <div style="margin-top: 8px; font-size: 12px; color: #666;">
          ${covered} / ${total}
        </div>
      </div>
    `
  }

  /**
   * 生成控制台覆盖率报告
   * @param coverage 覆盖率数据
   * @returns 控制台输出字符串
   */
  generateConsoleReport(coverage: CoverageData): string {
    const linePercentage = coverage.totalLines > 0
      ? ((coverage.coveredLines / coverage.totalLines) * 100).toFixed(2)
      : '0.00'
    const branchPercentage = coverage.totalBranches > 0
      ? ((coverage.coveredBranches / coverage.totalBranches) * 100).toFixed(2)
      : '0.00'
    const functionPercentage = coverage.totalFunctions > 0
      ? ((coverage.coveredFunctions / coverage.totalFunctions) * 100).toFixed(2)
      : '0.00'
    const statementPercentage = coverage.totalStatements > 0
      ? ((coverage.coveredStatements / coverage.totalStatements) * 100).toFixed(2)
      : '0.00'

    return `
┌─────────────────────────────────────────────────────────────┐
│                     📊 覆盖率报告                           │
├─────────────────────────────────────────────────────────────┤
│ Lines      : ${linePercentage.padStart(6)}% (${coverage.coveredLines}/${coverage.totalLines})${' '.repeat(20)}│
│ Branches   : ${branchPercentage.padStart(6)}% (${coverage.coveredBranches}/${coverage.totalBranches})${' '.repeat(20)}│
│ Functions  : ${functionPercentage.padStart(6)}% (${coverage.coveredFunctions}/${coverage.totalFunctions})${' '.repeat(20)}│
│ Statements : ${statementPercentage.padStart(6)}% (${coverage.coveredStatements}/${coverage.totalStatements})${' '.repeat(20)}│
└─────────────────────────────────────────────────────────────┘
`.trim()
  }

  /**
   * 转义 HTML 特殊字符
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;',
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }
}

/**
 * 创建报告生成器实例
 */
export function createReportGenerator(): ReportGenerator {
  return new ReportGenerator()
}




