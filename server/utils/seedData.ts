import { drizzle } from 'drizzle-orm/d1'
import { categoriesTable, linksTable } from '../db/schema'

// 从CategoryNavigation.vue提取的原始数据
const seedCategories = [
  {
    id: 'social',
    name: '社交媒体',
    icon: '📱',
    links: [
      { name: '微博', url: 'https://weibo.com' },
      { name: '知乎', url: 'https://www.zhihu.com' },
      { name: '豆瓣', url: 'https://www.douban.com' },
      { name: '小红书', url: 'https://www.xiaohongshu.com' }
    ]
  },
  {
    id: 'video',
    name: '视频娱乐',
    icon: '🎬',
    links: [
      { name: '哔哩哔哩', url: 'https://www.bilibili.com' },
      { name: 'YouTube', url: 'https://www.youtube.com' },
      { name: '爱奇艺', url: 'https://www.iqiyi.com' },
      { name: '腾讯视频', url: 'https://v.qq.com' }
    ]
  },
  {
    id: 'shopping',
    name: '购物网站',
    icon: '🛍️',
    links: [
      { name: '淘宝', url: 'https://www.taobao.com' },
      { name: '京东', url: 'https://www.jd.com' },
      { name: '天猫', url: 'https://www.tmall.com' },
      { name: '拼多多', url: 'https://www.pinduoduo.com' }
    ]
  },
  {
    id: 'development',
    name: '开发工具',
    icon: '💻',
    links: [
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
      { name: 'CSDN', url: 'https://www.csdn.net' },
      { name: '掘金', url: 'https://juejin.cn' }
    ]
  },
  {
    id: 'news',
    name: '新闻资讯',
    icon: '📰',
    links: [
      { name: '腾讯新闻', url: 'https://news.qq.com' },
      { name: '今日头条', url: 'https://www.toutiao.com' },
      { name: '新浪新闻', url: 'https://news.sina.com.cn' },
      { name: '网易新闻', url: 'https://www.163.com' }
    ]
  },
  {
    id: 'music',
    name: '音乐电台',
    icon: '🎵',
    links: [
      { name: '网易云音乐', url: 'https://music.163.com' },
      { name: 'QQ音乐', url: 'https://y.qq.com' },
      { name: '酷狗音乐', url: 'https://www.kugou.com' },
      { name: '酷我音乐', url: 'https://www.kuwo.cn' }
    ]
  }
]

/**
 * 初始化分类导航数据到数据库
 * @param db Drizzle数据库实例
 */
export async function seedCategoriesData(db: ReturnType<typeof drizzle>) {
  try {
    console.log('🌱 开始初始化分类导航数据...')
    
    // 插入分类数据
    for (let i = 0; i < seedCategories.length; i++) {
      const category = seedCategories[i]
      
      // 插入分类
      const [insertedCategory] = await db.insert(categoriesTable).values({
        name: category.name,
        icon: category.icon,
        slug: category.id,
        sortOrder: i + 1,
        isActive: 1
      }).returning({ id: categoriesTable.id })
      
      console.log(`✅ 插入分类: ${category.name} (ID: ${insertedCategory.id})`)
      
      // 插入该分类下的链接
      for (let j = 0; j < category.links.length; j++) {
        const link = category.links[j]
        
        await db.insert(linksTable).values({
          categoryId: insertedCategory.id,
          name: link.name,
          url: link.url,
          sortOrder: j + 1,
          isActive: 1
        })
        
        console.log(`  ↳ 插入链接: ${link.name}`)
      }
    }
    
    console.log('🎉 分类导航数据初始化完成!')
    console.log(`📊 总计: ${seedCategories.length} 个分类, ${seedCategories.reduce((total, cat) => total + cat.links.length, 0)} 个链接`)
    
  } catch (error) {
    console.error('❌ 数据初始化失败:', error)
    throw error
  }
}