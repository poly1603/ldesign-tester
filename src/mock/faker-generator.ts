/**
 * Faker 数据生成器 - 使用 Faker.js 生成假数据
 */
import { faker } from '@faker-js/faker'
import type { MockOptions } from '../types/index.js'

/**
 * 用户数据模型
 */
export interface MockUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: Date
}

/**
 * 产品数据模型
 */
export interface MockProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  sku: string
  createdAt: Date
}

/**
 * 订单数据模型
 */
export interface MockOrder {
  id: string
  userId: string
  products: Array<{ productId: string; quantity: number; price: number }>
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

/**
 * Faker 数据生成器类
 */
export class FakerGenerator {
  private locale: 'zh_CN' | 'en_US'

  /**
   * 创建 Faker 生成器
   * @param locale 语言环境，默认 zh_CN
   */
  constructor(locale: 'zh_CN' | 'en_US' = 'zh_CN') {
    this.locale = locale
    this.setLocale(locale)
  }

  /**
   * 设置语言环境
   * @param locale 语言环境
   */
  setLocale(locale: 'zh_CN' | 'en_US'): void {
    this.locale = locale
    if (locale === 'zh_CN') {
      faker.locale = 'zh_CN'
    }
    else {
      faker.locale = 'en_US'
    }
  }

  /**
   * 生成单个用户
   * @returns 用户数据
   */
  generateUser(): MockUser {
    return {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.image.avatar(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      createdAt: faker.date.past(),
    }
  }

  /**
   * 生成多个用户
   * @param count 数量
   * @returns 用户数组
   */
  generateUsers(count: number): MockUser[] {
    return Array.from({ length: count }, () => this.generateUser())
  }

  /**
   * 生成单个产品
   * @returns 产品数据
   */
  generateProduct(): MockProduct {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number.parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      image: faker.image.url(),
      stock: faker.number.int({ min: 0, max: 1000 }),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      createdAt: faker.date.past(),
    }
  }

  /**
   * 生成多个产品
   * @param count 数量
   * @returns 产品数组
   */
  generateProducts(count: number): MockProduct[] {
    return Array.from({ length: count }, () => this.generateProduct())
  }

  /**
   * 生成单个订单
   * @returns 订单数据
   */
  generateOrder(): MockOrder {
    const productCount = faker.number.int({ min: 1, max: 5 })
    const products = Array.from({ length: productCount }, () => ({
      productId: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      price: Number.parseFloat(faker.commerce.price()),
    }))

    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      products,
      totalAmount,
      status: faker.helpers.arrayElement([
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ]),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }
  }

  /**
   * 生成多个订单
   * @param count 数量
   * @returns 订单数组
   */
  generateOrders(count: number): MockOrder[] {
    return Array.from({ length: count }, () => this.generateOrder())
  }

  /**
   * 根据 schema 生成数据
   * @param schema 数据模式定义
   * @returns 生成的数据
   */
  generateFromSchema(schema: Record<string, string>): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const [key, type] of Object.entries(schema)) {
      result[key] = this.generateFieldByType(type)
    }

    return result
  }

  /**
   * 根据 schema 生成多条数据
   * @param schema 数据模式定义
   * @param count 数量
   * @returns 生成的数据数组
   */
  generateManyFromSchema(schema: Record<string, string>, count: number): Record<string, unknown>[] {
    return Array.from({ length: count }, () => this.generateFromSchema(schema))
  }

  /**
   * 根据类型生成字段值
   * @param type 字段类型
   * @returns 字段值
   */
  private generateFieldByType(type: string): unknown {
    switch (type.toLowerCase()) {
      // 基础类型
      case 'string':
        return faker.lorem.word()
      case 'number':
        return faker.number.int({ min: 0, max: 1000 })
      case 'float':
        return faker.number.float({ min: 0, max: 1000, precision: 0.01 })
      case 'boolean':
        return faker.datatype.boolean()
      case 'date':
        return faker.date.past()

      // ID 类型
      case 'id':
      case 'uuid':
        return faker.string.uuid()

      // 用户相关
      case 'username':
        return faker.internet.userName()
      case 'email':
        return faker.internet.email()
      case 'firstname':
        return faker.person.firstName()
      case 'lastname':
        return faker.person.lastName()
      case 'fullname':
        return faker.person.fullName()
      case 'avatar':
        return faker.image.avatar()
      case 'phone':
        return faker.phone.number()

      // 地址相关
      case 'street':
        return faker.location.streetAddress()
      case 'city':
        return faker.location.city()
      case 'state':
        return faker.location.state()
      case 'zipcode':
        return faker.location.zipCode()
      case 'country':
        return faker.location.country()

      // 网络相关
      case 'url':
        return faker.internet.url()
      case 'domain':
        return faker.internet.domainName()
      case 'ip':
        return faker.internet.ip()

      // 文本相关
      case 'title':
        return faker.lorem.sentence()
      case 'description':
        return faker.lorem.paragraph()
      case 'text':
        return faker.lorem.text()

      // 图片相关
      case 'image':
      case 'imageurl':
        return faker.image.url()

      // 商务相关
      case 'productname':
        return faker.commerce.productName()
      case 'price':
        return Number.parseFloat(faker.commerce.price())
      case 'department':
      case 'category':
        return faker.commerce.department()

      // 公司相关
      case 'company':
        return faker.company.name()
      case 'jobtitle':
        return faker.person.jobTitle()

      default:
        return faker.lorem.word()
    }
  }

  /**
   * 生成 Mock 数据（通用方法）
   * @param options Mock 选项
   * @returns Mock 数据
   */
  generateMockData(options: MockOptions): unknown {
    const { type, schema, count = 1, locale } = options

    // 设置语言环境
    if (locale) {
      this.setLocale(locale)
    }

    // 根据类型生成数据
    if (schema) {
      return count > 1
        ? this.generateManyFromSchema(schema, count)
        : this.generateFromSchema(schema)
    }

    // 预定义类型
    switch (type) {
      case 'faker':
        return count > 1 ? this.generateUsers(count) : this.generateUser()
      default:
        throw new Error(`不支持的 Mock 类型: ${type}`)
    }
  }
}

/**
 * 创建 Faker 生成器实例
 * @param locale 语言环境
 * @returns Faker 生成器实例
 */
export function createFakerGenerator(locale: 'zh_CN' | 'en_US' = 'zh_CN'): FakerGenerator {
  return new FakerGenerator(locale)
}



