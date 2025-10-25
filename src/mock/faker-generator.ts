/**
 * Faker 数据生成器 - 使用 Faker.js 生成假数据
 */
import { faker, zh_CN, en_US, type Faker } from '@faker-js/faker'
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
  private fakerInstance: Faker

  /**
   * 创建 Faker 生成器
   * @param locale 语言环境，默认 zh_CN
   */
  constructor(locale: 'zh_CN' | 'en_US' = 'zh_CN') {
    this.locale = locale
    this.fakerInstance = locale === 'zh_CN' ? zh_CN : en_US
  }

  /**
   * 设置语言环境
   * @param locale 语言环境
   */
  setLocale(locale: 'zh_CN' | 'en_US'): void {
    this.locale = locale
    this.fakerInstance = locale === 'zh_CN' ? zh_CN : en_US
  }

  /**
   * 生成单个用户
   * @returns 用户数据
   */
  generateUser(): MockUser {
    return {
      id: this.fakerInstance.string.uuid(),
      username: this.fakerInstance.internet.userName(),
      email: this.fakerInstance.internet.email(),
      firstName: this.fakerInstance.person.firstName(),
      lastName: this.fakerInstance.person.lastName(),
      avatar: this.fakerInstance.image.avatar(),
      phone: this.fakerInstance.phone.number(),
      address: {
        street: this.fakerInstance.location.streetAddress(),
        city: this.fakerInstance.location.city(),
        state: this.fakerInstance.location.state(),
        zipCode: this.fakerInstance.location.zipCode(),
        country: this.fakerInstance.location.country(),
      },
      createdAt: this.fakerInstance.date.past(),
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
      id: this.fakerInstance.string.uuid(),
      name: this.fakerInstance.commerce.productName(),
      description: this.fakerInstance.commerce.productDescription(),
      price: Number.parseFloat(this.fakerInstance.commerce.price()),
      category: this.fakerInstance.commerce.department(),
      image: this.fakerInstance.image.url(),
      stock: this.fakerInstance.number.int({ min: 0, max: 1000 }),
      sku: this.fakerInstance.string.alphanumeric(10).toUpperCase(),
      createdAt: this.fakerInstance.date.past(),
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
    const productCount = this.fakerInstance.number.int({ min: 1, max: 5 })
    const products = Array.from({ length: productCount }, () => ({
      productId: this.fakerInstance.string.uuid(),
      quantity: this.fakerInstance.number.int({ min: 1, max: 10 }),
      price: Number.parseFloat(this.fakerInstance.commerce.price()),
    }))

    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

    return {
      id: this.fakerInstance.string.uuid(),
      userId: this.fakerInstance.string.uuid(),
      products,
      totalAmount,
      status: this.fakerInstance.helpers.arrayElement([
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ]),
      createdAt: this.fakerInstance.date.past(),
      updatedAt: this.fakerInstance.date.recent(),
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
        return this.fakerInstance.lorem.word()
      case 'number':
        return this.fakerInstance.number.int({ min: 0, max: 1000 })
      case 'float':
        return this.fakerInstance.number.float({ min: 0, max: 1000, precision: 0.01 })
      case 'boolean':
        return this.fakerInstance.datatype.boolean()
      case 'date':
        return this.fakerInstance.date.past()

      // ID 类型
      case 'id':
      case 'uuid':
        return this.fakerInstance.string.uuid()

      // 用户相关
      case 'username':
        return this.fakerInstance.internet.userName()
      case 'email':
        return this.fakerInstance.internet.email()
      case 'firstname':
        return this.fakerInstance.person.firstName()
      case 'lastname':
        return this.fakerInstance.person.lastName()
      case 'fullname':
        return this.fakerInstance.person.fullName()
      case 'avatar':
        return this.fakerInstance.image.avatar()
      case 'phone':
        return this.fakerInstance.phone.number()

      // 地址相关
      case 'street':
        return this.fakerInstance.location.streetAddress()
      case 'city':
        return this.fakerInstance.location.city()
      case 'state':
        return this.fakerInstance.location.state()
      case 'zipcode':
        return this.fakerInstance.location.zipCode()
      case 'country':
        return this.fakerInstance.location.country()

      // 网络相关
      case 'url':
        return this.fakerInstance.internet.url()
      case 'domain':
        return this.fakerInstance.internet.domainName()
      case 'ip':
        return this.fakerInstance.internet.ip()

      // 文本相关
      case 'title':
        return this.fakerInstance.lorem.sentence()
      case 'description':
        return this.fakerInstance.lorem.paragraph()
      case 'text':
        return this.fakerInstance.lorem.text()

      // 图片相关
      case 'image':
      case 'imageurl':
        return this.fakerInstance.image.url()

      // 商务相关
      case 'productname':
        return this.fakerInstance.commerce.productName()
      case 'price':
        return Number.parseFloat(this.fakerInstance.commerce.price())
      case 'department':
      case 'category':
        return this.fakerInstance.commerce.department()

      // 公司相关
      case 'company':
        return this.fakerInstance.company.name()
      case 'jobtitle':
        return this.fakerInstance.person.jobTitle()

      default:
        return this.fakerInstance.lorem.word()
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



