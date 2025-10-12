# fairyCity 部署指南

## 部署概览

fairyCity 项目设计为在 Cloudflare 生态系统中运行，充分利用 Cloudflare Pages、D1 数据库、Workers 和 CDN 的优势，实现全球边缘部署和极致性能。

### 部署架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Cloudflare    │    │   Cloudflare    │
│     Pages       │────│      D1         │────│    Workers      │
│  (静态资源+SSR)  │    │   (数据库)       │    │   (API路由)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │      CDN        │
                    │   (全球缓存)     │
                    └─────────────────┘
```

### 核心优势

- **全球边缘部署**: 在 300+ 城市的边缘节点运行
- **零冷启动**: Cloudflare Workers 的即时响应
- **自动扩缩容**: 根据流量自动调整资源
- **成本效益**: 按使用量付费，小型项目几乎免费
- **高可用性**: 99.9% 的服务可用性保证

## 环境准备

### 必需工具

```bash
# Node.js 18+
node --version  # >= 18.0.0

# pnpm 包管理器
npm install -g pnpm

# Wrangler CLI (Cloudflare 官方工具)
npm install -g wrangler

# Git
git --version
```

### Cloudflare 账户设置

1. **注册 Cloudflare 账户**
   - 访问 [cloudflare.com](https://cloudflare.com)
   - 注册免费账户

2. **获取 API Token**
   ```bash
   # 登录 Wrangler
   wrangler login
   
   # 或手动设置 API Token
   wrangler config set api_token YOUR_API_TOKEN
   ```

3. **验证权限**
   ```bash
   wrangler whoami
   ```

## 数据库部署

### 创建 D1 数据库

```bash
# 创建生产数据库
wrangler d1 create ztaohub-prod

# 创建开发数据库
wrangler d1 create ztaohub-dev
```

### 配置 wrangler.toml

```toml
name = "ztaohub"
compatibility_date = "2024-01-15"
compatibility_flags = ["nodejs_compat"]

# D1 数据库绑定
[[d1_databases]]
binding = "DB"
database_name = "ztaohub-prod"
database_id = "your-database-id"

# 环境变量
[vars]
NUXT_PUBLIC_SITE_URL = "https://ztaohub.pages.dev"
NUXT_PUBLIC_API_BASE = "https://ztaohub.pages.dev/api"

# 开发环境配置
[env.development]
[[env.development.d1_databases]]
binding = "DB"
database_name = "ztaohub-dev"
database_id = "your-dev-database-id"

[env.development.vars]
NUXT_PUBLIC_SITE_URL = "http://localhost:3000"
NUXT_PUBLIC_API_BASE = "http://localhost:3000/api"
```

### 数据库迁移

```bash
# 执行数据库迁移
wrangler d1 execute ztaohub-prod --file=./database/schema.sql

# 导入初始数据
wrangler d1 execute ztaohub-prod --file=./database/seed.sql

# 验证数据库
wrangler d1 execute ztaohub-prod --command="SELECT * FROM categories LIMIT 5"
```

### 数据库架构文件

创建 `database/schema.sql`:

```sql
-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3b82f6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 导航项表
CREATE TABLE IF NOT EXISTS navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

-- 搜索引擎表
CREATE TABLE IF NOT EXISTS search_engines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    placeholder TEXT,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 站点配置表
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'string',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 日历数据表
CREATE TABLE IF NOT EXISTS calendar_data (
    date TEXT PRIMARY KEY,
    lunar TEXT,
    events TEXT, -- JSON 格式
    suitable TEXT, -- JSON 格式
    avoid TEXT, -- JSON 格式
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户统计表
CREATE TABLE IF NOT EXISTS user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    event_data TEXT, -- JSON 格式
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_navigation_items_category_id ON navigation_items(category_id);
CREATE INDEX IF NOT EXISTS idx_navigation_items_active ON navigation_items(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_sort_order ON navigation_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_user_stats_event_type ON user_stats(event_type);
CREATE INDEX IF NOT EXISTS idx_user_stats_created_at ON user_stats(created_at);
```

创建 `database/seed.sql`:

```sql
-- 插入默认分类
INSERT OR IGNORE INTO categories (name, slug, description, icon, color, sort_order) VALUES
('开发工具', 'dev-tools', '编程开发相关工具和资源', 'i-heroicons-code-bracket', '#10b981', 1),
('设计资源', 'design', '设计工具和素材资源', 'i-heroicons-paint-brush', '#f59e0b', 2),
('学习教育', 'education', '在线学习和教育平台', 'i-heroicons-academic-cap', '#3b82f6', 3),
('生活服务', 'lifestyle', '日常生活相关服务', 'i-heroicons-home', '#ef4444', 4),
('娱乐媒体', 'entertainment', '娱乐和媒体内容', 'i-heroicons-play', '#8b5cf6', 5);

-- 插入示例导航项
INSERT OR IGNORE INTO navigation_items (category_id, title, url, description, icon, sort_order) VALUES
(1, 'GitHub', 'https://github.com', '全球最大的代码托管平台', 'https://github.com/favicon.ico', 1),
(1, 'Stack Overflow', 'https://stackoverflow.com', '程序员问答社区', 'https://stackoverflow.com/favicon.ico', 2),
(1, 'MDN Web Docs', 'https://developer.mozilla.org', 'Web 开发文档和教程', 'https://developer.mozilla.org/favicon.ico', 3),
(2, 'Figma', 'https://figma.com', '协作设计工具', 'https://figma.com/favicon.ico', 1),
(2, 'Dribbble', 'https://dribbble.com', '设计师作品展示平台', 'https://dribbble.com/favicon.ico', 2),
(3, 'Coursera', 'https://coursera.org', '在线课程平台', 'https://coursera.org/favicon.ico', 1),
(3, 'Khan Academy', 'https://khanacademy.org', '免费在线教育', 'https://khanacademy.org/favicon.ico', 2);

-- 插入搜索引擎
INSERT OR IGNORE INTO search_engines (name, url, icon, placeholder, sort_order) VALUES
('百度', 'https://www.baidu.com/s?wd={query}', 'https://www.baidu.com/favicon.ico', '百度一下', 1),
('Google', 'https://www.google.com/search?q={query}', 'https://www.google.com/favicon.ico', 'Search Google', 2),
('必应', 'https://www.bing.com/search?q={query}', 'https://www.bing.com/favicon.ico', '微软必应', 3);

-- 插入站点配置
INSERT OR IGNORE INTO site_config (key, value, description, type) VALUES
('site_title', 'fairyCity - 个人导航网站', '网站标题', 'string'),
('site_description', '简洁高效的个人导航网站，收录优质网站资源', '网站描述', 'string'),
('site_keywords', 'fairyCity,导航,网站导航,个人导航,书签', '网站关键词', 'string'),
('site_logo', '/logo.svg', '网站Logo', 'string'),
('theme_color', '#3b82f6', '主题色', 'color'),
('enable_analytics', 'true', '是否启用统计', 'boolean'),
('max_items_per_category', '20', '每个分类最大显示项目数', 'number');
```

## 应用部署

### Nuxt 配置优化

更新 `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Nitro 配置 - Cloudflare Pages 优化
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true
    },
    rollupConfig: {
      external: ['__STATIC_CONTENT_MANIFEST']
    }
  },

  // 运行时配置
  runtimeConfig: {
    // 私有配置 (服务端)
    apiSecret: process.env.API_SECRET,
    
    // 公共配置 (客户端)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://ztaohub.pages.dev',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  // CSS 优化
  css: ['~/assets/css/main.css'],
  
  // 构建优化
  build: {
    transpile: ['@nuxtjs/google-fonts']
  },

  // 实验性功能
  experimental: {
    payloadExtraction: false, // Cloudflare Pages 兼容性
    inlineSSRStyles: false
  },

  // SEO 优化
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'ztaoHub - 个人导航网站',
      meta: [
        { name: 'description', content: '简洁高效的个人导航网站' },
        { name: 'theme-color', content: '#3b82f6' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  // 模块配置
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt'
  ],

  // UI 配置
  ui: {
    primary: 'blue',
    gray: 'slate'
  },

  // 图片优化
  image: {
    cloudflare: {
      baseURL: 'https://ztaohub.pages.dev'
    }
  },

  // 字体优化
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true
  }
})
```

### 环境变量配置

创建 `.env.production`:

```bash
# 生产环境配置
NUXT_PUBLIC_SITE_URL=https://ztaohub.pages.dev
NUXT_PUBLIC_API_BASE=https://ztaohub.pages.dev/api
API_SECRET=your-super-secret-key
NUXT_UI_PRO_LICENSE=your-license-key
```

### 构建脚本

更新 `package.json`:

```json
{
  "scripts": {
    "build": "nuxt build",
    "build:prod": "NODE_ENV=production nuxt build",
    "preview": "nuxt preview",
    "deploy": "wrangler pages deploy dist",
    "deploy:prod": "pnpm build:prod && wrangler pages deploy dist --env production",
    "db:migrate": "wrangler d1 execute ztaohub-prod --file=./database/schema.sql",
    "db:seed": "wrangler d1 execute ztaohub-prod --file=./database/seed.sql",
    "db:reset": "pnpm db:migrate && pnpm db:seed"
  }
}
```

## CI/CD 配置

### GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test

      - name: Build application
        run: pnpm build:prod
        env:
          NUXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
          API_SECRET: ${{ secrets.API_SECRET }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ztaohub
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Database Migration
        if: github.ref == 'refs/heads/main'
        run: |
          echo "${{ secrets.WRANGLER_CONFIG }}" > wrangler.toml
          npx wrangler d1 execute ztaohub-prod --file=./database/schema.sql
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### 环境变量设置

在 GitHub 仓库设置中添加以下 Secrets:

```bash
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
SITE_URL=https://ztaohub.pages.dev
API_SECRET=your-super-secret-key
WRANGLER_CONFIG=base64-encoded-wrangler.toml
```

## 手动部署

### 本地构建和部署

```bash
# 1. 安装依赖
pnpm install

# 2. 构建项目
pnpm build:prod

# 3. 预览构建结果
pnpm preview

# 4. 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name ztaohub

# 5. 配置自定义域名 (可选)
wrangler pages domain add ztaohub.com --project-name ztaohub
```

### 数据库管理

```bash
# 查看数据库列表
wrangler d1 list

# 执行 SQL 查询
wrangler d1 execute ztaohub-prod --command="SELECT COUNT(*) FROM navigation_items"

# 导出数据
wrangler d1 export ztaohub-prod --output backup.sql

# 导入数据
wrangler d1 execute ztaohub-prod --file=backup.sql
```

## 域名配置

### 自定义域名

1. **添加域名到 Cloudflare Pages**
   ```bash
   wrangler pages domain add your-domain.com --project-name ztaohub
   ```

2. **DNS 配置**
   ```
   Type: CNAME
   Name: @
   Target: ztaohub.pages.dev
   ```

3. **SSL 证书**
   - Cloudflare 自动提供免费 SSL 证书
   - 支持通配符证书

### 子域名配置

```bash
# 添加子域名
wrangler pages domain add nav.your-domain.com --project-name ztaohub

# DNS 配置
# Type: CNAME
# Name: nav
# Target: ztaohub.pages.dev
```

## 性能优化

### 缓存策略

创建 `_headers` 文件:

```
# 静态资源缓存
/_nuxt/*
  Cache-Control: public, max-age=31536000, immutable

# 图片缓存
/images/*
  Cache-Control: public, max-age=2592000

# API 缓存
/api/*
  Cache-Control: public, max-age=300, s-maxage=600

# HTML 缓存
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# 根目录
/
  Cache-Control: public, max-age=0, must-revalidate
```

### 重定向规则

创建 `_redirects` 文件:

```
# 重定向规则
/admin/* /admin/index.html 200
/api/* /api/:splat 200

# 旧 URL 重定向
/old-path/* /new-path/:splat 301

# 404 页面
/* /404.html 404
```

### 压缩优化

在 `nuxt.config.ts` 中配置:

```typescript
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'nuxt'],
            ui: ['@nuxt/ui']
          }
        }
      }
    }
  }
})
```

## 监控和分析

### Cloudflare Analytics

```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  // Cloudflare Web Analytics
  if (process.client) {
    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.setAttribute('data-cf-beacon', '{"token": "your-token"}')
    document.head.appendChild(script)
  }
})
```

### 错误监控

```typescript
// plugins/error-tracking.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    // 发送错误到监控服务
    console.error('Vue Error:', error, context)
    
    // 可以集成 Sentry 或其他错误监控服务
    if (process.client && window.Sentry) {
      window.Sentry.captureException(error)
    }
  }
})
```

### 性能监控

```typescript
// composables/usePerformance.ts
export const usePerformance = () => {
  const trackPageLoad = () => {
    if (process.client && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        load: navigation.loadEventEnd - navigation.loadEventStart
      }
      
      // 发送性能数据
      $fetch('/api/analytics/performance', {
        method: 'POST',
        body: metrics
      }).catch(() => {})
    }
  }
  
  return { trackPageLoad }
}
```

## 备份和恢复

### 数据库备份

```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

echo "开始备份数据库..."
wrangler d1 export ztaohub-prod --output "backups/${BACKUP_FILE}"

echo "备份完成: backups/${BACKUP_FILE}"

# 上传到云存储 (可选)
# aws s3 cp "backups/${BACKUP_FILE}" s3://your-backup-bucket/
```

### 自动备份

```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *' # 每天凌晨2点
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Wrangler
        run: npm install -g wrangler
        
      - name: Backup Database
        run: |
          DATE=$(date +%Y%m%d_%H%M%S)
          wrangler d1 export ztaohub-prod --output "backup_${DATE}.sql"
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          
      - name: Upload Backup
        uses: actions/upload-artifact@v4
        with:
          name: database-backup
          path: backup_*.sql
          retention-days: 30
```

### 恢复流程

```bash
# 1. 下载备份文件
# 2. 恢复数据库
wrangler d1 execute ztaohub-prod --file=backup_20240115_020000.sql

# 3. 验证数据
wrangler d1 execute ztaohub-prod --command="SELECT COUNT(*) FROM categories"
```

## 安全配置

### 安全头设置

在 `_headers` 文件中添加:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com
```

### API 安全

```typescript
// server/api/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // 只对管理 API 进行认证
  if (event.node.req.url?.startsWith('/api/admin/')) {
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
    
    // 验证 token
    const isValid = await verifyToken(token)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }
  }
})
```

### 速率限制

```typescript
// server/api/middleware/rateLimit.ts
const rateLimitMap = new Map()

export default defineEventHandler(async (event) => {
  const ip = getClientIP(event)
  const now = Date.now()
  const windowMs = 60 * 1000 // 1分钟
  const maxRequests = 100
  
  const requests = rateLimitMap.get(ip) || []
  const validRequests = requests.filter((time: number) => now - time < windowMs)
  
  if (validRequests.length >= maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests'
    })
  }
  
  validRequests.push(now)
  rateLimitMap.set(ip, validRequests)
})
```

## 故障排除

### 常见部署问题

#### 1. 构建失败

```bash
# 检查 Node.js 版本
node --version

# 清理缓存
pnpm store prune
rm -rf node_modules .nuxt dist
pnpm install

# 本地测试构建
pnpm build
```

#### 2. 数据库连接失败

```bash
# 检查数据库配置
wrangler d1 list

# 测试数据库连接
wrangler d1 execute ztaohub-prod --command="SELECT 1"

# 检查 wrangler.toml 配置
cat wrangler.toml
```

#### 3. 域名解析问题

```bash
# 检查 DNS 配置
dig your-domain.com
nslookup your-domain.com

# 检查 Cloudflare 设置
wrangler pages domain list --project-name ztaohub
```

### 调试工具

```bash
# 查看部署日志
wrangler pages deployment list --project-name ztaohub

# 实时日志
wrangler pages deployment tail --project-name ztaohub

# 本地开发调试
wrangler pages dev dist --d1 DB=ztaohub-dev
```

### 性能问题排查

```typescript
// utils/performance.ts
export const measurePerformance = (name: string, fn: Function) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  console.log(`${name} took ${end - start} milliseconds`)
  return result
}

// 使用示例
const data = await measurePerformance('Database Query', () => 
  $fetch('/api/categories')
)
```

## 维护和更新

### 定期维护任务

```bash
#!/bin/bash
# scripts/maintenance.sh

echo "开始维护任务..."

# 1. 更新依赖
pnpm update

# 2. 运行测试
pnpm test

# 3. 检查安全漏洞
pnpm audit

# 4. 清理数据库
wrangler d1 execute ztaohub-prod --command="DELETE FROM user_stats WHERE created_at < datetime('now', '-30 days')"

# 5. 备份数据库
DATE=$(date +%Y%m%d)
wrangler d1 export ztaohub-prod --output "maintenance_backup_${DATE}.sql"

echo "维护任务完成"
```

### 版本更新流程

1. **准备更新**
   ```bash
   git checkout -b release/v1.1.0
   ```

2. **更新版本号**
   ```bash
   npm version patch  # 或 minor, major
   ```

3. **测试部署**
   ```bash
   pnpm build:prod
   wrangler pages deploy dist --env staging
   ```

4. **生产部署**
   ```bash
   git checkout main
   git merge release/v1.1.0
   git push origin main
   ```

### 监控指标

- **性能指标**: 页面加载时间、API 响应时间
- **可用性指标**: 服务正常运行时间、错误率
- **业务指标**: 页面访问量、导航点击量
- **资源指标**: 带宽使用量、数据库查询次数

## 成本优化

### Cloudflare 免费额度

- **Pages**: 500 次构建/月，100GB 带宽/月
- **Workers**: 100,000 次请求/天
- **D1**: 5GB 存储，25M 行读取/天
- **Images**: 100,000 次变换/月

### 成本监控

```typescript
// server/api/admin/usage.get.ts
export default defineEventHandler(async (event) => {
  // 获取使用量统计
  const stats = await Promise.all([
    // Pages 构建次数
    $fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/{project_name}/deployments'),
    
    // Workers 请求次数
    $fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/usage'),
    
    // D1 使用量
    $fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/usage')
  ])
  
  return {
    pages: stats[0],
    workers: stats[1],
    database: stats[2]
  }
})
```

## 扩展和集成

### 第三方服务集成

```typescript
// server/api/integrations/github.get.ts
export default defineEventHandler(async (event) => {
  const { data } = await $fetch('https://api.github.com/user/repos', {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`
    }
  })
  
  return data.map(repo => ({
    title: repo.name,
    url: repo.html_url,
    description: repo.description,
    category_id: 1 // 开发工具
  }))
})
```

### Webhook 集成

```typescript
// server/api/webhooks/github.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const signature = getHeader(event, 'x-hub-signature-256')
  
  // 验证 webhook 签名
  const isValid = verifyGitHubSignature(body, signature)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid signature'
    })
  }
  
  // 处理 webhook 事件
  if (body.action === 'starred') {
    // 记录 star 事件
    await recordEvent('github_star', body.repository)
  }
  
  return { success: true }
})
```

---

*最后更新: 2024年1月15日*

如有疑问或建议，请联系：[support@ztaohub.com](mailto:support@ztaohub.com)