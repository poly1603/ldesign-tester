/**
 * Dashboard 服务器
 */
import type { DashboardConfig } from '../types/index.js'

export class DashboardServer {
  private config: DashboardConfig

  constructor(config: DashboardConfig = {}) {
    this.config = {
      port: 3000,
      dbPath: './test-history.db',
      open: true,
      ...config,
    }
  }

  /**
   * 启动 Dashboard
   */
  async start(): Promise<void> {
    console.log(`🚀 Dashboard 启动在 http://localhost:${this.config.port}`)
    // 占位符实现
  }

  /**
   * 停止 Dashboard
   */
  async stop(): Promise<void> {
    console.log('⏹️  Dashboard 已停止')
  }
}

export function createDashboardServer(config?: DashboardConfig): DashboardServer {
  return new DashboardServer(config)
}


