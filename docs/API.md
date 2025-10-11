# ztaoHub API 接口文档

## API 概览

ztaoHub 提供 RESTful API 接口，支持导航数据的增删改查操作。API 基于 Nuxt 4 的服务端路由构建，运行在 Cloudflare Workers 环境中，具有全球边缘分布的特性。

### 基础信息

- **Base URL**: `https://your-domain.com/api`
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8
- **时区**: UTC

### 通用响应格式

所有 API 响应都遵循统一的格式：

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  meta?: {
    timestamp: string
    version: string
    requestId: string
  }
}
```

#### 成功响应示例

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "开发工具"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0",
    "requestId": "req_123456"
  }
}
```

#### 错误响应示例

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "请求参数验证失败",
  "data": {
    "field": "title",
    "message": "标题不能为空"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0",
    "requestId": "req_123456"
  }
}
```

### HTTP 状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功，无返回内容 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权访问 |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 数据验证失败 |
| 429 | Too Many Requests | 请求频率限制 |
| 500 | Internal Server Error | 服务器内部错误 |

## 认证和授权

### API 密钥认证

对于管理类操作，需要提供 API 密钥：

```http
Authorization: Bearer your-api-key
```

### CSRF 保护

对于状态变更操作（POST、PUT、DELETE），需要提供 CSRF Token：

```http
X-CSRF-Token: your-csrf-token
```

### 请求头要求

```http
Content-Type: application/json
Accept: application/json
User-Agent: ztaoHub-Client/1.0.0
```

## 分类管理 API

### 获取分类列表

获取所有启用的分类信息。

```http
GET /api/categories
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 |
| search | string | 否 | - | 搜索关键词 |
| active | boolean | 否 | true | 是否只返回启用的分类 |
| sort | string | 否 | sort_order | 排序字段 |
| order | string | 否 | asc | 排序方向 (asc/desc) |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "开发工具",
      "slug": "dev-tools",
      "description": "编程开发相关工具和资源",
      "icon": "i-heroicons-code-bracket",
      "color": "#10b981",
      "sort_order": 1,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "items_count": 15
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### 获取单个分类

根据 ID 或 slug 获取分类详情。

```http
GET /api/categories/{id}
GET /api/categories/slug/{slug}
```

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| id | number | 分类 ID |
| slug | string | 分类 slug |

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| include_items | boolean | 否 | false | 是否包含导航项 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "开发工具",
    "slug": "dev-tools",
    "description": "编程开发相关工具和资源",
    "icon": "i-heroicons-code-bracket",
    "color": "#10b981",
    "sort_order": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "items": [
      {
        "id": 1,
        "title": "GitHub",
        "url": "https://github.com",
        "description": "全球最大的代码托管平台"
      }
    ]
  }
}
```

### 创建分类

创建新的分类。

```http
POST /api/categories
```

#### 请求体

```json
{
  "name": "新分类",
  "slug": "new-category",
  "description": "分类描述",
  "icon": "i-heroicons-folder",
  "color": "#3b82f6",
  "sort_order": 10
}
```

#### 字段验证

| 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|----------|
| name | string | 是 | 1-100字符，唯一 |
| slug | string | 是 | 1-100字符，只能包含字母、数字、连字符 |
| description | string | 否 | 最大500字符 |
| icon | string | 否 | 最大200字符 |
| color | string | 否 | 十六进制颜色代码 |
| sort_order | number | 否 | 非负整数 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "新分类",
    "slug": "new-category",
    "description": "分类描述",
    "icon": "i-heroicons-folder",
    "color": "#3b82f6",
    "sort_order": 10,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 更新分类

更新现有分类信息。

```http
PUT /api/categories/{id}
PATCH /api/categories/{id}
```

#### 请求体

```json
{
  "name": "更新后的分类名",
  "description": "更新后的描述",
  "color": "#ef4444"
}
```

### 删除分类

删除指定分类（软删除）。

```http
DELETE /api/categories/{id}
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| force | boolean | 否 | false | 是否强制删除（物理删除） |

### 批量操作分类

批量更新分类排序。

```http
POST /api/categories/batch/sort
```

#### 请求体

```json
{
  "updates": [
    { "id": 1, "sort_order": 1 },
    { "id": 2, "sort_order": 2 },
    { "id": 3, "sort_order": 3 }
  ]
}
```

## 导航项管理 API

### 获取导航项列表

获取导航项列表，支持分类筛选和搜索。

```http
GET /api/navigation
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| category_id | number | 否 | - | 分类 ID |
| category_slug | string | 否 | - | 分类 slug |
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 |
| search | string | 否 | - | 搜索关键词 |
| active | boolean | 否 | true | 是否只返回启用的项目 |
| sort | string | 否 | sort_order | 排序字段 |
| order | string | 否 | asc | 排序方向 |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "title": "GitHub",
      "url": "https://github.com",
      "description": "全球最大的代码托管平台",
      "icon": "https://github.com/favicon.ico",
      "sort_order": 1,
      "is_active": true,
      "click_count": 156,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "category": {
        "id": 1,
        "name": "开发工具",
        "slug": "dev-tools"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 获取单个导航项

根据 ID 获取导航项详情。

```http
GET /api/navigation/{id}
```

### 创建导航项

创建新的导航项。

```http
POST /api/navigation
```

#### 请求体

```json
{
  "category_id": 1,
  "title": "新网站",
  "url": "https://example.com",
  "description": "网站描述",
  "icon": "https://example.com/favicon.ico",
  "sort_order": 10
}
```

#### 字段验证

| 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|----------|
| category_id | number | 是 | 必须是有效的分类 ID |
| title | string | 是 | 1-200字符 |
| url | string | 是 | 有效的 URL 格式 |
| description | string | 否 | 最大1000字符 |
| icon | string | 否 | 有效的 URL 格式 |
| sort_order | number | 否 | 非负整数 |

### 更新导航项

更新现有导航项信息。

```http
PUT /api/navigation/{id}
PATCH /api/navigation/{id}
```

### 删除导航项

删除指定导航项。

```http
DELETE /api/navigation/{id}
```

### 记录点击

记录导航项点击统计。

```http
POST /api/navigation/{id}/click
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": 1,
    "click_count": 157,
    "last_clicked": "2024-01-15T10:30:00Z"
  }
}
```

### 获取热门导航项

获取点击量最高的导航项。

```http
GET /api/navigation/popular
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | number | 否 | 10 | 返回数量 |
| category_id | number | 否 | - | 限制分类 |

## 搜索引擎 API

### 获取搜索引擎列表

获取所有启用的搜索引擎。

```http
GET /api/search-engines
```

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "百度",
      "url": "https://www.baidu.com/s?wd={query}",
      "icon": "https://www.baidu.com/favicon.ico",
      "placeholder": "百度一下",
      "is_active": true,
      "sort_order": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 创建搜索引擎

```http
POST /api/search-engines
```

#### 请求体

```json
{
  "name": "Google",
  "url": "https://www.google.com/search?q={query}",
  "icon": "https://www.google.com/favicon.ico",
  "placeholder": "Search Google",
  "sort_order": 2
}
```

## 搜索 API

### 全局搜索

在所有导航项中搜索。

```http
GET /api/search
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| q | string | 是 | - | 搜索关键词 |
| category_id | number | 否 | - | 限制搜索分类 |
| limit | number | 否 | 20 | 返回数量 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "query": "github",
    "results": [
      {
        "id": 1,
        "title": "GitHub",
        "url": "https://github.com",
        "description": "全球最大的代码托管平台",
        "category": {
          "id": 1,
          "name": "开发工具"
        },
        "relevance": 0.95
      }
    ],
    "total": 3,
    "took": 15
  }
}
```

### 搜索建议

获取搜索建议。

```http
GET /api/search/suggestions
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| q | string | 是 | - | 搜索关键词 |
| limit | number | 否 | 5 | 建议数量 |

#### 响应示例

```json
{
  "success": true,
  "data": [
    "GitHub",
    "GitLab",
    "Git 教程"
  ]
}
```

## 站点配置 API

### 获取公开配置

获取可公开访问的站点配置。

```http
GET /api/config
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "site_title": "ztaoHub - 个人导航网站",
    "site_description": "简洁高效的个人导航网站",
    "site_logo": "/logo.svg",
    "theme_color": "#3b82f6"
  }
}
```

### 获取单个配置

```http
GET /api/config/{key}
```

### 更新配置（需要认证）

```http
PUT /api/config/{key}
```

#### 请求体

```json
{
  "value": "新的配置值",
  "description": "配置描述"
}
```

## 日历数据 API

### 获取日历数据

获取指定日期的日历信息。

```http
GET /api/calendar
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| date | string | 否 | 今天 | 日期 (YYYY-MM-DD) |
| month | string | 否 | - | 月份 (YYYY-MM) |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "lunar": "腊月初五",
    "events": [
      {
        "type": "holiday",
        "content": "小年",
        "is_auspicious": true
      }
    ],
    "suitable": ["开业", "搬家"],
    "avoid": ["结婚", "出行"]
  }
}
```

## 统计分析 API

### 获取站点统计

获取站点整体统计信息。

```http
GET /api/stats
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "categories": 5,
    "navigation_items": 45,
    "total_clicks": 1234,
    "popular_categories": [
      {
        "id": 1,
        "name": "开发工具",
        "clicks": 456
      }
    ],
    "recent_additions": [
      {
        "id": 46,
        "title": "新网站",
        "added_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 获取点击统计

获取详细的点击统计数据。

```http
GET /api/stats/clicks
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| period | string | 否 | 7d | 统计周期 (1d/7d/30d/90d) |
| category_id | number | 否 | - | 分类筛选 |

## 批量操作 API

### 批量导入导航项

批量导入导航项数据。

```http
POST /api/navigation/batch/import
```

#### 请求体

```json
{
  "items": [
    {
      "category_id": 1,
      "title": "网站1",
      "url": "https://example1.com",
      "description": "描述1"
    },
    {
      "category_id": 1,
      "title": "网站2",
      "url": "https://example2.com",
      "description": "描述2"
    }
  ],
  "options": {
    "skip_duplicates": true,
    "update_existing": false
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "imported": 2,
    "skipped": 0,
    "errors": 0,
    "details": [
      {
        "title": "网站1",
        "status": "imported",
        "id": 47
      },
      {
        "title": "网站2",
        "status": "imported",
        "id": 48
      }
    ]
  }
}
```

### 批量导出数据

导出所有数据。

```http
GET /api/export
```

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| format | string | 否 | json | 导出格式 (json/csv) |
| tables | string | 否 | all | 导出表 (all/categories/navigation) |

## 错误处理

### 错误代码

| 错误代码 | HTTP状态码 | 说明 |
|----------|------------|------|
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| UNAUTHORIZED | 401 | 未授权访问 |
| FORBIDDEN | 403 | 禁止访问 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突 |
| RATE_LIMITED | 429 | 请求频率限制 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| DATABASE_ERROR | 500 | 数据库错误 |

### 错误响应格式

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "请求参数验证失败",
  "data": {
    "field": "title",
    "code": "REQUIRED",
    "message": "标题不能为空"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

## 速率限制

### 限制规则

| 端点类型 | 限制 | 窗口期 |
|----------|------|--------|
| 读取操作 | 100 请求/分钟 | 1分钟 |
| 写入操作 | 20 请求/分钟 | 1分钟 |
| 搜索操作 | 50 请求/分钟 | 1分钟 |
| 批量操作 | 5 请求/分钟 | 1分钟 |

### 限制响应头

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## SDK 和客户端库

### JavaScript/TypeScript SDK

```typescript
import { ZtaoHubClient } from '@ztaohub/sdk'

const client = new ZtaoHubClient({
  baseUrl: 'https://your-domain.com/api',
  apiKey: 'your-api-key'
})

// 获取分类列表
const categories = await client.categories.list()

// 创建导航项
const item = await client.navigation.create({
  category_id: 1,
  title: 'GitHub',
  url: 'https://github.com'
})

// 搜索
const results = await client.search('github')
```

### cURL 示例

```bash
# 获取分类列表
curl -X GET "https://your-domain.com/api/categories" \
  -H "Accept: application/json"

# 创建导航项
curl -X POST "https://your-domain.com/api/navigation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "category_id": 1,
    "title": "GitHub",
    "url": "https://github.com"
  }'

# 搜索
curl -X GET "https://your-domain.com/api/search?q=github" \
  -H "Accept: application/json"
```

## Webhook

### 事件类型

| 事件 | 说明 |
|------|------|
| category.created | 分类创建 |
| category.updated | 分类更新 |
| category.deleted | 分类删除 |
| navigation.created | 导航项创建 |
| navigation.updated | 导航项更新 |
| navigation.deleted | 导航项删除 |
| navigation.clicked | 导航项点击 |

### Webhook 配置

```http
POST /api/webhooks
```

#### 请求体

```json
{
  "url": "https://your-app.com/webhook",
  "events": ["navigation.created", "navigation.clicked"],
  "secret": "your-webhook-secret"
}
```

### Webhook 载荷

```json
{
  "event": "navigation.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": 47,
    "title": "新网站",
    "url": "https://example.com",
    "category_id": 1
  }
}
```

## 版本控制

### API 版本

当前 API 版本：`v1`

### 版本策略

- 向后兼容的更改不会增加版本号
- 破坏性更改会发布新版本
- 旧版本会维护至少 6 个月

### 版本指定

```http
Accept: application/vnd.ztaohub.v1+json
```

或通过 URL：

```http
GET /api/v1/categories
```

## 测试和调试

### 测试环境

- **测试 URL**: `https://test.your-domain.com/api`
- **测试数据**: 自动重置，包含示例数据
- **限制**: 更宽松的速率限制

### API 调试工具

推荐使用以下工具测试 API：

- **Postman**: 提供完整的 API 集合
- **Insomnia**: REST 客户端
- **curl**: 命令行工具
- **HTTPie**: 用户友好的命令行工具

### 示例集合

提供 Postman 集合文件：`ztaohub-api.postman_collection.json`

## 更新日志

### v1.0.0 (2024-01-15)

- 初始 API 版本发布
- 支持分类和导航项的 CRUD 操作
- 实现搜索功能
- 添加统计分析接口
- 支持批量操作

### 即将推出

- GraphQL 支持
- 实时订阅
- 更多统计维度
- 高级搜索过滤器

---

*最后更新: 2024年1月15日*

如有疑问或建议，请联系：[support@ztaohub.com](mailto:support@ztaohub.com)