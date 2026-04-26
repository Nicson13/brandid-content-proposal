'use client'

import { useState, useRef, useCallback } from 'react'
import type { ProposalData, BrandDNA, ContentJSON, Topic } from '@/lib/types'

// ── Default empty state ──
const defaultData: ProposalData = {
  brandName: '', industry: '', product: '', tone: '', challenge: '',
  goal1: '', goal2: '', period: '', platforms: '', personas: '',
  postCount: '', budget: '',
  ratioAwareness: 40, ratioEngagement: 40, ratioLeadGen: 20,
  styleNote: '', restrictions: '', specialReq: '',
  fileName: '', pptLang: 'zh',
  summary: '', topics: [], toneNote: '', nextSteps: [],
}

// ── Section label helper ──
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0 20px' }}>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #d4cfc5' }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', whiteSpace: 'nowrap' }}>
        {children}
      </span>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #d4cfc5' }} />
    </div>
  )
}

// ── Field component ──
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 4 }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: 12, color: '#888', marginBottom: 6, lineHeight: 1.5 }}>{hint}</p>}
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  border: '1px solid #d4cfc5', borderRadius: 8,
  fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#1a1a1a',
  background: '#faf9f6', outline: 'none', lineHeight: 1.5,
}

// ── Topic card in preview ──
function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const goalColors: Record<string, string> = { '曝光': '#3B82F6', '互动': '#8B5CF6', '转化': '#D97706' }
  const fmtColors: Record<string, string> = { 'Reels': '#DC2626', 'Carousel': '#2563EB', 'Graphic Poster': '#059669', 'Story': '#7C3AED' }
  const gc = goalColors[topic.goal] || '#4A8C5C'
  const fc = fmtColors[topic.format] || '#4A8C5C'

  return (
    <div style={{ background: '#fff', border: '1px solid #d4cfc5', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ height: 4, background: '#2D5A3D' }} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#888' }}>#{topic.id || index + 1}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: gc, background: gc + '18', padding: '2px 10px', borderRadius: 100, border: `1px solid ${gc}` }}>
            {topic.goal}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: fc, background: fc + '18', padding: '2px 10px', borderRadius: 100, border: `1px solid ${fc}` }}>
            {topic.format}
          </span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 8, lineHeight: 1.4 }}>{topic.title}</div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>受众</div>
        <div style={{ fontSize: 13, color: '#4a4a4a', marginBottom: 12 }}>{topic.audience}</div>
        <div style={{ background: '#e8f0eb', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>开场钩子</div>
          <div style={{ fontSize: 13, color: '#2D5A3D', fontStyle: 'italic', lineHeight: 1.6 }}>{topic.hook}</div>
        </div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>文案参考</div>
        <div style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.7 }}>{topic.caption}</div>
      </div>
    </div>
  )
}

// ── JSON drop zone ──
function DropZone({ label, hint, onLoad, accent = '#2D5A3D', loaded = false }: {
  label: string; hint: string; onLoad: (data: unknown) => void; accent?: string; loaded?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        onLoad(json)
      } catch {
        alert('JSON 格式错误，请检查文件内容')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      style={{
        border: `2px dashed ${dragging ? accent : (loaded ? accent : '#d4cfc5')}`,
        borderRadius: 12, padding: '20px 24px', cursor: 'pointer',
        background: loaded ? accent + '08' : (dragging ? accent + '05' : '#faf9f6'),
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 16,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: loaded ? accent : '#f2f0eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {loaded ? '✓' : '📂'}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: loaded ? accent : '#1a1a1a' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{loaded ? '✓ 已加载成功，可在下方确认字段' : hint}</div>
      </div>
      <input ref={ref} type="file" accept=".json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── Main Component ──
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function ProposalBuilder() {
  const [data, setData] = useState<ProposalData>(defaultData)
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form')
  const [brandLoaded, setBrandLoaded] = useState(false)
  const [contentLoaded, setContentLoaded] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState('')

  const upd = useCallback((field: keyof ProposalData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // ── Import brand.json ──
  const importBrand = (raw: unknown) => {
    const b = raw as BrandDNA
    setData(prev => ({
      ...prev,
      brandName: b.brandName || prev.brandName,
      industry: b.industry || prev.industry,
      product: b.product || b.coreAdvantages || prev.product,
      tone: b.tone || (Array.isArray(b.brandPersonality) ? b.brandPersonality.join('、') : '') || prev.tone,
      challenge: b.challenge || b.competitorAnalysis || prev.challenge,
      goal1: b.goal1 || b.primaryGoal || prev.goal1,
      goal2: b.goal2 || b.provenContentDirections || prev.goal2,
      platforms: b.platforms ? (Array.isArray(b.platforms) ? b.platforms.join('、') : String(b.platforms)) : (Array.isArray(b.marketingChannels) ? b.marketingChannels.join('、') : prev.platforms),
      personas: b.personas || b.targetAudience || prev.personas,
      styleNote: b.styleNote || prev.styleNote,
      fileName: b.brandName ? `${b.brandName}_Proposal` : prev.fileName,
    }))
    setBrandLoaded(true)
    showToast('✓ brand.json 已导入，客户资料已自动填入')
  }

  // ── Import content.json ──
  const importContent = (raw: unknown) => {
    const c = raw as ContentJSON
    setData(prev => ({
      ...prev,
      summary: c.summary || prev.summary,
      topics: c.topics || prev.topics,
      toneNote: c.toneNote || prev.toneNote,
      nextSteps: c.nextSteps || prev.nextSteps,
    }))
    setContentLoaded(true)
    showToast(`✓ content.json 已导入，${(c.topics || []).length} 个选题方向已加载`)
  }

  // ── Generate PPTX ──
  const handleGenerate = async () => {
    if (!data.brandName) { alert('请填写品牌名称'); return }
    setGenerating(true)
    try {
      const { generatePPTX } = await import('@/lib/generatePPTX')
      await generatePPTX(data)
      showToast('✓ PPTX 已生成并下载！')
    } catch (err) {
      console.error(err)
      alert('生成失败，请检查控制台错误信息')
    } finally {
      setGenerating(false)
    }
  }

  const completionPct = (() => {
    const fields = [data.brandName, data.industry, data.product, data.tone, data.goal1, data.platforms, data.personas, data.summary]
    const filled = fields.filter(f => String(f || '').trim()).length
    const hasTopics = data.topics.length > 0 ? 1 : 0
    return Math.round(((filled + hasTopics) / 9) * 100)
  })()

  // ── Styles ──
  const S = {
    header: { background: '#1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
    logo: { fontFamily: 'DM Serif Display, serif', color: '#fff', fontSize: 18 } as React.CSSProperties,
    container: { maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' } as React.CSSProperties,
    tab: (active: boolean): React.CSSProperties => ({
      padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
      background: active ? '#2D5A3D' : 'transparent', color: active ? '#fff' : '#888',
      transition: 'all 0.15s',
    }),
    card: { background: '#fff', border: '1px solid #d4cfc5', borderRadius: 14, padding: '24px 28px', marginBottom: 24 } as React.CSSProperties,
    generateBtn: {
      width: '100%', padding: '16px', borderRadius: 12, border: 'none',
      background: generating ? '#888' : '#2D5A3D', color: '#fff',
      fontSize: 16, fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer',
      fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      transition: 'all 0.2s',
    } as React.CSSProperties,
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#faf9f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={S.header}>
        <div style={S.logo}>brand<span style={{ color: '#7ec898' }}>id</span></div>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666' }}>
          Proposal Builder · Pure Layout Export
        </div>
        <div style={{ fontSize: 12, color: '#4A8C5C', fontWeight: 500 }}>
          {completionPct}% 完成
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#e8e4dc' }}>
        <div style={{ height: '100%', background: '#2D5A3D', width: `${completionPct}%`, transition: 'width 0.3s ease' }} />
      </div>

      {/* Tab nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #d4cfc5', padding: '12px 32px', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={S.tab(activeTab === 'form')} onClick={() => setActiveTab('form')}>填写资料</button>
          <button style={S.tab(activeTab === 'preview')} onClick={() => setActiveTab('preview')}>
            预览提案 {data.topics.length > 0 && `(${data.topics.length}个选题)`}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {brandLoaded && <span style={{ fontSize: 11, background: '#e8f0eb', color: '#2D5A3D', padding: '4px 10px', borderRadius: 100, border: '1px solid #4a8c5c' }}>✓ 品牌资料</span>}
          {contentLoaded && <span style={{ fontSize: 11, background: '#e8f0eb', color: '#2D5A3D', padding: '4px 10px', borderRadius: 100, border: '1px solid #4a8c5c' }}>✓ 选题内容</span>}
        </div>
      </div>

      <div style={S.container}>

        {/* ═══ FORM TAB ═══ */}
        {activeTab === 'form' && (
          <>
            {/* Hero */}
            <div style={{ padding: '36px 0 28px' }}>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#1a1a1a', marginBottom: 8, lineHeight: 1.2 }}>
                品牌提案排版导出
              </h1>
              <p style={{ color: '#888', fontSize: 14, maxWidth: 560, lineHeight: 1.6 }}>
                导入两份 JSON 文件（客户资料 + 选题内容），自动填入字段，一键导出 PPTX。<br />
                所有内容均在本地处理，不调用任何 AI API。
              </p>
            </div>

            {/* JSON Import section */}
            <div style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 16 }}>
                Step 1 · 导入 JSON 文件
              </div>
              <DropZone
                label="导入 brand.json（客户品牌资料）"
                hint="从 BrandDNA Collector 导出的 JSON 文件，拖拽或点击选择"
                onLoad={importBrand}
                loaded={brandLoaded}
              />
              <DropZone
                label="导入 content.json（选题内容）"
                hint="从 ChatGPT 按标准 Prompt 生成的选题 JSON 文件，拖拽或点击选择"
                onLoad={importContent}
                loaded={contentLoaded}
              />
            </div>

            {/* Manual form */}
            <div style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 4 }}>
                Step 2 · 确认 / 补充客户资料
              </div>
              <p style={{ fontSize: 12, color: '#aaa', marginBottom: 20, lineHeight: 1.5 }}>
                JSON 导入后会自动填入以下字段。如有需要可手动修改。
              </p>

              <SectionLabel>基础信息</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="品牌名称 *">
                  <input style={inputStyle} value={data.brandName} onChange={e => upd('brandName', e.target.value)} placeholder="清颜护肤" />
                </Field>
                <Field label="行业">
                  <input style={inputStyle} value={data.industry} onChange={e => upd('industry', e.target.value)} placeholder="美妆 / 护肤" />
                </Field>
              </div>
              <Field label="核心产品 / 服务">
                <input style={inputStyle} value={data.product} onChange={e => upd('product', e.target.value)} placeholder="天然植物护肤系列" />
              </Field>
              <Field label="品牌口吻 / 调性">
                <input style={inputStyle} value={data.tone} onChange={e => upd('tone', e.target.value)} placeholder="温暖亲切、专业权威" />
              </Field>

              <SectionLabel>目标与策略</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="核心目标 1">
                  <input style={inputStyle} value={data.goal1} onChange={e => upd('goal1', e.target.value)} placeholder="品牌曝光 / 互动增长" />
                </Field>
                <Field label="核心目标 2">
                  <input style={inputStyle} value={data.goal2} onChange={e => upd('goal2', e.target.value)} placeholder="获客转化" />
                </Field>
                <Field label="服务周期">
                  <input style={inputStyle} value={data.period} onChange={e => upd('period', e.target.value)} placeholder="2024年Q3（3个月）" />
                </Field>
                <Field label="月预算范围">
                  <input style={inputStyle} value={data.budget} onChange={e => upd('budget', e.target.value)} placeholder="RM 8,000 / 月" />
                </Field>
                <Field label="主要平台">
                  <input style={inputStyle} value={data.platforms} onChange={e => upd('platforms', e.target.value)} placeholder="Instagram、TikTok、小红书" />
                </Field>
                <Field label="月发帖量">
                  <input style={inputStyle} value={data.postCount} onChange={e => upd('postCount', e.target.value)} placeholder="12" />
                </Field>
              </div>

              <Field label="目标受众描述">
                <textarea
                  style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                  value={data.personas}
                  onChange={e => upd('personas', e.target.value)}
                  placeholder="25–35岁女性，职场白领，月收入1万+，注重成分，爱刷小红书……"
                />
              </Field>

              <SectionLabel>内容配比</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { key: 'ratioAwareness', label: '曝光 %', color: '#3B82F6' },
                  { key: 'ratioEngagement', label: '互动 %', color: '#8B5CF6' },
                  { key: 'ratioLeadGen', label: '转化 %', color: '#D97706' },
                ].map(item => (
                  <Field key={item.key} label={item.label}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="number" min={0} max={100}
                        style={{ ...inputStyle, width: 80 }}
                        value={data[item.key as keyof ProposalData] as number}
                        onChange={e => upd(item.key as keyof ProposalData, Number(e.target.value))}
                      />
                      <div style={{ flex: 1, height: 8, background: '#e8e4dc', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: item.color, width: `${data[item.key as keyof ProposalData]}%`, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  </Field>
                ))}
              </div>

              <SectionLabel>备注 / 导出设置</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="风格备注">
                  <input style={inputStyle} value={data.styleNote} onChange={e => upd('styleNote', e.target.value)} placeholder="偏向自然色调，避免荧光色系" />
                </Field>
                <Field label="禁忌限制">
                  <input style={inputStyle} value={data.restrictions} onChange={e => upd('restrictions', e.target.value)} placeholder="不可提竞品品牌名称" />
                </Field>
                <Field label="特殊需求">
                  <input style={inputStyle} value={data.specialReq} onChange={e => upd('specialReq', e.target.value)} placeholder="需包含一个KOL合作选题" />
                </Field>
                <Field label="导出文件名">
                  <input style={inputStyle} value={data.fileName} onChange={e => upd('fileName', e.target.value)} placeholder="清颜_Proposal_Q3" />
                </Field>
              </div>

              <Field label="PPT 语言">
                <div style={{ display: 'flex', gap: 12 }}>
                  {(['zh', 'en'] as const).map(lang => (
                    <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#4a4a4a' }}>
                      <input type="radio" name="pptLang" value={lang} checked={data.pptLang === lang} onChange={() => upd('pptLang', lang)} />
                      {lang === 'zh' ? '中文标注' : 'English Labels'}
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            {/* Content JSON preview */}
            {contentLoaded && data.topics.length > 0 && (
              <div style={S.card}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 16 }}>
                  Step 3 · 已导入选题（{data.topics.length} 个）
                </div>
                {data.summary && (
                  <div style={{ background: '#e8f0eb', borderRadius: 10, padding: '14px 18px', marginBottom: 16, fontSize: 14, color: '#2D5A3D', lineHeight: 1.7 }}>
                    {data.summary}
                  </div>
                )}
                {data.topics.map((t, i) => <TopicCard key={t.id || i} topic={t} index={i} />)}
              </div>
            )}

            {/* Generate button */}
            <div style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>
                Step 4 · 导出 PPTX
              </div>
              <p style={{ fontSize: 12, color: '#aaa', marginBottom: 20, lineHeight: 1.5 }}>
                完成填写后点击下方按钮，直接在浏览器中生成并下载 .pptx 文件。<br />
                不需要服务器，不调用任何 API，所有处理在本地完成。
              </p>
              <button style={S.generateBtn} onClick={handleGenerate} disabled={generating}>
                {generating ? (
                  <>⏳ 生成中，请稍候…</>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M10 3v10M7 10l3 3 3-3M4 16h12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    导出 PPTX 提案
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* ═══ PREVIEW TAB ═══ */}
        {activeTab === 'preview' && (
          <div style={{ paddingTop: 32 }}>
            {/* Proposal summary */}
            <div style={{ background: '#1a1a1a', borderRadius: 16, padding: '28px 32px', marginBottom: 24, color: '#fff' }}>
              <div style={{ fontSize: 28, fontFamily: 'DM Serif Display, serif', marginBottom: 4 }}>
                {data.brandName || '（未填写品牌名称）'}
              </div>
              <div style={{ fontSize: 14, color: '#7ec898', marginBottom: 16 }}>{data.industry}</div>
              {data.summary && (
                <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7, maxWidth: 640 }}>{data.summary}</p>
              )}
              <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
                {[
                  { label: '周期', value: data.period },
                  { label: '平台', value: data.platforms },
                  { label: '月帖', value: data.postCount ? `${data.postCount}篇` : '' },
                  { label: '预算', value: data.budget },
                  { label: '选题', value: data.topics.length ? `${data.topics.length}个` : '' },
                ].filter(i => i.value).map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics */}
            {data.topics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <div style={{ fontSize: 16, marginBottom: 8 }}>尚未导入选题内容</div>
                <div style={{ fontSize: 13 }}>请在「填写资料」页面导入 content.json</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>
                  选题方向（{data.topics.length} 个）
                </div>
                {data.topics.map((t, i) => <TopicCard key={t.id || i} topic={t} index={i} />)}
              </>
            )}

            {/* Next steps */}
            {data.nextSteps.length > 0 && (
              <div style={{ ...S.card, marginTop: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>下一步行动</div>
                {data.nextSteps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, background: '#2D5A3D', borderRadius: 6, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: 14, color: '#4a4a4a', lineHeight: 1.6, paddingTop: 4 }}>{step}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Generate from preview */}
            <div style={{ marginTop: 24 }}>
              <button style={S.generateBtn} onClick={handleGenerate} disabled={generating}>
                {generating ? '⏳ 生成中…' : '导出 PPTX 提案'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28,
          background: '#2D5A3D', color: '#fff',
          padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 1000,
          animation: 'none',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
