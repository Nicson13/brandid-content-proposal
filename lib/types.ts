// BrandDNA JSON（从 BrandDNA Collector 导出）
export interface BrandDNA {
  brandName: string
  industry: string
  brandBackground?: string
  stage?: string
  targetAudience?: string
  competitorAnalysis?: string
  brandPersonality?: string[]
  brandMission?: string
  brandVision?: string
  coreAdvantages?: string
  marketingChannels?: string[]
  provenContentDirections?: string
  primaryGoal?: string
  // Proposal Builder 直接映射字段
  product?: string
  tone?: string
  challenge?: string
  goal1?: string
  goal2?: string
  platforms?: string[]
  personas?: string
  styleNote?: string
  exportedAt?: string
  version?: string
  source?: string
}

// 选题内容 JSON（从 ChatGPT 导入）
export interface Topic {
  id: number
  title: string
  goal: '曝光' | '互动' | '转化' | string
  audience: string
  format: 'Reels' | 'Carousel' | 'Graphic Poster' | 'Story' | string
  hook: string
  caption: string
}

export interface ContentJSON {
  summary?: string
  topics: Topic[]
  toneNote?: string
  nextSteps?: string[]
}

// 提案完整数据（手动填写字段 + 两个 JSON）
export interface ProposalData {
  // ── 客户资料（可从 brand.json 自动填入，也可手动填）──
  brandName: string
  industry: string
  product: string
  tone: string
  challenge: string
  goal1: string
  goal2: string
  period: string
  platforms: string
  personas: string
  postCount: string
  budget: string
  ratioAwareness: number
  ratioEngagement: number
  ratioLeadGen: number
  styleNote: string
  restrictions: string
  specialReq: string
  fileName: string
  pptLang: 'zh' | 'en'

  // ── 内容（从 content.json 导入）──
  summary: string
  topics: Topic[]
  toneNote: string
  nextSteps: string[]
}
