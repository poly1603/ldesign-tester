/**
 * Faker.js 集成 - 假数据生成
 */
import { zh_CN, en_US, type Faker } from '@faker-js/faker'
import type { MockOptions } from '../types/index.js'

export class FakerIntegration {
  private fakerInstance: Faker

  constructor() {
    this.fakerInstance = zh_CN // 默认使用中文
  }

  /**
   * 设置 locale
   */
  setLocale(locale: 'zh_CN' | 'en_US'): void {
    this.fakerInstance = locale === 'zh_CN' ? zh_CN : en_US
  }

  /**
   * 根据 Schema 生成数据
   */
  generateFromSchema(schema: Record<string, any>, count: number = 1): any[] {
    const results: any[] = []

    for (let i = 0; i < count; i++) {
      const item: Record<string, any> = {}

      for (const [key, type] of Object.entries(schema)) {
        item[key] = this.generateFieldValue(type as string)
      }

      results.push(item)
    }

    return count === 1 ? results[0] : results
  }

  /**
   * 生成字段值
   */
  private generateFieldValue(type: string): any {
    switch (type.toLowerCase()) {
      case 'name':
      case 'username':
        return this.fakerInstance.person.fullName()
      case 'firstname':
        return this.fakerInstance.person.firstName()
      case 'lastname':
        return this.fakerInstance.person.lastName()
      case 'email':
        return this.fakerInstance.internet.email()
      case 'phone':
      case 'phonenumber':
        return this.fakerInstance.phone.number()
      case 'address':
        return this.fakerInstance.location.streetAddress()
      case 'city':
        return this.fakerInstance.location.city()
      case 'country':
        return this.fakerInstance.location.country()
      case 'zipcode':
      case 'postcode':
        return this.fakerInstance.location.zipCode()
      case 'company':
        return this.fakerInstance.company.name()
      case 'jobTitle':
        return this.fakerInstance.person.jobTitle()
      case 'url':
      case 'website':
        return this.fakerInstance.internet.url()
      case 'avatar':
        return this.fakerInstance.image.avatar()
      case 'image':
        return this.fakerInstance.image.url()
      case 'text':
      case 'description':
        return this.fakerInstance.lorem.paragraph()
      case 'sentence':
        return this.fakerInstance.lorem.sentence()
      case 'word':
        return this.fakerInstance.lorem.word()
      case 'uuid':
      case 'id':
        return this.fakerInstance.string.uuid()
      case 'number':
      case 'int':
      case 'integer':
        return this.fakerInstance.number.int({ min: 1, max: 1000 })
      case 'float':
      case 'decimal':
        return this.fakerInstance.number.float({ min: 0, max: 1000, precision: 0.01 })
      case 'boolean':
      case 'bool':
        return this.fakerInstance.datatype.boolean()
      case 'date':
        return this.fakerInstance.date.past()
      case 'future-date':
        return this.fakerInstance.date.future()
      case 'datetime':
        return this.fakerInstance.date.recent()
      case 'color':
        return this.fakerInstance.color.rgb()
      case 'price':
        return this.fakerInstance.commerce.price()
      case 'product':
        return this.fakerInstance.commerce.productName()
      default:
        return this.fakerInstance.lorem.word()
    }
  }

  /**
   * 生成用户数据
   */
  generateUser(count: number = 1): any {
    return this.generateFromSchema({
      id: 'uuid',
      name: 'name',
      email: 'email',
      phone: 'phone',
      address: 'address',
      avatar: 'avatar',
      createdAt: 'date',
    }, count)
  }

  /**
   * 生成产品数据
   */
  generateProduct(count: number = 1): any {
    return this.generateFromSchema({
      id: 'uuid',
      name: 'product',
      description: 'description',
      price: 'price',
      image: 'image',
      category: 'word',
      stock: 'number',
    }, count)
  }

  /**
   * 生成公司数据
   */
  generateCompany(count: number = 1): any {
    return this.generateFromSchema({
      id: 'uuid',
      name: 'company',
      email: 'email',
      phone: 'phone',
      website: 'url',
      address: 'address',
    }, count)
  }
}

/**
 * 创建 Faker 集成实例
 */
export function createFakerIntegration(): FakerIntegration {
  return new FakerIntegration()
}



