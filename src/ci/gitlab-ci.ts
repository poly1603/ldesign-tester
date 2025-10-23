/**
 * GitLab CI 模板生成器
 */
import type { CIOptions } from '../types/index.js'

export class GitLabCIGenerator {
  generate(options: CIOptions = { platform: 'gitlab' }): string {
    const { nodeVersions = ['18', '20'], cache = true } = options

    return `image: node:${nodeVersions[0]}

${cache ? `cache:
  paths:
    - node_modules/
    - .pnpm-store/
` : ''}
stages:
  - test
  - report

test:
  stage: test
  parallel:
    matrix:
      - NODE_VERSION: [${nodeVersions.map(v => `"${v}"`).join(', ')}]
  image: node:\${NODE_VERSION}
  before_script:
    - npm install -g pnpm
    - pnpm install
  script:
    - pnpm test:coverage
  coverage: '/Lines\\s*:\\s*(\\d+\\.\\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/
    expire_in: 1 week

pages:
  stage: report
  dependencies:
    - test
  script:
    - mkdir -p public
    - cp -r coverage/html/* public/
  artifacts:
    paths:
      - public
  only:
    - main
`
  }
}

export function createGitLabCIGenerator(): GitLabCIGenerator {
  return new GitLabCIGenerator()
}



