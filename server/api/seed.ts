import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'
import { seedCategoriesData } from '../utils/seedData'

export default defineEventHandler(async (event) => {
  try {
    // 获取数据库连接
    const db = drizzle(event.context.cloudflare.env.DB, { schema })
    
    // 检查是否已经有数据
    const existingCategories = await db.select().from(schema.categoriesTable).limit(1)
    
    if (existingCategories.length > 0) {
      return {
        success: false,
        message: '数据库中已存在分类数据，跳过初始化',
        data: null
      }
    }
    
    // 执行数据初始化
    await seedCategoriesData(db)
    
    // 返回成功结果
    return {
      success: true,
      message: '分类导航数据初始化成功',
      data: {
        categoriesCount: 6,
        linksCount: 24
      }
    }
    
  } catch (error) {
    console.error('数据初始化API错误:', error)
    
    return {
      success: false,
      message: '数据初始化失败',
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
})