/**
 * @ldesign/tester 基础使用示例
 */
import {
  createTestGenerator,
  createConfigGenerator,
  createFakerIntegration,
  createMSWIntegration,
  createGitHubActionsGenerator,
} from '../src/index.js'

// ===== 1. 测试生成示例 =====
console.log('========== 测试生成示例 ==========\n')

const testGen = createTestGenerator()

// 生成单元测试
const unitTest = testGen.generateUnitTest('calculateTotal')
console.log('单元测试:\n', unitTest)

// 生成组件测试（Vue）
const vueTest = testGen.generateComponentTest('Button', 'vue', {
  variables: {
    props: [
      { name: 'label', type: 'string' },
      { name: 'disabled', type: 'boolean' },
    ],
    events: [
      { name: 'click' },
    ],
  },
})
console.log('\nVue组件测试:\n', vueTest)

// 生成API测试
const apiTest = testGen.generateAPITest('Users')
console.log('\nAPI测试:\n', apiTest)

// ===== 2. 配置生成示例 =====
console.log('\n========== 配置生成示例 ==========\n')

const configGen = createConfigGenerator()

// 生成Vitest配置
const vitestConfig = configGen.generateVitestConfig({
  environment: 'jsdom',
  globals: true,
  plugins: ['vue'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    thresholds: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
})
console.log('Vitest配置:\n', vitestConfig)

// 生成Playwright配置
const playwrightConfig = configGen.generatePlaywrightConfig({
  baseURL: 'http://localhost:5173',
  fullyParallel: true,
})
console.log('\nPlaywright配置:\n', playwrightConfig)

// ===== 3. Mock数据生成示例 =====
console.log('\n========== Mock数据生成示例 ==========\n')

const faker = createFakerIntegration()

// 生成用户数据
const users = faker.generateUser(5)
console.log('生成的用户数据:\n', JSON.stringify(users, null, 2))

// 生成产品数据
const products = faker.generateProduct(3)
console.log('\n生成的产品数据:\n', JSON.stringify(products, null, 2))

// 自定义Schema生成
const customData = faker.generateFromSchema({
  id: 'uuid',
  name: 'name',
  age: 'number',
  email: 'email',
  website: 'url',
}, 2)
console.log('\n自定义Schema数据:\n', JSON.stringify(customData, null, 2))

// ===== 4. MSW集成示例 =====
console.log('\n========== MSW集成示例 ==========\n')

const msw = createMSWIntegration()

// 生成MSW handlers
const handlers = msw.generateHandlers([
  { method: 'GET', path: '/api/users', response: users },
  { method: 'POST', path: '/api/users', response: { id: '123' }, statusCode: 201 },
  { method: 'PUT', path: '/api/users/:id', response: { success: true } },
  { method: 'DELETE', path: '/api/users/:id', statusCode: 204 },
])
console.log('MSW Handlers:\n', handlers)

// ===== 5. CI/CD集成示例 =====
console.log('\n========== CI/CD集成示例 ==========\n')

const githubActions = createGitHubActionsGenerator()

const ciConfig = githubActions.generate({
  platform: 'github',
  nodeVersions: ['18', '20', '22'],
  uploadCoverage: true,
  cache: true,
})
console.log('GitHub Actions配置:\n', ciConfig)

console.log('\n========== 示例完成 ==========\n')



