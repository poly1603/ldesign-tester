/**
 * 模板引擎 - 处理测试模板的渲染
 */
import * as ejs from 'ejs'
import type { TemplateVariables } from '../types/index.js'

export class TemplateEngine {
  /**
   * 渲染模板
   * @param template 模板字符串
   * @param variables 模板变量
   * @returns 渲染后的字符串
   */
  render(template: string, variables: TemplateVariables): string {
    try {
      return ejs.render(template, variables, {
        escape: (str: string) => str, // 不转义HTML
      })
    }
    catch (error) {
      throw new Error(`模板渲染失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 渲染模板文件
   * @param templatePath 模板文件路径
   * @param variables 模板变量
   * @returns 渲染后的字符串
   */
  async renderFile(templatePath: string, variables: TemplateVariables): Promise<string> {
    try {
      return await ejs.renderFile(templatePath, variables, {
        escape: (str: string) => str,
      })
    }
    catch (error) {
      throw new Error(`模板文件渲染失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 编译模板为函数
   * @param template 模板字符串
   * @returns 编译后的模板函数
   */
  compile(template: string): (variables: TemplateVariables) => string {
    try {
      return ejs.compile(template, {
        escape: (str: string) => str,
      })
    }
    catch (error) {
      throw new Error(`模板编译失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 格式化代码（添加适当的缩进和换行）
   * @param code 代码字符串
   * @returns 格式化后的代码
   */
  formatCode(code: string): string {
    // 移除多余的空行
    return code
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n') // 最多保留两个换行
      .trim()
      + '\n'
  }

  /**
   * 生成导入语句
   * @param imports 导入配置
   * @returns 导入语句字符串
   */
  generateImports(imports: Array<{ from: string; imports: string[] | string }>): string {
    return imports
      .map(({ from, imports: imp }) => {
        if (typeof imp === 'string') {
          return `import ${imp} from '${from}'`
        }
        if (imp.length === 0) {
          return `import '${from}'`
        }
        return `import { ${imp.join(', ')} } from '${from}'`
      })
      .join('\n')
  }
}

/**
 * 创建模板引擎实例
 */
export function createTemplateEngine(): TemplateEngine {
  return new TemplateEngine()
}




