/**
 * Vue 组件测试生成器
 */
import type { GenerateOptions } from '../../types/index.js'
import { createTemplateEngine } from '../../core/template-engine.js'

export class VueTestGenerator {
  private templateEngine = createTemplateEngine()

  /**
   * 生成 Vue 组件完整测试
   * @param componentName 组件名称
   * @param options 生成选项
   */
  generateComponentTest(componentName: string, options: GenerateOptions = {}): string {
    const { includeComments = true, variables = {} } = options
    const { props = [], events = [] } = variables

    const template = `${includeComments ? `/**
 * ${componentName} 组件测试
 */
` : ''}import { describe, it, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ${componentName} from './${componentName}.vue'

describe('${componentName}', () => {
  ${includeComments ? '// 组件挂载测试\n  ' : ''}it('should mount successfully', () => {
    const wrapper = mount(${componentName})
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm).toBeDefined()
  })

  ${props.length > 0 ? `${includeComments ? '// Props 测试\n  ' : ''}describe('Props', () => {
${props.map((prop: any) => `    it('should accept ${prop.name} prop', () => {
      const wrapper = mount(${componentName}, {
        props: {
          ${prop.name}: ${this.getMockValue(prop.type)},
        },
      })
      expect(wrapper.props('${prop.name}')).toBe(${this.getMockValue(prop.type)})
    })
`).join('\n')}  })

  ` : ''}${events.length > 0 ? `${includeComments ? '// 事件测试\n  ' : ''}describe('Events', () => {
${events.map((event: any) => `    it('should emit ${event.name} event', async () => {
      const wrapper = mount(${componentName})
      await wrapper.vm.$emit('${event.name}'${event.payload ? `, ${event.payload}` : ''})
      expect(wrapper.emitted()).toHaveProperty('${event.name}')
    })
`).join('\n')}  })

  ` : ''}${includeComments ? '// 插槽测试\n  ' : ''}describe('Slots', () => {
    it('should render default slot', () => {
      const slotContent = '<div class="slot-content">Test Slot</div>'
      const wrapper = mount(${componentName}, {
        slots: {
          default: slotContent,
        },
      })
      expect(wrapper.html()).toContain('Test Slot')
    })

    it('should render named slots', () => {
      const wrapper = mount(${componentName}, {
        slots: {
          header: '<div>Header</div>',
          footer: '<div>Footer</div>',
        },
      })
      expect(wrapper.text()).toContain('Header')
      expect(wrapper.text()).toContain('Footer')
    })
  })

  ${includeComments ? '// 用户交互测试\n  ' : ''}describe('User Interactions', () => {
    it('should handle button click', async () => {
      const wrapper = mount(${componentName})
      const button = wrapper.find('button')
      
      if (button.exists()) {
        await button.trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')
      }
    })

    it('should handle input change', async () => {
      const wrapper = mount(${componentName})
      const input = wrapper.find('input')
      
      if (input.exists()) {
        await input.setValue('test value')
        expect((input.element as HTMLInputElement).value).toBe('test value')
      }
    })
  })

  ${includeComments ? '// 条件渲染测试\n  ' : ''}describe('Conditional Rendering', () => {
    it('should show/hide elements based on conditions', async () => {
      const wrapper = mount(${componentName}, {
        props: {
          show: true,
        },
      })
      
      expect(wrapper.find('.conditional-element').exists()).toBe(true)
      
      await wrapper.setProps({ show: false })
      expect(wrapper.find('.conditional-element').exists()).toBe(false)
    })
  })

  ${includeComments ? '// 快照测试\n  ' : ''}it('should match snapshot', () => {
    const wrapper = mount(${componentName})
    expect(wrapper.html()).toMatchSnapshot()
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 Composition API 测试
   * @param composableName Composable 名称
   * @param options 生成选项
   */
  generateComposableTest(composableName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${composableName} Composable 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import { ref, reactive } from 'vue'
import { ${composableName} } from './${composableName}'

describe('${composableName}', () => {
  it('should return expected values', () => {
    const result = ${composableName}()
    expect(result).toBeDefined()
  })

  it('should be reactive', () => {
    const { state, updateState } = ${composableName}()
    const initialValue = state.value
    
    updateState('new value')
    expect(state.value).not.toBe(initialValue)
  })

  it('should handle side effects', () => {
    const mockCallback = vi.fn()
    const { trigger } = ${composableName}({ onEffect: mockCallback })
    
    trigger()
    expect(mockCallback).toHaveBeenCalled()
  })

  it('should cleanup on unmount', () => {
    const { cleanup } = ${composableName}()
    expect(cleanup).toBeInstanceOf(Function)
    expect(() => cleanup()).not.toThrow()
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 生成 Vuex/Pinia Store 测试
   * @param storeName Store 名称
   * @param storeType 类型 (vuex | pinia)
   * @param options 生成选项
   */
  generateStoreTest(
    storeName: string,
    storeType: 'vuex' | 'pinia' = 'pinia',
    options: GenerateOptions = {},
  ): string {
    const { includeComments = true } = options

    if (storeType === 'pinia') {
      const template = `${includeComments ? `/**
 * ${storeName} Pinia Store 测试
 */
` : ''}import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { use${storeName}Store } from './${storeName}'

describe('${storeName} Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = use${storeName}Store()
    expect(store).toBeDefined()
    expect(store.$state).toBeDefined()
  })

  it('should update state', () => {
    const store = use${storeName}Store()
    store.$patch({ count: 10 })
    expect(store.count).toBe(10)
  })

  it('should execute actions', async () => {
    const store = use${storeName}Store()
    await store.someAction()
    expect(store.count).toBeGreaterThan(0)
  })

  it('should compute getters correctly', () => {
    const store = use${storeName}Store()
    store.count = 5
    expect(store.doubleCount).toBe(10)
  })

  it('should reset state', () => {
    const store = use${storeName}Store()
    store.count = 100
    store.$reset()
    expect(store.count).toBe(0)
  })
})
`
      return this.templateEngine.formatCode(template)
    }
    else {
      const template = `${includeComments ? `/**
 * ${storeName} Vuex Store 测试
 */
` : ''}import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import ${storeName} from './${storeName}'

describe('${storeName} Store', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore(${storeName})
  })

  it('should have initial state', () => {
    expect(store.state).toBeDefined()
  })

  it('should commit mutations', () => {
    store.commit('SET_VALUE', 10)
    expect(store.state.value).toBe(10)
  })

  it('should dispatch actions', async () => {
    await store.dispatch('fetchData')
    expect(store.state.data).toBeDefined()
  })

  it('should compute getters', () => {
    store.state.count = 5
    expect(store.getters.doubleCount).toBe(10)
  })
})
`
      return this.templateEngine.formatCode(template)
    }
  }

  /**
   * 生成 Vue Router 测试
   * @param routeName 路由名称
   * @param options 生成选项
   */
  generateRouterTest(routeName: string, options: GenerateOptions = {}): string {
    const { includeComments = true } = options

    const template = `${includeComments ? `/**
 * ${routeName} 路由测试
 */
` : ''}import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ${routeName} from './${routeName}.vue'

describe('${routeName} Route', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/${routeName.toLowerCase()}', component: ${routeName} },
      ],
    })
    await router.push('/${routeName.toLowerCase()}')
    await router.isReady()
  })

  it('should render route component', () => {
    const wrapper = mount(${routeName}, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle route params', async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/${routeName.toLowerCase()}/:id', component: ${routeName} },
      ],
    })
    await router.push('/${routeName.toLowerCase()}/123')
    await router.isReady()

    const wrapper = mount(${routeName}, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.vm.$route.params.id).toBe('123')
  })

  it('should navigate to other routes', async () => {
    const wrapper = mount(${routeName}, {
      global: {
        plugins: [router],
      },
    })

    await router.push('/other')
    expect(router.currentRoute.value.path).toBe('/other')
  })
})
`

    return this.templateEngine.formatCode(template)
  }

  /**
   * 获取类型的 Mock 值
   */
  private getMockValue(type: string): string {
    switch (type.toLowerCase()) {
      case 'string':
        return '\'test\''
      case 'number':
        return '42'
      case 'boolean':
        return 'true'
      case 'array':
        return '[]'
      case 'object':
        return '{}'
      case 'function':
        return 'vi.fn()'
      default:
        return 'null'
    }
  }
}

/**
 * 创建 Vue 测试生成器实例
 */
export function createVueTestGenerator(): VueTestGenerator {
  return new VueTestGenerator()
}



