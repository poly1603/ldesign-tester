import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/tester',
  description: '企业级测试工具集 - 一键生成测试、Mock、配置和CI/CD',
  base: '/tester/',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/ldesign/ldesign' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
          ],
        },
        {
          text: '核心功能',
          items: [
            { text: '测试生成', link: '/guide/test-generation' },
            { text: 'Mock 系统', link: '/guide/mock-system' },
            { text: '配置生成', link: '/guide/config-generation' },
            { text: 'CI/CD 集成', link: '/guide/ci-cd' },
          ],
        },
        {
          text: '高级功能',
          items: [
            { text: '性能测试', link: '/guide/performance' },
            { text: '视觉回归', link: '/guide/visual-regression' },
            { text: 'Dashboard', link: '/guide/dashboard' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'TestGenerator', link: '/api/test-generator' },
            { text: 'ConfigGenerator', link: '/api/config-generator' },
            { text: 'MockGenerator', link: '/api/mock-generator' },
            { text: 'CIGenerator', link: '/api/ci-generator' },
            { text: 'Performance', link: '/api/performance' },
            { text: 'Visual', link: '/api/visual' },
          ],
        },
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础使用', link: '/examples/basic' },
            { text: 'Vue 项目', link: '/examples/vue' },
            { text: 'React 项目', link: '/examples/react' },
            { text: 'API 测试', link: '/examples/api' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/ldesign' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 LDesign Team',
    },
  },
})





