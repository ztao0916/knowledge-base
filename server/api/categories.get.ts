import { drizzle } from 'drizzle-orm/d1'
import { eq, asc } from 'drizzle-orm'
import * as schema from '../db/schema'

export default defineEventHandler(async (event) => {
  try {
    // 获取数据库连接
    const db = drizzle(event.context.cloudflare.env.DB, { schema })
    
    // 查询所有启用的分类，按排序字段排序
    const categories = await db
      .select({
        id: schema.categoriesTable.id,
        name: schema.categoriesTable.name,
        icon: schema.categoriesTable.icon,
        slug: schema.categoriesTable.slug,
        sortOrder: schema.categoriesTable.sortOrder
      })
      .from(schema.categoriesTable)
      .where(eq(schema.categoriesTable.isActive, 1))
      .orderBy(asc(schema.categoriesTable.sortOrder))
    
    // 为每个分类查询其链接
    const categoriesWithLinks = await Promise.all(
      categories.map(async (category) => {
        const links = await db
          .select({
            id: schema.linksTable.id,
            name: schema.linksTable.name,
            url: schema.linksTable.url,
            description: schema.linksTable.description,
            sortOrder: schema.linksTable.sortOrder
          })
          .from(schema.linksTable)
          .where(
            eq(schema.linksTable.categoryId, category.id)
          )
          .orderBy(asc(schema.linksTable.sortOrder))
        
        return {
          id: category.slug, // 使用slug作为前端的id，保持兼容性
          name: category.name,
          icon: category.icon,
          links: links.map(link => ({
            name: link.name,
            url: link.url,
            description: link.description
          }))
        }
      })
    )
    
    return {
      success: true,
      data: categoriesWithLinks,
      message: '获取分类导航数据成功'
    }
    
  } catch (error) {
    console.error('获取分类导航数据失败:', error)
    
    return {
      success: false,
      data: [],
      message: '获取分类导航数据失败',
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
})