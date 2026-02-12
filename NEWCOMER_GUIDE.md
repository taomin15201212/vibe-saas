# 新人上手指南（VibeSaaS）

这份文档给第一次进入仓库的同学一个**从全局到细节**的阅读路径：先理解业务链路，再看代码分层，最后开始动手改功能。

## 1. 先看项目在做什么

VibeSaaS 是一个「自然语言 → React 代码生成 → 即时预览」的 AI Web 开发工具。核心体验是：

1. 用户在 Demo 页输入中文需求；
2. 后端调用 OpenAI / 智谱生成 React + Tailwind 代码；
3. 前端展示代码并用 Sandpack 实时预览；
4. 登录用户可保存生成历史，受套餐用量限制。

对应的主链路页面和 API：

- 页面：`/demo`、`/dashboard`、`/auth`
- API：`/api/generate`、`/api/generations`、`/api/usage`

## 2. 目录结构怎么理解

以 `src/` 为中心，可以按 4 层理解：

- `src/app/`：路由与页面（App Router）
  - `app/page.tsx`：营销落地页（入口）
  - `app/demo/page.tsx`：核心生成体验
  - `app/auth/page.tsx`：登录/注册
  - `app/dashboard/**`：登录后的控制台
  - `app/api/**`：服务端 API
- `src/components/`：可复用 UI 组件
  - 例如 `PromptInput`、`CodePreview`、`LivePreview`、`UsageQuota`
- `src/lib/`：业务能力封装
  - `lib/ai/*`：多模型生成逻辑
  - `lib/supabase/*`：客户端/服务端 Supabase 访问
  - `lib/usage.ts`：用量相关工具函数
- `src/middleware.ts`：请求级别会话更新（Supabase SSR 认证配套）

除了源码，建议同步看：

- `PROJECT_SUMMARY.md`：产品/功能/路由总览
- `supabase-schema.sql`：数据库结构与函数
- `STATE_MACHINES.md`：复杂交互状态机（AuthForm、Demo）

## 3. 新人必须掌握的关键模块

### 3.1 代码生成主流程（最优先）

前端在 Demo 页面发起生成请求，后端在 `/api/generate` 做这些事：

- 读取 `prompt` + `provider`（`openai` / `zhipu`）；
- 对登录用户检查是否超过当月额度（`check_usage_available`）；
- 调模型生成代码并做 markdown code fence 清理；
- 对登录用户累计使用量（`increment_usage`）；
- 返回 `code` + `provider` + `timestamp`。

为什么这块优先：它是产品最核心的业务闭环，UI、AI、权限与计费都在这里交汇。

### 3.2 认证与会话（第二优先）

- `/auth` 页面通过 `AuthForm` 走注册/登录；
- Dashboard 布局在服务端检查 `supabase.auth.getUser()`，未登录重定向；
- `middleware.ts` 在请求链路中更新会话，保证 SSR 环境读取用户稳定。

这部分决定了「匿名体验 vs 登录体验」是否正确切换。

### 3.3 用量与套餐（第三优先）

- `UsageQuota` 组件展示本月使用量、剩余天数、升级入口；
- `/api/usage` 提供查询与累加能力；
- Demo/Generate 处会在生成前做额度校验。

这部分是商业化基础，后续做付费闭环时会频繁修改。

### 3.4 历史记录与模板（第四优先）

- `/api/generations` 负责保存和读取生成记录；
- Dashboard 页面展示历史与模板统计。

这部分是留存功能，通常与搜索、标签、收藏、分享需求一起演进。

## 4. 推荐阅读顺序（半天上手版）

1. `PROJECT_SUMMARY.md`（10 分钟，理解产品范围）
2. `src/app/demo/page.tsx`（20 分钟，理解核心页面状态）
3. `src/app/api/generate/route.ts`（20 分钟，理解后端生成闭环）
4. `src/lib/supabase/server.ts` + `src/middleware.ts`（15 分钟，理解认证）
5. `src/app/dashboard/page.tsx` + `src/components/UsageQuota.tsx`（20 分钟，理解数据展示）
6. `supabase-schema.sql`（20 分钟，确认表结构和 RPC）

## 5. 本地开发与联调建议

- 安装依赖：`npm install`
- 启动开发：`npm run dev`
- 基础检查：`npm run lint`

建议准备 `.env.local`（至少）：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `ZHIPU_API_KEY`（可选）

如果只做前端 UI，可先用固定 mock 数据；涉及 API 联调时再接入真实密钥。

## 6. 后续学习路线（按成长阶段）

### 第一阶段：能改需求（1~2 周）

目标：独立完成一个中小功能（例如：历史记录筛选、模板命名优化）

- 熟悉 App Router 下的页面 + API 组织方式
- 能看懂 Demo 页状态切换（输入、加载、错误、结果）
- 能追踪一次请求从组件到 API 再到 Supabase 的链路

### 第二阶段：能做稳定性优化（2~4 周）

目标：提升可维护性和用户体验

- 给关键 API 增加更清晰的错误码/日志
- 统一 loading/error 状态处理
- 补齐类型定义，减少 `any` 和隐式结构

### 第三阶段：能推动业务能力（1~2 个月）

目标：能负责一个完整业务主题（例如：付费、团队协作）

- 用量与套餐：实现更清晰的额度提醒和升级漏斗
- 多模型策略：按成本/速度做 provider 路由策略
- 数据闭环：完善行为埋点与关键漏斗指标

## 7. 给新人的实操建议（非常实用）

- 第一个 PR 选“小而完整”的任务：改一个页面 + 对应一个 API，不要跨太多模块。
- 每次改动前先画链路：入口组件 → 调用 API → 依赖表/RPC → 返回给 UI。
- 对关键流程（生成、登录、保存）优先写“失败场景”自测清单。
- 把 `STATE_MACHINES.md` 当成交互真相源，避免状态分支越改越乱。
- 改完后至少手测三条路径：匿名用户、登录未超额用户、登录超额用户。

---

如果你今天只做一件事：从 `src/app/demo/page.tsx` 读到 `/api/generate`，并在本地成功跑通一次从输入 prompt 到预览渲染的全流程。
