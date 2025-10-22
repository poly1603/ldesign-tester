/**
 * @ldesign/tester - 测试工具集
 */
export class TestGenerator {
  generateUnitTest(componentName: string) { return `// Unit test for ${componentName}` }
  generateE2ETest(feature: string) { return `// E2E test for ${feature}` }
}
export function createTestGenerator() { return new TestGenerator() }

