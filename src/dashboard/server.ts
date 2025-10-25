/**
 * Dashboard 服务器 - 使用 Express 提供测试历史可视化
 */
import express, { type Application } from 'express'
import type { Server } from 'node:http'
import type { DashboardConfig } from '../types/index.js'
import { createTestDatabase, type TestDatabase } from './database.js'
import { DashboardError } from '../errors/index.js'

/**
 * Dashboard 服务器类
 */
export class DashboardServer {
  private app: Application
  private server: Server | null = null
  private db: TestDatabase
  private config: Required<DashboardConfig>

  /**
   * 创建 Dashboard 服务器
   * @param config Dashboard 配置
   */
  constructor(config: DashboardConfig = {}) {
    this.config = {
      port: 3000,
      dbPath: './test-history.db',
      open: true,
      ...config,
    }

    this.db = createTestDatabase(this.config.dbPath)
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
  }

  /**
   * 设置中间件
   */
  private setupMiddleware(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    // CORS 支持
    this.app.use((_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      res.header('Access-Control-Allow-Headers', 'Content-Type')
      next()
    })
  }

  /**
   * 设置路由
   */
  private setupRoutes(): void {
    // API 路由
    this.app.get('/api/test-runs', (req, res) => {
      try {
        const limit = Number(req.query.limit) || 10
        const history = this.db.getHistory(limit)
        res.json(history)
      }
      catch (err) {
        res.status(500).json({
          error: '获取测试历史失败',
          message: err instanceof Error ? err.message : String(err),
        })
      }
    })

    this.app.get('/api/test-runs/:id', (req, res) => {
      try {
        const run = this.db.getTestRun(req.params.id)
        if (!run) {
          res.status(404).json({ error: '测试运行不存在' })
          return
        }
        res.json(run)
      }
      catch (err) {
        res.status(500).json({
          error: '获取测试运行失败',
          message: err instanceof Error ? err.message : String(err),
        })
      }
    })

    this.app.get('/api/test-runs/:id/results', (req, res) => {
      try {
        const results = this.db.getTestResults(req.params.id)
        res.json(results)
      }
      catch (err) {
        res.status(500).json({
          error: '获取测试结果失败',
          message: err instanceof Error ? err.message : String(err),
        })
      }
    })

    this.app.get('/api/statistics', (_req, res) => {
      try {
        const stats = this.db.getStatistics()
        res.json(stats)
      }
      catch (err) {
        res.status(500).json({
          error: '获取统计信息失败',
          message: err instanceof Error ? err.message : String(err),
        })
      }
    })

    // 首页
    this.app.get('/', (_req, res) => {
      res.send(this.generateDashboardHTML())
    })

    // 健康检查
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: Date.now() })
    })
  }

  /**
   * 启动 Dashboard 服务器
   */
  async start(): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        this.server = this.app.listen(this.config.port, () => {
          console.log(`🚀 Dashboard 启动在 http://localhost:${this.config.port}`)

          if (this.config.open) {
            this.openBrowser(`http://localhost:${this.config.port}`)
          }

          resolve()
        })

        this.server.on('error', (err: Error) => {
          reject(new DashboardError('服务器启动失败', {
            port: this.config.port,
            error: err.message,
          }))
        })
      })
    }
    catch (err) {
      throw new DashboardError('Dashboard 启动失败', {
        port: this.config.port,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 停止 Dashboard 服务器
   */
  async stop(): Promise<void> {
    try {
      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server!.close((err) => {
            if (err) {
              reject(new DashboardError('服务器关闭失败', {
                error: err.message,
              }))
            }
            else {
              console.log('⏹️  Dashboard 已停止')
              this.db.close()
              resolve()
            }
          })
        })
      }
    }
    catch (err) {
      throw new DashboardError('Dashboard 停止失败', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  /**
   * 在浏览器中打开 URL
   */
  private openBrowser(url: string): void {
    const start =
      process.platform === 'darwin'
        ? 'open'
        : process.platform === 'win32'
          ? 'start'
          : 'xdg-open'

    require('node:child_process').exec(`${start} ${url}`)
  }

  /**
   * 生成 Dashboard HTML
   */
  private generateDashboardHTML(): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试 Dashboard - LDesign Tester</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    h1 {
      color: #2d3748;
      font-size: 32px;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #718096;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .stat-card.blue::before { background: linear-gradient(90deg, #667eea, #764ba2); }
    .stat-card.green::before { background: linear-gradient(90deg, #48bb78, #38a169); }
    .stat-card.orange::before { background: linear-gradient(90deg, #ed8936, #dd6b20); }
    .stat-card.purple::before { background: linear-gradient(90deg, #9f7aea, #805ad5); }

    .stat-label {
      color: #718096;
      font-size: 14px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      color: #2d3748;
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .stat-trend {
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .stat-trend.up { color: #48bb78; }
    .stat-trend.down { color: #f56565; }
    .stat-trend.stable { color: #718096; }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }

    .chart-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .chart-title {
      color: #2d3748;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .history-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .history-item {
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .history-item:last-child {
      border-bottom: none;
    }

    .history-info {
      flex: 1;
    }

    .history-id {
      font-size: 14px;
      color: #4a5568;
      font-weight: 600;
    }

    .history-time {
      font-size: 12px;
      color: #a0aec0;
      margin-top: 4px;
    }

    .history-stats {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge.success {
      background: #c6f6d5;
      color: #22543d;
    }

    .badge.warning {
      background: #fef5e7;
      color: #975a16;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #718096;
    }

    .error {
      background: #fed7d7;
      color: #742a2a;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 测试 Dashboard</h1>
      <p class="subtitle">LDesign Tester - 测试历史与趋势分析</p>
    </div>

    <div id="stats" class="stats-grid">
      <div class="loading">正在加载统计数据...</div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h2 class="chart-title">📊 测试通过率趋势</h2>
        <canvas id="passRateChart"></canvas>
      </div>
      <div class="chart-card">
        <h2 class="chart-title">⏱️ 测试执行时间</h2>
        <canvas id="durationChart"></canvas>
      </div>
    </div>

    <div class="history-card">
      <h2 class="chart-title">📝 测试历史记录</h2>
      <div id="history">
        <div class="loading">正在加载历史记录...</div>
      </div>
    </div>
  </div>

  <script>
    // 获取统计数据
    async function loadStatistics() {
      try {
        const response = await fetch('/api/statistics')
        const stats = await response.json()
        
        const trendIcon = stats.recentTrend === 'up' ? '📈' : stats.recentTrend === 'down' ? '📉' : '➡️'
        const trendClass = stats.recentTrend
        
        document.getElementById('stats').innerHTML = \`
          <div class="stat-card blue">
            <div class="stat-label">总测试次数</div>
            <div class="stat-value">\${stats.totalRuns}</div>
          </div>
          <div class="stat-card green">
            <div class="stat-label">平均通过率</div>
            <div class="stat-value">\${stats.averagePassRate.toFixed(1)}%</div>
            <div class="stat-trend \${trendClass}">\${trendIcon} \${stats.recentTrend === 'up' ? '上升' : stats.recentTrend === 'down' ? '下降' : '稳定'}</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-label">总测试用例</div>
            <div class="stat-value">\${stats.totalTests}</div>
          </div>
          <div class="stat-card purple">
            <div class="stat-label">趋势</div>
            <div class="stat-value">\${trendIcon}</div>
            <div class="stat-trend \${trendClass}">\${stats.recentTrend === 'up' ? '质量提升' : stats.recentTrend === 'down' ? '需要关注' : '保持稳定'}</div>
          </div>
        \`
      } catch (err) {
        document.getElementById('stats').innerHTML = '<div class="error">加载统计数据失败</div>'
      }
    }

    // 获取测试历史
    async function loadHistory() {
      try {
        const response = await fetch('/api/test-runs?limit=10')
        const history = await response.json()
        
        if (history.length === 0) {
          document.getElementById('history').innerHTML = '<div class="loading">暂无测试记录</div>'
          return
        }
        
        const html = history.map(run => {
          const date = new Date(run.timestamp).toLocaleString('zh-CN')
          const passRate = run.passRate.toFixed(1)
          const badgeClass = run.passRate >= 90 ? 'success' : 'warning'
          
          return \`
            <div class="history-item">
              <div class="history-info">
                <div class="history-id">\${run.id}</div>
                <div class="history-time">\${date}</div>
              </div>
              <div class="history-stats">
                <span>\${run.passedTests}/\${run.totalTests} 通过</span>
                <span class="badge \${badgeClass}">\${passRate}%</span>
              </div>
            </div>
          \`
        }).join('')
        
        document.getElementById('history').innerHTML = html
        
        // 绘制图表
        drawCharts(history)
      } catch (err) {
        document.getElementById('history').innerHTML = '<div class="error">加载历史记录失败</div>'
      }
    }

    // 绘制图表
    function drawCharts(history) {
      const labels = history.map(r => new Date(r.timestamp).toLocaleDateString('zh-CN')).reverse()
      const passRates = history.map(r => r.passRate).reverse()
      const durations = history.map(r => r.duration).reverse()

      // 通过率趋势图
      new Chart(document.getElementById('passRateChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: '通过率 (%)',
            data: passRates,
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      })

      // 执行时间图
      new Chart(document.getElementById('durationChart'), {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: '执行时间 (ms)',
            data: durations,
            backgroundColor: 'rgba(72, 187, 120, 0.8)',
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      })
    }

    // 页面加载时初始化
    loadStatistics()
    loadHistory()

    // 每30秒刷新一次
    setInterval(() => {
      loadStatistics()
      loadHistory()
    }, 30000)
  </script>
</body>
</html>`
  }
}

/**
 * 创建 Dashboard 服务器实例
 * @param config Dashboard 配置
 * @returns Dashboard 服务器实例
 */
export function createDashboardServer(config?: DashboardConfig): DashboardServer {
  return new DashboardServer(config)
}


