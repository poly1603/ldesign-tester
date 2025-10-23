#!/usr/bin/env node

/**
 * @ldesign/tester CLI 入口
 */

import('../dist/cli/index.js')
  .then(({ runCLI }) => runCLI())
  .catch((error) => {
    console.error('❌ CLI 启动失败:', error)
    process.exit(1)
  })


