/**
 * Faker.js 集成 - 假数据生成
 */
import { faker } from '@faker-js/faker'
import type { MockOptions } from '../types/index.js'

export class FakerIntegration {
  private faker = faker

  /**
   * 设置 locale
   */
  setLocale(locale: 'zh_CN' | 'en_US'): void {
    this.faker = locale === 'zh_CN' ? faker : faker
    // Note: @faker-js/faker v8+ 使用 faker.locale = 'zh_CN' 或导入特定locale
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
        return this.faker.person.fullName()
      case 'firstname':
        return this.faker.person.firstName()
      case 'lastname':
        return this.faker.person.lastName()
      case 'email':
        return this.faker.internet.email()
      case 'phone':
      case 'phonenumber':
        return this.faker.phone.number()
      case 'address':
        return this.faker.location.streetAddress()
      case 'city':
        return this.faker.location.city()
      case 'country':
        return this.faker.location.country()
      case 'zipcode':
      case 'postcode':
        return this.faker.location.zipCode()
      case 'company':
        return this.faker.company.name()
      case 'jobTitle':
        return this.faker.person.jobTitle()
      case 'url':
      case 'website':
        return this.faker.internet.url()
      case 'avatar':
        return this.faker.image.avatar()
      case 'image':
        return this.faker.image.url()
      case 'text':
      case 'description':
        return this.faker.lorem.paragraph()
      case 'sentence':
        return this.faker.lorem.sentence()
      case 'word':
        return this.faker.lorem.word()
      case 'uuid':
      case 'id':
        return this.faker.string.uuid()
      case 'number':
      case 'int':
      case 'integer':
        return this.faker.number.int({ min: 1, max: 1000 })
      case 'float':
      case 'decimal':
        return this.faker.number.float({ min: 0, max: 1000, precision: 0.01 })
      case 'boolean':
      case 'bool':
        return this.faker.datatype.boolean()
      case 'date':
        return this.faker.date.past()
      case 'future-date':
        return this.faker.date.future()
      case 'datetime':
        return this.faker.date.recent()
      case 'color':
        return this.faker.color.rgb()
      case 'price':
        return this.faker.commerce.price()
      case 'product':
        return this.faker.commerce.productName()
      default:
        return this.faker.lorem.word()
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



