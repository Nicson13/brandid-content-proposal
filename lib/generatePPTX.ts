import type { ProposalData, Topic } from './types'

const C = {
  ink: '1a1a1a',
  white: 'FFFFFF',
  accent: '2D5A3D',
  accentLight: 'E8F0EB',
  accentMid: '4A8C5C',
  paper: 'FAF9F6',
  paper2: 'F2F0EB',
  muted: '888888',
  border: 'D4CFC5',
  goalColors: { '曝光': '3B82F6', '互动': '8B5CF6', '转化': 'D97706' } as Record<string, string>,
  formatColors: { 'Reels': 'DC2626', 'Carousel': '2563EB', 'Graphic Poster': '059669', 'Story': '7C3AED' } as Record<string, string>,
}

function goalColor(goal: string): string { return C.goalColors[goal] || '4A8C5C' }
function formatColor(fmt: string): string { return C.formatColors[fmt] || '4A8C5C' }

export async function generatePPTX(data: ProposalData): Promise<void> {
  const PptxGenJS = (await import('pptxgenjs')).default
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'Brandid'
  pptx.company = 'Brandid Agency'
  pptx.subject = `${data.brandName} 品牌提案`
  pptx.title = `${data.brandName} · Social Media Proposal`

  const W = 13.33
  const H = 7.5
  const lang = data.pptLang || 'zh'

  const s1 = pptx.addSlide()
  s1.background = { color: C.ink }
  s1.addShape('rect', { x: 0, y: 0, w: 0.08, h: H, fill: { color: C.accent } })
  s1.addText(data.brandName || 'Brand Name', { x: 0.6, y: 1.8, w: 7, h: 1.2, fontSize: 52, bold: true, color: C.white, fontFace: 'Arial' })
  s1.addText(data.industry || '', { x: 0.6, y: 3.0, w: 7, h: 0.5, fontSize: 16, color: C.accentMid, fontFace: 'Arial' })
  s1.addText(lang === 'zh' ? '社交媒体内容提案' : 'Social Media Proposal', { x: 0.6, y: 3.6, w: 7, h: 0.6, fontSize: 22, color: 'AAAAAA', fontFace: 'Arial' })
  if (data.period) { s1.addText(data.period, { x: 0.6, y: 4.4, w: 5, h: 0.4, fontSize: 13, color: '666666', fontFace: 'Arial' }) }
  s1.addText('Brandid', { x: W - 2.5, y: H - 0.6, w: 2.2, h: 0.4, fontSize: 13, color: '444444', align: 'right', fontFace: 'Arial' })
  s1.addShape('rect', { x: 9.5, y: 1.5, w: 3.5, h: 4, fill: { color: C.accent, transparency: 85 } })

  const s2 = pptx.addSlide()
  s2.background = { color: C.paper }
  s2.addShape('rect', { x: 0, y: 0, w: W, h: 0.06, fill: { color: C.accent } })
  s2.addText(lang === 'zh' ? '项目概览' : 'Overview', { x: 0.5, y: 0.4, w: 6, h: 0.6, fontSize: 28, bold: true, color: C.ink, fontFace: 'Arial' })
  if (data.summary) { s2.addText(data.summary, { x: 0.5, y: 1.2, w: W - 1, h: 1.6, fontSize: 14, color: C.ink, fontFace: 'Arial', wrap: true, valign: 'top' }) }
  const infoItems = [
    { label: lang === 'zh' ? '服务周期' : 'Period', value: data.period || '—' },
    { label: lang === 'zh' ? '主要平台' : 'Platforms', value: data.platforms || '—' },
    { label: lang === 'zh' ? '月发帖量' : 'Monthly Posts', value: data.postCount ? `${data.postCount} 篇/月` : '—' },
    { label: lang === 'zh' ? '预算范围' : 'Budget', value: data.budget || '—' },
  ]
  infoItems.forEach((item, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 0.5 + col * 6.4
    const y = 3.0 + row * 1.4
    s2.addShape('rect', { x, y, w: 6, h: 1.2, fill: { color: C.accentLight }, line: { color: C.border, width: 0.5 } })
    s2.addText(item.label, { x: x + 0.2, y: y + 0.15, w: 5.6, h: 0.35, fontSize: 10, color: C.muted, fontFace: 'Arial' })
    s2.addText(item.value, { x: x + 0.2, y: y + 0.5, w: 5.6, h: 0.55, fontSize: 16, bold: true, color: C.accent, fontFace: 'Arial' })
  })

  const s3 = pptx.addSlide()
  s3.background = { color: C.paper }
  s3.addShape('rect', { x: 0, y: 0, w: W, h: 0.06, fill: { color: C.accent } })
  s3.addText(lang === 'zh' ? '营销目标 & 受众画像' : 'Goals & Audience', { x: 0.5, y: 0.4, w: 8, h: 0.6, fontSize: 28, bold: true, color: C.ink, fontFace: 'Arial' })
  const goals = [data.goal1, data.goal2].filter(Boolean)
  goals.forEach((goal, i) => {
    const x = 0.5 + i * 6.4
    s3.addShape('rect', { x, y: 1.2, w: 6.0, h: 1.4, fill: { color: C.accent }, line: { color: C.accent, width: 0.5 } })
    s3.addText(lang === 'zh' ? `目标 ${i + 1}` : `Goal ${i + 1}`, { x: x + 0.2, y: 1.3, w: 5.6, h: 0.4, fontSize: 11, color: C.accentLight, fontFace: 'Arial' })
    s3.addText(goal || '', { x: x + 0.2, y: 1.7, w: 5.6, h: 0.7, fontSize: 15, bold: true, color: C.white, fontFace: 'Arial', wrap: true })
  })
  const ratios = [
    { label: lang === 'zh' ? '曝光' : 'Awareness', val: data.ratioAwareness || 40 },
    { label: lang === 'zh' ? '互动' : 'Engagement', val: data.ratioEngagement || 40 },
    { label: lang === 'zh' ? '转化' : 'Lead Gen', val: data.ratioLeadGen || 20 },
  ]
  const barColors = ['3B82F6', '8B5CF6', 'D97706']
  s3.addText(lang === 'zh' ? '内容配比' : 'Content Mix', { x: 0.5, y: 2.9, w: 4, h: 0.4, fontSize: 14, bold: true, color: C.ink, fontFace: 'Arial' })
  ratios.forEach((r, i) => {
    const y = 3.4 + i * 0.7
    const barW = (r.val / 100) * 5.5
    s3.addText(r.label, { x: 0.5, y, w: 1.8, h: 0.5, fontSize: 12, color: C.ink, fontFace: 'Arial' })
    s3.addShape('rect', { x: 2.4, y: y + 0.1, w: 5.5, h: 0.28, fill: { color: 'E8E4DC' } })
    s3.addShape('rect', { x: 2.4, y: y + 0.1, w: Math.max(barW, 0.1), h: 0.28, fill: { color: barColors[i] } })
    s3.addText(`${r.val}%`, { x: 8.2, y, w: 0.8, h: 0.5, fontSize: 12, bold: true, color: barColors[i], fontFace: 'Arial' })
  })
  if (data.personas) {
    s3.addShape('rect', { x: 0.5, y: 5.6, w: W - 1, h: 1.5, fill: { color: C.paper2 }, line: { color: C.border, width: 0.5 } })
    s3.addText(lang === 'zh' ? '目标受众' : 'Target Audience', { x: 0.7, y: 5.7, w: 4, h: 0.35, fontSize: 11, color: C.muted, fontFace: 'Arial' })
    s3.addText(data.personas, { x: 0.7, y: 6.05, w: W - 1.4, h: 0.9, fontSize: 12, color: C.ink, wrap: true, fontFace: 'Arial' })
  }

  const topics = data.topics || []
  const perSlide = 2
  for (let si = 0; si < Math.ceil(topics.length / perSlide); si++) {
    const s = pptx.addSlide()
    s.background = { color: C.paper }
    s.addShape('rect', { x: 0, y: 0, w: W, h: 0.06, fill: { color: C.accent } })
    const sliceStart = si * perSlide
    const pageTopics = topics.slice(sliceStart, sliceStart + perSlide)
    const pageLabel = lang === 'zh' ? `选题方向 ${sliceStart + 1}–${sliceStart + pageTopics.length}` : `Topics ${sliceStart + 1}–${sliceStart + pageTopics.length}`
    s.addText(pageLabel, { x: 0.5, y: 0.25, w: 6, h: 0.5, fontSize: 22, bold: true, color: C.ink, fontFace: 'Arial' })
    pageTopics.forEach((topic: Topic, ti: number) => {
      const col = ti % perSlide
      const cardX = 0.4 + col * 6.5
      const cardY = 0.9
      const cardW = 6.3
      const cardH = 6.1
      s.addShape('rect', { x: cardX, y: cardY, w: cardW, h: cardH, fill: { color: C.white }, line: { color: C.border, width: 0.5 } })
      s.addShape('rect', { x: cardX, y: cardY, w: cardW, h: 0.08, fill: { color: C.accent } })
      s.addText(`#${topic.id || (sliceStart + ti + 1)}`, { x: cardX + 0.2, y: cardY + 0.2, w: 1, h: 0.4, fontSize: 11, color: C.muted, fontFace: 'Arial' })
      const gColor = goalColor(topic.goal)
      s.addShape('rect', { x: cardX + 1.0, y: cardY + 0.2, w: 1.4, h: 0.36, fill: { color: gColor + '22' }, line: { color: gColor, width: 0.5 } })
      s.addText(topic.goal || '', { x: cardX + 1.0, y: cardY + 0.2, w: 1.4, h: 0.36, fontSize: 10, bold: true, color: gColor, align: 'center', valign: 'middle', fontFace: 'Arial' })
      const fColor = formatColor(topic.format)
      s.addShape('rect', { x: cardX + 2.6, y: cardY + 0.2, w: 2.0, h: 0.36, fill: { color: fColor + '22' }, line: { color: fColor, width: 0.5 } })
      s.addText(topic.format || '', { x: cardX + 2.6, y: cardY + 0.2, w: 2.0, h: 0.36, fontSize: 10, bold: true, color: fColor, align: 'center', valign: 'middle', fontFace: 'Arial' })
      s.addText(topic.title || '', { x: cardX + 0.25, y: cardY + 0.72, w: cardW - 0.5, h: 0.9, fontSize: 16, bold: true, color: C.ink, wrap: true, valign: 'top', fontFace: 'Arial' })
      s.addShape('line', { x: cardX + 0.25, y: cardY + 1.7, w: cardW - 0.5, h: 0, line: { color: C.border, width: 0.5 } })
      s.addText(lang === 'zh' ? '受众' : 'Audience', { x: cardX + 0.25, y: cardY + 1.85, w: cardW - 0.5, h: 0.3, fontSize: 9, color: C.muted, fontFace: 'Arial' })
      s.addText(topic.audience || '', { x: cardX + 0.25, y: cardY + 2.15, w: cardW - 0.5, h: 0.5, fontSize: 11, color: C.ink, wrap: true, fontFace: 'Arial' })
      s.addText(lang === 'zh' ? '开场钩子' : 'Hook', { x: cardX + 0.25, y: cardY + 2.75, w: cardW - 0.5, h: 0.3, fontSize: 9, color: C.muted, fontFace: 'Arial' })
      s.addShape('rect', { x: cardX + 0.25, y: cardY + 3.05, w: cardW - 0.5, h: 0.8, fill: { color: C.accentLight } })
      s.addText(topic.hook || '', { x: cardX + 0.4, y: cardY + 3.05, w: cardW - 0.7, h: 0.8, fontSize: 12, color: C.accent, wrap: true, valign: 'middle', fontFace: 'Arial' })
      s.addText(lang === 'zh' ? '文案参考' : 'Caption', { x: cardX + 0.25, y: cardY + 4.0, w: cardW - 0.5, h: 0.3, fontSize: 9, color: C.muted, fontFace: 'Arial' })
      const captionText = (topic.caption || '').length > 180 ? (topic.caption || '').substring(0, 180) + '…' : (topic.caption || '')
      s.addText(captionText, { x: cardX + 0.25, y: cardY + 4.3, w: cardW - 0.5, h: 1.5, fontSize: 11, color: '4a4a4a', wrap: true, valign: 'top', fontFace: 'Arial' })
    })
  }

  if (data.toneNote || data.styleNote) {
    const sT = pptx.addSlide()
    sT.background = { color: C.ink }
    sT.addShape('rect', { x: 0, y: 0, w: 0.08, h: H, fill: { color: C.accentMid } })
    sT.addText(lang === 'zh' ? '品牌口吻指南' : 'Tone of Voice', { x: 0.5, y: 0.8, w: W - 1, h: 0.8, fontSize: 34, bold: true, color: C.white, fontFace: 'Arial' })
    if (data.toneNote) { sT.addText(data.toneNote, { x: 0.5, y: 1.9, w: W - 1, h: 2.5, fontSize: 16, color: 'DDDDDD', wrap: true, valign: 'top', fontFace: 'Arial' }) }
    if (data.styleNote) {
      sT.addShape('rect', { x: 0.5, y: 4.6, w: W - 1, h: 1.6, fill: { color: '222222' } })
      sT.addText(lang === 'zh' ? '风格备注' : 'Style Notes', { x: 0.7, y: 4.7, w: 4, h: 0.4, fontSize: 11, color: C.muted, fontFace: 'Arial' })
      sT.addText(data.styleNote, { x: 0.7, y: 5.1, w: W - 1.4, h: 0.9, fontSize: 13, color: 'BBBBBB', wrap: true, fontFace: 'Arial' })
    }
  }

  const sLast = pptx.addSlide()
  sLast.background = { color: C.paper }
  sLast.addShape('rect', { x: 0, y: 0, w: W, h: 0.06, fill: { color: C.accent } })
  sLast.addText(lang === 'zh' ? '下一步行动' : 'Next Steps', { x: 0.5, y: 0.4, w: 8, h: 0.7, fontSize: 32, bold: true, color: C.ink, fontFace: 'Arial' })
  const steps = data.nextSteps && data.nextSteps.length > 0 ? data.nextSteps : [
    lang === 'zh' ? '确认提案方向与修改意见' : 'Confirm proposal direction',
    lang === 'zh' ? '签署合作协议' : 'Sign service agreement',
    lang === 'zh' ? '制作第一批内容素材' : 'Produce first batch of content',
    lang === 'zh' ? '正式上线发布' : 'Launch and publish',
  ]
  steps.forEach((step, i) => {
    const y = 1.4 + i * 1.1
    sLast.addShape('rect', { x: 0.5, y, w: 0.7, h: 0.7, fill: { color: C.accent } })
    sLast.addText(String(i + 1), { x: 0.5, y, w: 0.7, h: 0.7, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle', fontFace: 'Arial' })
    sLast.addText(step, { x: 1.4, y: y + 0.05, w: W - 2, h: 0.6, fontSize: 16, color: C.ink, fontFace: 'Arial', wrap: true })
  })
  sLast.addShape('rect', { x: 0.5, y: H - 1.2, w: W - 1, h: 0.9, fill: { color: C.accentLight } })
  sLast.addText(lang === 'zh' ? '感谢信任 · Brandid' : 'Thank you · Brandid', { x: 0.7, y: H - 1.15, w: W - 1.4, h: 0.4, fontSize: 13, bold: true, color: C.accent, fontFace: 'Arial' })
  sLast.addText('www.brandid.com', { x: 0.7, y: H - 0.8, w: W - 1.4, h: 0.35, fontSize: 12, color: C.muted, fontFace: 'Arial' })

  const filename = (data.fileName || `${data.brandName}_Proposal`).replace(/\s+/g, '_')
  await pptx.writeFile({ fileName: `${filename}.pptx` })
}