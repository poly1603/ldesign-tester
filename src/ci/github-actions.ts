/**
 * GitHub Actions 模板生成器
 */
import type { CIOptions } from '../types/index.js'

export class GitHubActionsGenerator {
  generate(options: CIOptions = { platform: 'github' }): string {
    const { nodeVersions = ['18', '20'], uploadCoverage = true, cache = true } = options

    return `name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [${nodeVersions.join(', ')}]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        ${cache ? 'cache: \'pnpm\'' : ''}
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run tests
      run: pnpm test:coverage
    
    ${uploadCoverage ? `- name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
        flags: unittests
        name: codecov-umbrella` : ''}
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: |
          coverage/
          test-results/
`
  }
}

export function createGitHubActionsGenerator(): GitHubActionsGenerator {
  return new GitHubActionsGenerator()
}



