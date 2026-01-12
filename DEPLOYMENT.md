# VibeSaaS 部署指南

## 1. Vercel 部署（推荐）

### 步骤 1: 登录 Vercel
```bash
vercel login
```
按照提示使用 GitHub 或邮箱登录。

### 步骤 2: 部署项目
```bash
cd vibe-saas
vercel
```

按照提示配置：
- **Team/Account**: 选择你的账户
- **Project Name**: vibe-saas（或自定义）
- **Directory**: ./ (当前目录)
- **Override Settings?**: No

### 步骤 3: 配置环境变量

在 Vercel 控制台中，进入项目的 Settings → Environment Variables，添加以下变量：

| 变量名 | 描述 | 必填 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API Key | ✅ |
| `ZHIPU_API_KEY` | 智谱AI API Key (可选) | ❌ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |

### 步骤 4: 重新部署
```bash
vercel --prod
```

---

## 2. Supabase 配置

### 步骤 1: 创建 Supabase 项目
1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写项目名称（如 "vibe-saas"）
4. 设置数据库密码
5. 等待项目创建完成

### 步骤 2: 运行数据库迁移
1. 进入 Supabase 控制台 → SQL Editor
2. 复制 `supabase-schema.sql` 文件内容
3. 点击 "Run" 执行

### 步骤 3: 获取配置信息
进入 Settings → API，获取：
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 步骤 4: 配置邮件认证（可选）
进入 Authentication → URL Configuration，设置：
- Site URL: 你的 Vercel 域名
- Redirect URLs: 添加你的域名

---

## 3. 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 添加 API keys

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 4. 常见问题

### Q: 部署后页面空白？
A: 检查环境变量是否正确配置，特别是 `NEXT_PUBLIC_` 开头的变量。

### Q: 登录功能无法使用？
A:
1. 确保 Supabase 的 Authentication → Providers 已启用 Email
2. 检查 Supabase 的 URL Configuration 是否包含你的域名
3. 确认 Row Level Security 策略已正确设置

### Q: API 请求失败？
A:
1. 检查 API keys 是否有效
2. 确认 OpenAI/智谱AI 账户有足够的调用额度
3. 查看 Vercel 函数日志（Functions → 查看错误信息）

---

## 5. 域名配置（可选）

1. 在 Vercel 控制台进入 Settings → Domains
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录
