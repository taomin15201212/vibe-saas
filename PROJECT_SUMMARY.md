# VibeSaaS MVP 项目总结

## 🎯 产品定位

帮助编程爱好者通过自然语言prompt进行"vibe design"和"vibe coding"的Web开发工具。

**核心价值**: 让用户用中文描述需求 → AI生成可运行的React代码 → 实时预览效果

---

## 📊 四周计划进度

| 周次 | 计划 | 状态 |
|------|------|------|
| W1 | MVP技术架构 + 落地页 + Demo页面 | ✅ 完成 |
| W2 | 用户系统 + 部署上线 | ✅ 完成 |
| W3 | 第一批用户测试 | ⏳ 待进行 |
| W4 | 付费功能 + 增长 | ⏳ 待进行 |

---

## ✅ 已完成功能

### 核心功能

| 功能 | 描述 |
|------|------|
| Prompt输入 | 支持自然语言描述想要的功能 |
| AI代码生成 | OpenAI gpt-4o-mini + 智谱AI双引擎切换 |
| 实时预览 | Sandpack沙盒运行生成的代码 |
| 代码展示 | 代码高亮显示 + 一键复制 |
| 视图切换 | 代码+预览 / 仅代码 / 仅预览 三种模式 |

### 用户系统 (Supabase)

| 功能 | 描述 |
|------|------|
| 注册登录 | 邮箱/密码注册，邮件验证 |
| 生成历史 | 自动保存每次代码生成记录 |
| 模板收藏 | 将满意的代码保存为模板 |
| 账户设置 | 管理API密钥、个人信息 |

### 页面结构

| 页面 | 路由 | 功能 |
|------|------|------|
| 落地页 | `/` | 产品介绍、特性展示、CTA按钮 |
| Demo页 | `/demo` | 核心功能体验，支持保存记录 |
| 登录页 | `/auth` | 用户注册/登录表单 |
| 历史页 | `/dashboard` | 生成历史列表、统计信息 |
| 模板页 | `/dashboard/templates` | 我的模板管理 |
| 设置页 | `/dashboard/settings` | API密钥管理、账户设置 |

---

## 🛠️ 技术栈

### 前端

```
Next.js 16 (App Router)     - React全栈框架
TypeScript                  - 类型安全
Tailwind CSS                - 原子化CSS
Framer Motion               - 动画效果
Lucide React                - 图标库
```

### 后端

```
Next.js API Routes          - Serverless API
Supabase Auth              - 用户认证
Supabase Database          - PostgreSQL数据库
```

### AI集成

```
OpenAI API (gpt-4o-mini)    - 主要代码生成引擎
智谱AI API (GLM-4)         - 备选/降本引擎
```

### 开发工具

```
Sandpack (CodeSandbox)      - 沙盒代码预览
@supabase/ssr              - SSR认证支持
@supabase/supabase-js      - 数据库客户端
```

---

## 📦 项目结构

```
vibe-saas/
├── src/
│   ├── app/                          # Next.js App Router页面
│   │   ├── page.tsx                  # 落地页 (/)
│   │   ├── layout.tsx                # 根布局
│   │   ├── globals.css               # 全局样式
│   │   ├── demo/                     # Demo体验页 (/demo)
│   │   │   └── page.tsx              # 主Demo组件
│   │   ├── auth/                     # 认证页 (/auth)
│   │   │   └── page.tsx              # 登录/注册表单
│   │   ├── dashboard/                # 用户控制台
│   │   │   ├── layout.tsx            # Dashboard布局
│   │   │   ├── page.tsx              # 生成历史 (/dashboard)
│   │   │   ├── templates/            # 模板管理
│   │   │   │   └── page.tsx          # (/dashboard/templates)
│   │   │   ├── billing/              # 套餐升级 (/dashboard/billing)
│   │   │   │   └── page.tsx          #
│   │   │   ├── team/                 # 团队管理 (/dashboard/team)
│   │   │   │   └── page.tsx          #
│   │   │   └── settings/             # 账户设置
│   │   │       └── page.tsx          # (/dashboard/settings)
│   │   └── api/                      # API路由
│   │       ├── generate/route.ts     # AI代码生成 (/api/generate)
│   │       ├── generations/route.ts  # 历史记录 (/api/generations)
│   │       ├── usage/route.ts        # 使用量查询 (/api/usage)
│   │       ├── teams/                # 团队管理
│   │       │   ├── route.ts          # (/api/teams)
│   │       │   └── invite/route.ts   # (/api/teams/invite)
│   │       └── auth/                 # 认证相关
│   │           ├── signup/route.ts   # 注册
│   │           ├── signin/route.ts   # 登录
│   │           ├── signout/route.ts  # 登出
│   │           └── callback/route.ts # 邮件验证回调
│   ├── components/                    # React组件
│   │   ├── PromptInput.tsx           # Prompt输入框组件
│   │   ├── CodePreview.tsx           # 代码高亮展示组件
│   │   ├── LivePreview.tsx           # Sandpack实时预览组件
│   │   ├── AuthForm.tsx              # 认证表单组件
│   │   ├── DashboardSidebar.tsx      # Dashboard侧边栏
│   │   ├── UsageQuota.tsx            # 使用量显示组件
│   │   └── PricingPlans.tsx          # 套餐展示组件
│   ├── lib/                          # 工具库
│   │   ├── ai/                       # AI集成
│   │   │   ├── index.ts              # 统一导出
│   │   │   ├── openai.ts             # OpenAI集成
│   │   │   └── zhipu.ts              # 智谱AI集成
│   │   ├── supabase/                 # Supabase配置
│   │   │   ├── client.ts             # Browser客户端
│   │   │   ├── server.ts             # Server客户端
│   │   │   └── environment.ts        # 环境变量
│   │   ├── usage.ts                  # 使用量追踪工具
│   │   └── utils.ts                  # 工具函数
│   ├── middleware.ts                 # 认证中间件
│   └── types/                        # TypeScript类型 (预留)
├── public/                           # 静态资源
├── supabase-schema.sql               # Supabase数据库Schema
├── DEPLOYMENT.md                     # 部署指南
├── README.md                         # 项目说明
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local.example                # 环境变量模板
```

---

## 📈 数据库设计 (Supabase)

### 表结构

```sql
-- 用户资料 (关联auth.users)
profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- 代码生成历史
generations (
  id UUID PRIMARY KEY,
  user_id UUID,
  prompt TEXT,
  code TEXT,
  provider TEXT,
  is_template BOOLEAN,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- 代码模板
templates (
  id UUID PRIMARY KEY,
  user_id UUID,
  name TEXT,
  description TEXT,
  prompt TEXT,
  code TEXT,
  provider TEXT,
  category TEXT,
  tags TEXT[],
  is_public BOOLEAN,
  is_premium BOOLEAN DEFAULT FALSE,
  usage_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- 团队协作
teams (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

team_members (
  id UUID PRIMARY KEY,
  team_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ
)

-- 订阅计划
subscription_plans (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  description TEXT,
  price_monthly INTEGER,
  price_yearly INTEGER,
  generation_limit INTEGER,
  team_members INTEGER,
  features TEXT[],
  is_active BOOLEAN DEFAULT TRUE
)

-- 用户订阅
user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID,
  plan_id UUID,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT
)

-- 使用量记录
usage_records (
  id UUID PRIMARY KEY,
  user_id UUID,
  generation_count INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ
)

-- 团队邀请
team_invitations (
  id UUID PRIMARY KEY,
  team_id UUID,
  email TEXT,
  role TEXT DEFAULT 'member',
  token TEXT UNIQUE,
  expires_at TIMESTAMPTZ
)
```

### RLS策略

- 用户只能查看/编辑自己的数据
- 公开模板所有人可查看
- 团队成员可访问团队资源

---

## 🚀 部署配置

### 部署平台

| 服务 | 用途 | 免费额度 |
|------|------|----------|
| Vercel | 前端部署 | 100GB带宽/月 |
| Supabase | 数据库+认证 | 500MB数据库 |

### 环境变量

```env
# OpenAI (必填)
OPENAI_API_KEY=sk-your-openai-key

# 智谱AI (可选，用于降本)
ZHIPU_API_KEY=your-zhipu-api-key

# Supabase (必填)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 部署步骤

1. **Vercel部署**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **配置环境变量**
   - Vercel控制台 → Settings → Environment Variables
   - 添加上述所有变量

3. **Supabase配置**
   - 创建Supabase项目
   - SQL Editor中执行 `supabase-schema.sql`
   - 获取URL和Anon Key

4. **重新部署**
   ```bash
   vercel --prod
   ```

详细部署指南见 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 💰 成本估算 (月)

| 项目 | 免费额度 | 超出费用 |
|------|----------|----------|
| Vercel | 100GB带宽 | $20/100GB |
| Supabase | 500MB数据库 | $25/500MB |
| OpenAI | $5免费额度 | $0.01/1K tokens (gpt-4o-mini) |

## 💳 订阅计划

| 套餐 | 价格 | 生成次数 | 团队成员 |
|------|------|----------|----------|
| 免费 | ¥0/月 | 10次/月 | 1 |
| 专业版 | ¥29/月 | 无限 | 5 |
| 团队版 | ¥99/月 | 无限 | 20 |
| 智谱AI | 有免费额度 | 按量计费 |

**MVP阶段预估成本**: $0-10/月 (小规模使用)

---

## 🔄 后续迭代计划

### W3: 用户测试

- [x] 完善错误提示和边界情况处理
- [x] 优化Prompt模板提高生成质量
- [ ] 邀请10-20个编程爱好者测试
- [ ] 收集使用反馈
- [ ] 根据反馈迭代产品功能

### W4: 付费功能 (进行中)

- [x] 免费用户限制生成次数 (每月10次)
- [x] 付费会员无限使用
- [x] 付费会员专属模板
- [x] 团队协作功能
- [ ] 支付集成 (Stripe)
- [ ] 分析用户数据优化定价策略

---

## 📊 当前状态

```
✅ 项目构建成功 - Next.js 16 + TypeScript
✅ 集成Supabase用户系统 - 邮箱登录 + 数据库
✅ 集成OpenAI/智谱AI - 双引擎切换
✅ 完成落地页 - 产品介绍 + CTA
✅ 完成Demo页 - Prompt输入 + 代码生成 + 预览
✅ 完成Dashboard - 历史记录 + 模板管理
✅ 编写部署文档 - DEPLOYMENT.md
✅ 集成使用量限制 - 免费用户每月10次
✅ 集成订阅系统 - 免费/专业/团队套餐
✅ 集成团队协作 - 团队创建和邀请
⏳ 待部署上线 - 需登录Vercel
⏳ 待用户测试 - W3计划
⏳ 待支付集成 - Stripe接入 (W4)
```

---

## 🎯 核心指标 (MVP)

| 指标 | 目标 |
|------|------|
| 注册用户数 | 50+ (W4) |
| 日活跃用户 | 20+ (W4) |
| 代码生成次数 | 500+ (W4) |
| 转化率 | 5% (W4) |

---

## 📝 经验总结

### 做对的

1. **双AI引擎** - 提供OpenAI作为主力，智谱AI作为降本备选
2. **渐进式功能** - 先做核心功能，用户系统后续添加
3. **本地化** - 全中文界面，符合目标用户习惯

### 待改进

1. **部署流程** - 需要简化一键部署体验
2. **错误处理** - AI生成失败时提示不够友好
3. **模板质量** - 需持续优化系统Prompt

---

## 🔗 相关链接

- **GitHub**: https://github.com/your-repo
- **Demo**: https://your-domain.vercel.app/demo
- **文档**: https://your-domain.vercel.app/README.md
- **部署指南**: https://your-domain.vercel.app/DEPLOYMENT.md

---

*最后更新: 2026-01-11*
