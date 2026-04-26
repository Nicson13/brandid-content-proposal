# Brandid · Proposal Builder

纯排版导出工具 — 不调用任何 LLM API，所有处理在浏览器本地完成。

## 功能
- 导入 `brand.json`（来自 BrandDNA Collector）→ 自动填入客户资料
- 导入 `content.json`（来自 ChatGPT 标准 Prompt）→ 自动加载选题内容
- 预览提案内容
- 一键导出 `.pptx` 文件

## 数据流
```
BrandDNA Collector → brand.json
                              ↓
ChatGPT (标准 Prompt) → content.json
                              ↓
         Proposal Builder（导入两个 JSON）
                              ↓
                    导出 proposal.pptx
```

## 本地开发

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

## 部署到 Vercel（免费）

### 方式一：GitHub + Vercel 自动部署（推荐）

1. 在 GitHub 创建新仓库（如 `brandid-proposal-builder`）
2. 将本项目上传到仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial: Proposal Builder v2 - JSON import, PPTX export"
   git branch -M main
   git remote add origin https://github.com/你的用户名/brandid-proposal-builder.git
   git push -u origin main
   ```
3. 前往 [vercel.com](https://vercel.com) → Import Project → 选择上面的仓库
4. 框架选 **Next.js**，其他保持默认 → Deploy
5. 部署完成后获得 `https://brandid-proposal-builder.vercel.app` 类型的链接

### 方式二：Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

## BrandDNA Collector 部署到 GitHub Pages

1. 在 GitHub 创建仓库 `brandid-tools`
2. 上传 `brand_dna_collector_v2.html`
3. GitHub Settings → Pages → Source 选 main branch
4. 访问 `https://你的用户名.github.io/brandid-tools/brand_dna_collector_v2.html`

## ChatGPT Prompt 使用

见 `CHATGPT_PROMPT_TEMPLATE.md`

## JSON 格式规范

### brand.json（BrandDNA Collector 导出）
```json
{
  "brandName": "品牌名称",
  "industry": "行业",
  "product": "核心产品",
  "tone": "品牌口吻",
  "challenge": "竞品分析",
  "goal1": "核心目标1",
  "goal2": "核心目标2",
  "platforms": ["instagram", "tiktok"],
  "personas": "目标受众描述",
  "styleNote": "风格备注"
}
```

### content.json（ChatGPT 生成）
```json
{
  "summary": "策略概述",
  "topics": [
    {
      "id": 1,
      "title": "选题标题",
      "goal": "曝光",
      "audience": "受众描述",
      "format": "Reels",
      "hook": "开场钩子",
      "caption": "文案参考"
    }
  ],
  "toneNote": "口吻指南",
  "nextSteps": ["步骤1", "步骤2"]
}
```
