# fairyCity 项目安装配置指南

## 环境要求

### 系统要求

- **操作系统**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)
- **Node.js**: >= 18.0.0 (推荐使用 LTS 版本)
- **包管理器**: pnpm >= 8.0.0 (推荐) 或 npm >= 9.0.0
- **Git**: >= 2.0.0
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 开发工具推荐

- **IDE**: VS Code, WebStorm, Vim/Neovim
- **VS Code 扩展**:
  - Vue Language Features (Volar)
  - TypeScript Vue Plugin (Volar)
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Auto Rename Tag
  - Bracket Pair Colorizer

## 快速开始

### 1. 克隆项目

```bash
# 使用 HTTPS
git clone https://github.com/your-username/nuxt4-nav.git

# 或使用 SSH
git clone git@github.com:your-username/nuxt4-nav.git

# 进入项目目录
cd nuxt4-nav
```

### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境变量配置

复制环境变量模板文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：

```bash
# .env
# 应用配置
NUXT_SECRET_KEY=your-super-secret-key-here
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# 数据库配置 (本地开发可选)
DATABASE_URL=file:./dev.db

# Cloudflare 配置 (生产环境)
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_DATABASE_ID=your-d1-database-id

# 第三方服务 (可选)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
BAIDU_ANALYTICS_ID=your-baidu-analytics-id
```

### 4. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或指定端口
pnpm dev --port 3001
```

访问 `http://localhost:3000` 查看应用。

## 详细安装步骤

### Node.js 安装

#### 方式一：官方安装包

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本
3. 运行安装程序
4. 验证安装：
   ```bash
   node --version
   npm --version
   ```

#### 方式二：使用版本管理器 (推荐)

**使用 nvm (macOS/Linux)**:
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重启终端或执行
source ~/.bashrc

# 安装最新 LTS 版本
nvm install --lts
nvm use --lts
```

**使用 fnm (跨平台)**:
```bash
# macOS/Linux
curl -fsSL https://fnm.vercel.app/install | bash

# Windows (PowerShell)
winget install Schniz.fnm

# 安装 Node.js
fnm install --lts
fnm use lts-latest
```

### pnpm 安装

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate

# 验证安装
pnpm --version
```

### Git 配置

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置默认分支名
git config --global init.defaultBranch main

# 配置换行符处理 (Windows)
git config --global core.autocrlf true

# 配置换行符处理 (macOS/Linux)
git config --global core.autocrlf input
```

## 项目配置

### Nuxt 配置

项目的主要配置文件是 `nuxt.config.ts`：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 开发服务器配置
  devtools: { enabled: true },
  
  // CSS 框架
  css: ['~/assets/css/reset.css'],
  
  // 模块配置
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // UI 配置
  ui: {
    primary: 'blue',
    gray: 'slate'
  },
  
  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // 运行时配置
  runtimeConfig: {
    // 私有配置 (仅服务端可用)
    secretKey: process.env.NUXT_SECRET_KEY,
    
    // 公共配置 (客户端可用)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },
  
  // Nitro 配置
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
```

### TypeScript 配置

项目使用 TypeScript，配置文件 `tsconfig.json`：

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint 配置

代码规范配置 `eslint.config.mjs`：

```javascript
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    typescript: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false
    }
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': 'warn'
  }
})
```

### Prettier 配置

代码格式化配置 `.prettierrc`：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "endOfLine": "lf",
  "arrowParens": "avoid",
  "vueIndentScriptAndStyle": false
}
```

## 数据库设置

### 本地开发数据库

项目支持本地 SQLite 数据库进行开发：

```bash
# 创建数据库目录
mkdir -p database

# 初始化数据库 (如果有迁移脚本)
pnpm db:migrate

# 填充测试数据
pnpm db:seed
```

### Cloudflare D1 设置

生产环境使用 Cloudflare D1 数据库：

1. **安装 Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**:
   ```bash
   wrangler login
   ```

3. **创建 D1 数据库**:
   ```bash
   wrangler d1 create ztaohub-db
   ```

4. **配置 wrangler.toml**:
   ```toml
   name = "ztaohub"
   compatibility_date = "2024-01-01"
   
   [[d1_databases]]
   binding = "DB"
   database_name = "ztaohub-db"
   database_id = "your-database-id"
   ```

5. **执行数据库迁移**:
   ```bash
   wrangler d1 migrations apply ztaohub-db --local
   wrangler d1 migrations apply ztaohub-db --remote
   ```

## 开发工具配置

### VS Code 配置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": true,
  "tailwindCSS.experimental.classRegex": [
    ["ui:\\s*{([^}]*)}", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

创建 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Git Hooks 配置

使用 Husky 配置 Git hooks：

```bash
# 安装 Husky
pnpm add -D husky

# 初始化 Husky
pnpm husky install

# 添加 pre-commit hook
pnpm husky add .husky/pre-commit "pnpm lint-staged"

# 添加 commit-msg hook
pnpm husky add .husky/commit-msg "pnpm commitlint --edit $1"
```

配置 `package.json`：

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,html,md}": [
      "prettier --write"
    ]
  }
}
```

## 常用命令

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 生成静态站点
pnpm generate
```

### 代码质量命令

```bash
# 运行 ESLint 检查
pnpm lint

# 自动修复 ESLint 问题
pnpm lint:fix

# 运行 Prettier 格式化
pnpm format

# 类型检查
pnpm type-check
```

### 数据库命令

```bash
# 运行数据库迁移
pnpm db:migrate

# 回滚数据库迁移
pnpm db:rollback

# 填充测试数据
pnpm db:seed

# 重置数据库
pnpm db:reset
```

### 测试命令

```bash
# 运行单元测试
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 运行测试覆盖率
pnpm test:coverage

# 运行 E2E 测试
pnpm test:e2e
```

## 故障排除

### 常见问题

#### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用不同端口
pnpm dev --port 3001
```

#### 2. 依赖安装失败

```bash
# 清除缓存
pnpm store prune

# 删除 node_modules 和锁文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

#### 3. TypeScript 错误

```bash
# 重新生成类型文件
pnpm nuxi prepare

# 重启 TypeScript 服务 (VS Code)
# Ctrl/Cmd + Shift + P -> "TypeScript: Restart TS Server"
```

#### 4. 样式不生效

```bash
# 清除 Nuxt 缓存
rm -rf .nuxt .output

# 重新启动开发服务器
pnpm dev
```

### 性能优化

#### 1. 开发服务器优化

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    server: {
      fs: {
        strict: false
      }
    }
  }
})
```

#### 2. 构建优化

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    minify: true,
    compressPublicAssets: true
  }
})
```

## 下一步

安装完成后，你可以：

1. 查看 [架构文档](./ARCHITECTURE.md) 了解项目结构
2. 阅读 [组件指南](./COMPONENTS.md) 学习组件开发
3. 参考 [API 文档](./API.md) 了解接口设计
4. 查看 [部署指南](./DEPLOYMENT.md) 准备生产部署

## 获取帮助

如果遇到问题，可以：

1. 查看 [常见问题](./FAQ.md)
2. 搜索 [GitHub Issues](https://github.com/your-username/nuxt4-nav/issues)
3. 提交新的 Issue
4. 加入讨论群组

---

*最后更新: 2024年1月*