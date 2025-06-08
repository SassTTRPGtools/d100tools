<script setup>
import { ref, h, computed } from 'vue'
import { atkTables, atkOptions, atkSizeTables } from '@/rolemaster/utils/attackTables.js';
import { critTables, critSeverityOptions, critKeyMapping, hitLocationMapping } from '@/rolemaster/utils/critTables.js';
import { message, Modal, Button, Form, Select, Input } from 'ant-design-vue'

const showCheckModal = ref(false)
const checkForm = ref({
  check_method: '絕對檢定',
  difficulty: '+30',
  total: '+0',
})
const checkResult = ref(null)

const checkMethodOptions = [
  { label: '絕對檢定', value: '絕對檢定' },
  { label: '百分比檢定', value: '百分比檢定' },
]
const difficultyOptions = [
  { label: '休閒 (+70)', value: '+70' },
  { label: '輕鬆 (+50)', value: '+50' },
  { label: '常規 (+30)', value: '+30' },
  { label: '簡單 (+20)', value: '+20' },
  { label: '還行 (+10)', value: '+10' },
  { label: '中等 (+0)', value: '+0' },
  { label: '困難 (-10)', value: '-10' },
  { label: '非常難 (-20)', value: '-20' },
  { label: '極其困難 (-30)', value: '-30' },
  { label: '異想天開 (-50)', value: '-50' },
  { label: '難以置信 (-70)', value: '-70' },
  { label: '幾乎不可能 (-100)', value: '-100' },
]

function openCheckModal() {
  showCheckModal.value = true
  checkResult.value = null
}

function parseModifier(str) {
  try {
    // 支援 +10-5+3 這種格式
    return eval(str.replace(/[^-+\d]/g, '')) || 0
  } catch {
    return 0
  }
}

// 手動百面骰擲骰
function rollD100() {
  return Math.floor(Math.random() * 100) + 1
}

function handleCheckRoll(manualD100) {
  const isManual = manualD100 !== undefined && manualD100 !== null && manualD100 !== ''
  const Xroll = isManual ? manualD100 : rollD100()
  let total_number = 0
  let total_string = ''
  let total_string_css = ''
  let result_string = ''
  const html_total = checkForm.value.total || '+0'
  const html_check_method = checkForm.value.check_method
  const html_difficulty = checkForm.value.difficulty
  const diffNum = parseInt(html_difficulty)
  const modNum = parseModifier(html_total)

  if (!isManual && Xroll <= 5) {
    const RExplode = rollD100()
    total_number = Xroll - RExplode + diffNum + modNum
    total_string = `${Xroll}(擲骰)-${RExplode}(擲骰)${html_difficulty}(難度)${html_total}(修改)`
    total_string_css = 'color:red;'
    checkResult.value = getCheckResult(Xroll, total_number, total_string, total_string_css, html_check_method)
    return
  } else if (!isManual && Xroll >= 96) {
    const RExplode = rollD100()
    total_number = Xroll + RExplode + diffNum + modNum
    total_string = `${Xroll}(擲骰)+${RExplode}(擲骰)${html_difficulty}(難度)${html_total}(修改)`
    total_string_css = 'color:green;'
    checkResult.value = getCheckResult(Xroll, total_number, total_string, total_string_css, html_check_method)
    return
  } else {
    total_number = Xroll + diffNum + modNum
    total_string = isManual
      ? `${Xroll}(手動)${html_difficulty}(難度)${html_total}(修改)`
      : `${Xroll}(擲骰)${html_difficulty}(難度)${html_total}(修改)`
    checkResult.value = getCheckResult(Xroll, total_number, total_string, '', html_check_method)
  }
}

function getCheckResult(Xroll, total_number, total_string, total_string_css, html_check_method) {
  let result_string = ''
  if (html_check_method !== '百分比檢定') {
    if (total_number < 1) {
      result_string = '絕對失敗'
    } else if (total_number <= 75) {
      result_string = '失敗'
    } else if (total_number <= 100) {
      result_string = '部份成功'
    } else if (total_number <= 175) {
      result_string = '成功'
    } else if (total_number > 175) {
      result_string = '絕對成功'
    }
    if (Xroll === 66) {
      result_string += ' (異常事件)'
    } else if (Xroll === 33 || Xroll === 77) {
      result_string += ' (檢查損壞檢定)'
    }
  } else {
    if (total_number <= -100) {
      result_string = 'E 嚴重度，查看相應重擊表'
    } else if (total_number <= -80) {
      result_string = 'D 嚴重度，查看相應重擊表'
    } else if (total_number <= -60) {
      result_string = 'C 嚴重度，查看相應重擊表'
    } else if (total_number <= -40) {
      result_string = 'B 嚴重度，查看相應重擊表'
    } else if (total_number <= -20) {
      result_string = 'A 嚴重度，查看相應重擊表'
    } else if (total_number <= 0) {
      result_string = '行動失敗'
    } else if (total_number <= 10) {
      result_string = '5% 進展'
    } else if (total_number <= 20) {
      result_string = '10% 進展'
    } else if (total_number <= 30) {
      result_string = '20% 進展'
    } else if (total_number <= 40) {
      result_string = '30% 進展'
    } else if (total_number <= 50) {
      result_string = '40% 進展'
    } else if (total_number <= 60) {
      result_string = '50% 進展'
    } else if (total_number <= 70) {
      result_string = '60% 進展'
    } else if (total_number <= 80) {
      result_string = '70% 進展'
    } else if (total_number <= 90) {
      result_string = '80% 進展'
    } else if (total_number <= 100) {
      result_string = '90% 進展'
    } else if (total_number <= 130) {
      result_string = '100% 進展'
    } else if (total_number <= 160) {
      result_string = '110% 進展'
    } else if (total_number <= 190) {
      result_string = '120% 進展'
    } else if (total_number <= 220) {
      result_string = '130% 進展'
    } else if (total_number <= 250) {
      result_string = '140% 進展'
    } else if (total_number <= 280) {
      result_string = '150% 進展'
    } else if (total_number > 280) {
      result_string = '卓越進展'
    }
  }
  return {
    check_method: html_check_method,
    total_string,
    total_string_css,
    total_number,
    result_string,
  }
}
// ===== 攻擊功能 =====
const showAttackModal = ref(false)
const attackForm = ref({
  category: atkOptions[0].category,
  subCategory: atkOptions[0].options[0].value,
  attackerSize: 'Medium',
  AT: 1,
  targetSize: 'Medium',
  critAdjustment: 0,
  total: '+0',
  cri_total: '+0',
  commonOBMod: [], // 通用
  meleeOBMod: [],  // 僅近戰
  stanceOBMod: [], // 站位
  rangedOBMod: [], // 遠程
  hitLocationMod: '+0',
  restrictedQuartersMod: '+0',
  rangeMod: '+0',
})
const attackResult = ref(null)

const hitLocationOptions = [
  { label: '不瞄準(+0)', value: '+0' },
  { label: '簡單(-10)', value: '-10' },
  { label: '普通(-25)', value: '-25' },
  { label: '很難(-50)', value: '-50' },
]
const restrictedQuartersOptions = [
  { label: '不影響(+0)', value: '+0' },
  { label: '靠近(-25)', value: '-25' },
  { label: '狹窄(-50)', value: '-50' },
  { label: '緊密(-75)', value: '-75' },
  { label: '貼合(-100)', value: '-100' },
]
const rangeOptions = [
  { label: '抵近[10](+20)', value: '+20' },
  { label: '短[x1射程](+0)', value: '+0' },
  { label: '中[x2射程](-10)', value: '-10' },
  { label: '遠[x3射程](-25)', value: '-25' },
  { label: '極遠[x4射程](-50)', value: '-50' },
  { label: '極限[x5射程](-100)', value: '-100' },
]
const OBModOptions = [
  { label: '副手(-20)', value: -20 },
  { label: '位於高地(+10)', value: 10 },
  { label: '敵人眩暈(+20)', value: 20 },
  { label: '*突襲敵人(+25)', value: 25 },
  { label: '處於伏地(-50)', value: -50 },
  { label: '目標伏地(+30)', value: 30 },
  { label: '使用2-H武器(+10)', value: 10 },
  { label: '從側翼攻擊(+15)', value: 15 },
  { label: '*從後方攻擊(+35)', value: 35 },
  { label: '攻擊側翼(-30)', value: -30 },
  { label: '攻擊後方(-70)', value: -70 },
  { label: '伏地目標(-30)', value: -30 },
  { label: '處於敵人近戰內(-20)', value: -20 },
]

function openAttackModal() {
  showAttackModal.value = true
  attackResult.value = null
  // reset form
  attackForm.value = {
    category: atkOptions[0].category,
    subCategory: atkOptions[0].options[0].value,
    attackerSize: 'Medium',
    AT: 1,
    targetSize: 'Medium',
    critAdjustment: 0,
    total: '+0',
    cri_total: '+0',
    commonOBMod: [],
    meleeOBMod: [],
    stanceOBMod: [],
    rangedOBMod: [],
    hitLocationMod: '+0',
    restrictedQuartersMod: '+0',
    rangeMod: '+0',
  }
}

function getSizeDifference(attackerSize, targetSize) {
  const keys = Object.keys(atkSizeTables)
  return keys.indexOf(attackerSize) - keys.indexOf(targetSize)
}
function getMultiplier(attackerSize, targetSize) {
  const keys = Object.keys(atkSizeTables)
  const baseIndex = keys.indexOf('Medium')
  let newIndex = baseIndex + getSizeDifference(attackerSize, targetSize)
  if (newIndex < 0) newIndex = 0
  if (newIndex >= keys.length) newIndex = keys.length - 1
  const newSize = keys[newIndex]
  return atkSizeTables[newSize].multiplier
}
function getAttackOutcome(attackType, atValue, attackRoll, attackerSize, targetSize, critAdjustment) {
  const table = atkTables[attackType]
  if (!table) return '無效的攻擊類型'
  const ranges = Object.keys(table[atValue]).map(range => range.split('-').map(Number))
  const minRange = Math.min(...ranges.map(range => range[0]))
  const maxRange = Math.max(...ranges.map(range => range[1]))
  if (attackRoll < minRange) attackRoll = minRange
  if (attackRoll > maxRange) attackRoll = maxRange
  const row = Object.entries(table[atValue]).find(([range]) => {
    const [min, max] = range.split('-').map(Number)
    return min <= attackRoll && max >= attackRoll
  })
  if (!row) return '無結果'
  const severityMap = critSeverityOptions.map(option => option.value)
  const sizeAdjustment = getSizeDifference(attackerSize, targetSize)
  let description = row[1]
  let numericValue = parseFloat(description)
  const newValue = Math.ceil(numericValue * getMultiplier(attackerSize, targetSize))
  description = description.replace(numericValue, newValue)
  let descriptionLetter = description.slice(-2, -1)
  let currentlyIndex = severityMap.indexOf(descriptionLetter)
  let newIndex = severityMap.indexOf(descriptionLetter)
  newIndex += sizeAdjustment + critAdjustment
  if (newIndex < 0) newIndex = 0
  if (newIndex > 10) newIndex = 10
  return description.replace(severityMap[currentlyIndex], severityMap[newIndex])
}
function getCritOutcome(critResult, attackOutcome) {
  if (!isNaN(attackOutcome)) return '無重擊結果'
  const critType = attackOutcome.slice(-2, -1)
  const critTableKey = attackOutcome.slice(-1)
  const critTable = critKeyMapping[critTableKey]
  if (!critTable) return '無效的重擊表'
  const severityLevels = critSeverityOptions.find(option => option.value === critType).label.split('+')
  const critOutcomes = severityLevels.map(level => {
    let _level = (level === 'Z') ? 'A' : level
    let critData = critTable[_level]
    let critRow = critData.find(row => row.min <= critResult && row.max >= critResult)
    return critRow ? `${level}: ${critRow.description}` : `${level}: 無結果`
  })
  return critOutcomes.join('🔷')
}

function handleAttackRoll(manualAttackD100, manualCritD100) {
  const isManualAtk = manualAttackD100 !== undefined && manualAttackD100 !== null && manualAttackD100 !== ''
  const isManualCrit = manualCritD100 !== undefined && manualCritD100 !== null && manualCritD100 !== ''
  const Xroll = isManualAtk ? manualAttackD100 : rollD100()
  let total_number = 0
  let total_string = ''
  let total_string_css = ''
  let result_string = ''
  const html_total = attackForm.value.total || '+0'
  // 各區域的加總
  const commonSum = attackForm.value.commonOBMod.reduce((sum, v) => sum + Number(v), 0)
  const meleeSum = attackForm.value.meleeOBMod.reduce((sum, v) => sum + Number(v), 0)
  const stanceSum = attackForm.value.stanceOBMod.reduce((sum, v) => sum + Number(v), 0)
  const rangedSum = attackForm.value.rangedOBMod.reduce((sum, v) => sum + Number(v), 0)
  const html_rangeMod = attackForm.value.rangeMod || '+0'
  const html_hitLocationMod = attackForm.value.hitLocationMod || '+0'
  const html_restrictedQuartersMod = attackForm.value.restrictedQuartersMod || '+0'
  const modNum = parseModifier(html_total)
  if (!isManualAtk && Xroll >= 96) {
    const RExplode = rollD100()
    total_number = Xroll + RExplode + modNum + commonSum + meleeSum + stanceSum + rangedSum + parseInt(html_rangeMod) + parseInt(html_hitLocationMod) + parseInt(html_restrictedQuartersMod)
    total_string = `${Xroll}(擲骰)+${RExplode}(擲骰)${html_total}(攻擊)`
    total_string_css = 'color:green;'
  } else {
    total_number = Xroll + modNum + commonSum + meleeSum + stanceSum + rangedSum + parseInt(html_rangeMod) + parseInt(html_hitLocationMod) + parseInt(html_restrictedQuartersMod)
    total_string = isManualAtk
      ? `${Xroll}(手動)${html_total}(攻擊)`
      : `${Xroll}(擲骰)${html_total}(攻擊)`
  }
  if (commonSum !== 0) total_string += `${commonSum > 0 ? '+' : ''}${commonSum}(通用)`
  if (meleeSum !== 0) total_string += `${meleeSum > 0 ? '+' : ''}${meleeSum}(近戰)`
  if (stanceSum !== 0) total_string += `${stanceSum > 0 ? '+' : ''}${stanceSum}(站位)`
  if (rangedSum !== 0) total_string += `${rangedSum > 0 ? '+' : ''}${rangedSum}(遠程)`
  if (parseInt(html_rangeMod) !== 0) total_string += `${html_rangeMod}(射程)`
  if (parseInt(html_hitLocationMod) !== 0) total_string += `${html_hitLocationMod}(部位)`
  if (parseInt(html_restrictedQuartersMod) !== 0) total_string += `${html_restrictedQuartersMod}(受限)`
  // 重擊
  let cri_bouns = 0
  if (total_number >= 180) cri_bouns = Math.floor((total_number - 175) / 5)
  let total_cri_string = ''
  const html_cri_total = attackForm.value.cri_total || '+0'
  const hitroll = isManualCrit ? manualCritD100 : rollD100()
  let hitdice = hitroll + parseModifier(html_cri_total) + cri_bouns
  total_cri_string = isManualCrit
    ? `${hitroll}(手動)${html_cri_total}(修改)+${cri_bouns}(加重攻擊)`
    : `${hitroll}(擲骰)${html_cri_total}(修改)+${cri_bouns}(加重攻擊)`
  const HitLocation = {
    Head: '命中頭部',
    Chest: '命中胸部',
    Abdomen: '命中腹部',
    LegLeft: '命中左腿部',
    LegRight: '命中右腿部',
    ArmLeft: '命中左手臂',
    ArmRight: '命中右手臂',
  }
  hitdice = hitdice >= 100 ? 100 : hitdice
  if (hitdice == 1 || (hitdice >= 16 && hitdice <= 20) || (hitdice >= 81 && hitdice <= 85) || hitdice >= 100) {
    result_string = HitLocation.Head
  } else if ((hitdice >= 2 && hitdice <= 3) || (hitdice >= 21 && hitdice <= 25) || (hitdice >= 76 && hitdice <= 80) || (hitdice >= 98 && hitdice <= 99)) {
    result_string = HitLocation.Chest
  } else if ((hitdice >= 4 && hitdice <= 5) || (hitdice >= 26 && hitdice <= 35) || (hitdice == 66) || (hitdice >= 96 && hitdice <= 97)) {
    result_string = HitLocation.Abdomen
  } else if ((hitdice >= 6 && hitdice <= 10) || (hitdice >= 36 && hitdice <= 45) || (hitdice >= 67 && hitdice <= 75) || (hitdice >= 91 && hitdice <= 95)) {
    result_string = hitdice % 2 == 1 ? HitLocation.LegLeft : HitLocation.LegRight
  } else if ((hitdice >= 11 && hitdice <= 15) || (hitdice >= 46 && hitdice <= 55) || (hitdice >= 56 && hitdice <= 65) || (hitdice >= 86 && hitdice <= 90)) {
    result_string = hitdice % 2 == 1 ? HitLocation.ArmLeft : HitLocation.ArmRight
  }
  if (!isManualAtk && Xroll === 66) {
    result_string += ' (異常事件)'
  } else if (!isManualAtk && (Xroll === 33 || Xroll === 77)) {
    result_string += ' (檢查損壞檢定)'
  }
  if (total_number <= 67) {
    result_string = '完全失誤/除非是範圍法術'
  }
  // ===== 查表組裝完整描述 =====
  let attackOutcome = getAttackOutcome(
    attackForm.value.subCategory,
    attackForm.value.AT,
    total_number,
    attackForm.value.attackerSize,
    attackForm.value.targetSize,
    attackForm.value.critAdjustment
  )
  let critOutcome = getCritOutcome(hitdice, attackOutcome)
  let fullResult = `✊${attackOutcome}🔷${critOutcome}`
  // 命中部位說明
  let locationDesc = result_string
  attackResult.value = {
    total_string,
    total_string_css,
    total_number,
    total_cri_string,
    hitdice,
    result_string: fullResult,
    locationDesc,
  }
}
// 新增：攻擊結果點擊複製（參考 quickCheckTool 的 renderCritOutcomeCell）

function renderAttackResultCell(text, location) {
  return h(
    'span',
    {
      style: { cursor: 'pointer', color: '#2563eb', 'text-decoration': 'underline' },
      title: '點擊複製',
      onClick: () => {
        navigator.clipboard.writeText(text)
        message.success('已複製攻擊結果')
      }
    },
    location ? `${location}｜${text}` : text
  )
}
// ===== 施法功能 =====
const showCastModal = ref(false)
const castForm = ref({
  total: '+0',
})
const castResult = ref(null)

function openCastModal() {
  showCastModal.value = true
  castResult.value = null
  castForm.value = { total: '+0' }
}

function handleCastRoll(manualD100) {
  const isManual = manualD100 !== undefined && manualD100 !== null && manualD100 !== ''
  const Xroll = isManual ? manualD100 : rollD100()
  let total_number = 0
  let total_string = ''
  let total_string_css = ''
  let result_string = ''
  const html_total = castForm.value.total || '+0'
  const modNum = parseModifier(html_total)
  let fail_message = ''

  if (!isManual && Xroll <= 5) {
    const RExplode = rollD100()
    total_number = Xroll - RExplode + modNum
    total_string = `${Xroll}(擲骰)-${RExplode}(擲骰)${html_total}(修改)`
    total_string_css = 'color:red;'
  } else if (!isManual && Xroll >= 96) {
    const RExplode = rollD100()
    total_number = Xroll + RExplode + modNum
    total_string = `${Xroll}(擲骰)+${RExplode}(擲骰)${html_total}(修改)`
    total_string_css = 'color:green;'
  } else {
    total_number = Xroll + modNum
    total_string = isManual
      ? `${Xroll}(手動)${html_total}(修改)`
      : `${Xroll}(擲骰)${html_total}(修改)`
  }

  if (total_number <= 0) {
    result_string = '法術失敗'
    if (modNum < 0) {
      // 額外擲骰
      const fail_r = rollD100()
      let fail_total_number = 0
      let fail_total_string = ''
      let fail_total_string_css = 'color:red;'
      const fail_mod_total = Math.abs(modNum)
      if (fail_r >= 96) {
        const fail_RExplode = rollD100()
        fail_total_number = fail_r + fail_RExplode + fail_mod_total
        fail_total_string = `${fail_r}(擲骰)+${fail_RExplode}(擲骰)+${fail_mod_total}(修改)`
      } else {
        fail_total_number = fail_r + fail_mod_total
        fail_total_string = `${fail_r}(擲骰)+${fail_mod_total}(修改)`
      }
      fail_message = `<hr><strong style=\"${fail_total_string_css}\">過程:${fail_total_string}<br><strong style=\"${fail_total_string_css}font-size:18px;\">總計:${fail_total_number}<br>`
    }
  } else {
    result_string = '法術成功'
  }

  castResult.value = {
    total_string,
    total_string_css,
    total_number,
    result_string,
    fail_message,
  }
}
// ===== 抵抗功能 =====
const showResistModal = ref(false)
const resistForm = ref({
  rr_check: '50',
  total: '+0',
})
const resistResult = ref(null)

function openResistModal() {
  showResistModal.value = true
  resistResult.value = null
  resistForm.value = { rr_check: '50', total: '+0' }
}

function handleResistRoll(manualD100) {
  const isManual = manualD100 !== undefined && manualD100 !== null && manualD100 !== ''
  const Xroll = isManual ? manualD100 : rollD100()
  let total_number = 0
  let total_string = ''
  let total_string_css = ''
  let result_string = ''
  const html_total = resistForm.value.total || '+0'
  const html_rr_check = resistForm.value.rr_check || '50'
  const modNum = parseModifier(html_total)
  let RExplode = 0

  if (!isManual && Xroll <= 5) {
    RExplode = rollD100()
    total_number = Xroll - RExplode + modNum
    total_string = `${Xroll}(擲骰)-${RExplode}(擲骰)${html_total}(修改)`
    total_string_css = 'color:red;'
  } else if (!isManual && Xroll >= 96) {
    RExplode = rollD100()
    total_number = Xroll + RExplode + modNum
    total_string = `${Xroll}(擲骰)+${RExplode}(擲骰)${html_total}(修改)`
    total_string_css = 'color:green;'
  } else {
    total_number = Xroll + modNum
    total_string = isManual
      ? `${Xroll}(手動)${html_total}(修改)`
      : `${Xroll}(擲骰)${html_total}(修改)`
  }

  const rrDC = parseInt(html_rr_check)
  const compareNumber = Math.abs(total_number - rrDC)

  if (total_number < rrDC) {
    if (compareNumber > 100) {
      result_string = '極端失敗'
    } else if (compareNumber > 50) {
      result_string = '嚴重失敗'
    } else if (compareNumber > 25) {
      result_string = '中等失敗'
    } else if (compareNumber > 0) {
      result_string = '輕微失敗'
    }
  } else {
    result_string = '抵抗成功！'
  }

  resistResult.value = {
    rrDC,
    total_string,
    total_string_css,
    total_number,
    compareNumber,
    result_string,
  }
}
// ====== 新增：手動 D100 欄位 ======
const manual = ref({
  check: '',
  attack: '',
  attackCrit: '',
  cast: '',
  resist: ''
})

const modalBodyStyle = {
  padding: '8px',
  borderRadius: '18px 18px 0 0',
  minHeight: '60vh',
  background: '#fff',
  boxSizing: 'border-box',
}
// ====== 新增：神諭問答功能 ======
const showOracleModal = ref(false)
const oracleForm = ref({
  chance: '50/50',
  chaos: 5,
  manualRoll: '',
})
const oracleResult = ref(null)

const oracleChanceOptions = [
  { label: '確定', value: '確定' },
  { label: '幾乎確定', value: '幾乎確定' },
  { label: '非常可能', value: '非常可能' },
  { label: '有可能', value: '有可能' },
  { label: '50/50', value: '50/50' },
  { label: '不太可能', value: '不太可能' },
  { label: '非常不可能', value: '非常不可能' },
  { label: '幾乎不可能', value: '幾乎不可能' },
  { label: '不可能', value: '不可能' },
]
const oracleChaosOptions = Array.from({ length: 9 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }))

// 命運表資料（左,中,右）
const oracleTable = {
  '確定':      [[10,50,91],[13,65,94],[15,75,96],[17,85,98],[18,90,99],[19,95,100],[20,99,null],[20,99,null],[20,99,null]],
  '幾乎確定': [[7,35,88],[10,50,91],[13,65,94],[15,75,96],[17,85,98],[18,90,99],[19,95,100],[20,99,null],[20,99,null]],
  '非常可能': [[5,25,86],[7,35,88],[10,50,91],[13,65,94],[15,75,96],[17,85,98],[18,90,99],[19,95,100],[20,99,null]],
  '有可能':   [[3,15,84],[5,25,86],[7,35,88],[10,50,91],[13,65,94],[15,75,96],[17,85,98],[18,90,99],[19,95,100]],
  '50/50':    [[2,10,83],[3,15,84],[5,25,86],[7,35,88],[10,50,91],[13,65,94],[15,75,96],[17,85,98],[18,90,99]],
  '不太可能':[[1,5,82],[2,10,83],[3,15,84],[5,25,86],[7,35,88],[10,50,91],[13,65,94],[15,75,96],[17,85,98]],
  '非常不可能':[[null,1,81],[1,5,82],[2,10,83],[3,15,84],[5,25,86],[7,35,88],[10,50,91],[13,65,94],[15,75,96]],
  '幾乎不可能':[[null,1,81],[null,1,81],[1,5,82],[2,10,83],[3,15,84],[5,25,86],[7,35,88],[10,50,91],[13,65,94]],
  '不可能':   [[null,1,81],[null,1,81],[null,1,81],[1,5,82],[2,10,83],[3,15,84],[5,25,86],[7,35,88],[10,50,91]],
}

function openOracleModal() {
  showOracleModal.value = true
  oracleResult.value = null
  oracleForm.value = { chance: '50/50', chaos: 5, manualRoll: '' }
}

function handleOracleRoll(manual) {
  const chanceIdx = oracleChanceOptions.findIndex(opt => opt.value === oracleForm.value.chance)
  const chaosIdx = Number(oracleForm.value.chaos) - 1
  const [left, mid, right] = oracleTable[oracleForm.value.chance][chaosIdx]
  let roll = manual ? Number(oracleForm.value.manualRoll) : rollD100()
  let result = ''
  if (isNaN(roll) || roll < 1 || roll > 100) {
    oracleResult.value = { roll: '', result: '請輸入1~100的數字或點擊擲骰' }
    return
  }
  if (left !== null && roll <= left) result = `例外的是（${roll} ≤ ${left}）`
  else if (mid !== null && roll <= mid) result = `是（${left+1}~${mid}）`
  else if (right !== null && roll > right) result = `例外的否（${roll} > ${right}）`
  else result = `否（${mid+1}~${right}）`
  oracleResult.value = { roll, left, mid, right, result }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="flex flex-col items-center gap-[10px] w-full max-w-[480px] mx-auto">
      <a-button block type="primary" size="large" class="w-full max-w-full text-xl h-14 rounded-lg" @click="openCheckModal">檢定</a-button>
      <a-button block type="primary" size="large" class="w-full max-w-full text-xl h-14 rounded-lg" @click="openAttackModal">攻擊</a-button>
      <a-button block type="primary" size="large" class="w-full max-w-full text-xl h-14 rounded-lg" @click="openCastModal">施法</a-button>
      <a-button block type="primary" size="large" class="w-full max-w-full text-xl h-14 rounded-lg" @click="openResistModal">抵抗</a-button>
      <a-button block type="primary" size="large" class="w-full max-w-full text-xl h-14 rounded-lg" @click="openOracleModal">神諭問答</a-button>
    </div>
    <!-- 檢定 Modal -->
    <a-modal v-model:open="showCheckModal" title="技能檢定" :footer="null" :centered="true"  :bodyStyle="modalBodyStyle">
      <a-form layout="vertical" @submit.prevent="handleCheckRoll()">
        <a-form-item label="檢定類型">
          <a-select v-model:value="checkForm.check_method" :options="checkMethodOptions" />
        </a-form-item>
        <a-form-item label="難度">
          <a-select v-model:value="checkForm.difficulty" :options="difficultyOptions" />
        </a-form-item>
        <a-form-item label="修改（填上每個±）">
          <a-input v-model:value="checkForm.total" placeholder="+0" />
        </a-form-item>
        <div class="flex mt-2">
          <a-button type="primary" @click="handleCheckRoll()">擲骰</a-button>
        </div>
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex gap-2">
            <a-input v-model:value="manual.check" placeholder="手動 D100" style="width:100px" />
            <a-button @click="handleCheckRoll(Number(manual.check) || undefined)">手動擲骰</a-button>
          </div>
        </div>
      </a-form>
      <div v-if="checkResult" class="mt-4 text-center">
        <div>檢定類型: {{ checkResult.check_method }}</div>
        <div :style="checkResult.total_string_css">過程: {{ checkResult.total_string }}</div>
        <div>總計: {{ checkResult.total_number }}</div>
        <hr>
        <div class="font-bold text-lg">結果: {{ checkResult.result_string }}</div>
      </div>
    </a-modal>
    <!-- 攻擊 Modal -->
    <a-modal v-model:open="showAttackModal" title="攻擊檢定" :footer="null" :centered="true"  :bodyStyle="modalBodyStyle">
      <a-form layout="vertical" @submit.prevent="handleAttackRoll()">
        <!-- 參數選擇區塊：大分類到重擊微調，label 與 select 同行，使用淺藍底色 -->
        <div class="flex flex-col gap-2 mb-2 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div class="flex flex-wrap gap-2">
            <div class="flex items-center gap-2 w-full md:w-1/2">
              <label class="whitespace-nowrap font-bold">大分類</label>
              <a-select v-model:value="attackForm.category" class="flex-1 min-w-[100px]">
                <a-select-option v-for="option in atkOptions" :key="option.category" :value="option.category">
                  {{ option.category }}
                </a-select-option>
              </a-select>
            </div>
            <div class="flex items-center gap-2 w-full md:w-1/2">
              <label class="whitespace-nowrap font-bold">小分類</label>
              <a-select v-model:value="attackForm.subCategory" class="flex-1 min-w-[100px]">
                <a-select-option v-for="option in (atkOptions.find(o=>o.category===attackForm.category)?.options||[])" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <div class="flex items-center gap-2 w-full md:w-1/3">
              <label class="whitespace-nowrap font-bold">攻擊者</label>
              <a-select v-model:value="attackForm.attackerSize" class="flex-1 min-w-[80px]">
                <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
                  {{ size.label }}
                </a-select-option>
              </a-select>
            </div>
            <div class="flex items-center gap-2 w-full md:w-1/3">
              <label class="whitespace-nowrap font-bold">AT</label>
              <a-select v-model:value="attackForm.AT" class="flex-1 min-w-[60px]">
                <a-select-option v-for="n in 10" :key="n" :value="n">{{ n }}</a-select-option>
              </a-select>
            </div>
            <div class="flex items-center gap-2 w-full md:w-1/3">
              <label class="whitespace-nowrap font-bold">目標</label>
              <a-select v-model:value="attackForm.targetSize" class="flex-1 min-w-[80px]">
                <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
                  {{ size.label }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full md:w-1/2">
            <label class="whitespace-nowrap font-bold">重擊微調</label>
            <a-select v-model:value="attackForm.critAdjustment" class="flex-1 min-w-[60px]">
              <a-select-option v-for="n in 11" :key="6-n" :value="6-n">{{ 6-n >= 0 ? `+${6-n}` : 6-n }}</a-select-option>
            </a-select>
          </div>
        </div>
        <!-- 攻擊與重擊合併為同一黃色底色區塊，同行顯示 -->
        <div class="flex flex-col md:flex-row gap-2 mb-2 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div class="flex items-center gap-2 flex-1">
            <label class="whitespace-nowrap font-bold">攻擊（填上每個±）</label>
            <a-input v-model:value="attackForm.total" placeholder="+0" class="flex-1 min-w-[80px]" />
          </div>
          <div class="flex items-center gap-2 flex-1">
            <label class="whitespace-nowrap font-bold">重擊（填上每個±）</label>
            <a-input v-model:value="attackForm.cri_total" placeholder="+0" class="flex-1 min-w-[80px]" />
          </div>
        </div>
        <!-- 分組區塊：每組單獨一欄，標題明顯 -->
        <div class="font-bold bg-gray-200 text-gray-800 py-1 px-3 rounded-lg my-4 text-lg">通用修改</div>
        <div class="bg-gray-100 rounded-lg p-3 mb-2 flex flex-col gap-2">
          <a-checkbox-group v-model:value="attackForm.commonOBMod" class="flex flex-wrap gap-2">
            <a-checkbox :value="-20" class="w-1/2 m-0 text-lg py-1">副手(-20)</a-checkbox>
            <a-checkbox :value="10" class="w-1/2 m-0 text-lg py-1">位於高地(+10)</a-checkbox>
            <a-checkbox :value="20" class="w-1/2 m-0 text-lg py-1">敵人眩暈(+20)</a-checkbox>
            <a-checkbox :value="25" class="w-1/2 m-0 text-lg py-1">*突襲敵人(+25)</a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="font-bold bg-gray-200 text-gray-800 py-1 px-3 rounded-lg my-4 text-lg">瞄準/受限</div>
        <div class="bg-gray-100 rounded-lg p-3 mb-2 flex gap-2">
          <div class="flex-1 min-w-[120px]">
            <label class="block font-bold">瞄準部位</label>
            <a-select v-model:value="attackForm.hitLocationMod" :options="hitLocationOptions" class="w-full" />
          </div>
          <div class="flex-1 min-w-[120px]">
            <label class="block font-bold">受限戰鬥</label>
            <a-select v-model:value="attackForm.restrictedQuartersMod" :options="restrictedQuartersOptions" class="w-full" />
          </div>
        </div>
        <div class="font-bold bg-gray-200 text-gray-800 py-1 px-3 rounded-lg my-4 text-lg">近戰修改</div>
        <div class="bg-gray-100 rounded-lg p-3 mb-2 flex flex-col gap-2">
          <label class="block font-bold">僅近戰</label>
          <a-checkbox-group v-model:value="attackForm.meleeOBMod" class="flex flex-wrap gap-2">
            <a-checkbox :value="-50" class="w-1/2 m-0 text-lg py-1">處於伏地(-50)</a-checkbox>
            <a-checkbox :value="30" class="w-1/2 m-0 text-lg py-1">目標伏地(+30)</a-checkbox>
            <a-checkbox :value="10" class="w-1/2 m-0 text-lg py-1">使用2-H武器(+10)</a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="bg-gray-100 rounded-lg p-3 mb-2 flex flex-col gap-2">
          <label class="block font-bold">站位</label>
          <a-checkbox-group v-model:value="attackForm.stanceOBMod" class="flex flex-wrap gap-2">
            <a-checkbox :value="15" class="w-1/2 m-0 text-lg py-1">從側翼攻擊(+15)</a-checkbox>
            <a-checkbox :value="35" class="w-1/2 m-0 text-lg py-1">*從後方攻擊(+35)</a-checkbox>
            <a-checkbox :value="-30" class="w-1/2 m-0 text-lg py-1">攻擊側翼(-30)</a-checkbox>
            <a-checkbox :value="-70" class="w-1/2 m-0 text-lg py-1">攻擊後方(-70)</a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="font-bold bg-gray-200 text-gray-800 py-1 px-3 rounded-lg my-4 text-lg">遠程修改</div>
        <div class="bg-gray-100 rounded-lg p-3 mb-2 flex flex-col gap-2">
          <label class="block font-bold">目標狀態</label>
          <a-checkbox-group v-model:value="attackForm.rangedOBMod" class="flex flex-wrap gap-2">
            <a-checkbox :value="-30" class="w-1/2 m-0 text-lg py-1">伏地目標(-30)</a-checkbox>
            <a-checkbox :value="-20" class="w-1/2 m-0 text-lg py-1">處於敵人近戰內(-20)</a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="bg-gray-100 rounded-lg p-3 mb-2 flex flex-col gap-2">
          <label class="block font-bold">射程</label>
          <a-select v-model:value="attackForm.rangeMod" :options="rangeOptions" class="w-full" />
        </div>
        <a-card class="text-sm p-2 mb-3">
          *措手不及：攻擊者對目標擁有突襲(+25)及從後方攻擊(+35)的好處
        </a-card>
        <div class="flex gap-2 mt-2">
          <a-button type="primary" @click="handleAttackRoll()" block size="large">擲骰</a-button>
        </div>
        <div class="flex gap-2 mt-2">
          <a-input v-model:value="manual.attack" placeholder="手動攻擊 D100" class="w-[110px]" />
          <a-input v-model:value="manual.attackCrit" placeholder="手動重擊 D100" class="w-[110px]" />
          <a-button @click="handleAttackRoll(Number(manual.attack) || undefined, Number(manual.attackCrit) || undefined)" size="large">手動擲骰</a-button>
        </div>
      </a-form>
      <div v-if="attackResult" class="mt-4 text-center">
        <div :style="attackResult.total_string_css">過程: {{ attackResult.total_string }}</div>
        <div>攻擊結果: {{ attackResult.total_number }}</div>
        <hr>
        <div>過程: {{ attackResult.total_cri_string }}</div>
        <div>重擊結果: {{ attackResult.hitdice }}</div>
        <hr>
        <a-card class="text-sm p-2 mb-3">
        ✊+X : X 傷害, 🩸X: 流血 X /輪, 💦 (-X): 疲勞減值, 🛠️ (-X): 損壞檢定, -X: 受傷減值, X 💫 [-xx]: 眩暈 X 輪及減值[-xx], 😵: 失衡, 🌊 X’: 擊退, 👎: 擊倒/伏地, 🕸️: 擒拿 X%, ✴️(X): 額外重擊, 💀: 目標瀕死或被擊敗
        </a-card>
        <div class="font-bold text-lg mt-2">
          <component :is="renderAttackResultCell(attackResult.result_string, attackResult.locationDesc)" />
        </div>
      </div>
    </a-modal>
    <!-- 施法 Modal -->
    <a-modal v-model:open="showCastModal" title="施法檢定" :footer="null" :centered="true"  :bodyStyle="modalBodyStyle">
      <a-form layout="vertical" @submit.prevent="handleCastRoll()">
        <a-form-item label="修改（填上每個±）">
          <a-input v-model:value="castForm.total" placeholder="+0" />
        </a-form-item>
        <div class="flex mt-2">
          <a-button type="primary" @click="handleCastRoll()">擲骰</a-button>
        </div>
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex gap-2">
            <a-input v-model:value="manual.cast" placeholder="手動 D100" style="width:100px" />
            <a-button @click="handleCastRoll(Number(manual.cast) || undefined)">手動擲骰</a-button>
          </div>
        </div>
      </a-form>
      <div v-if="castResult" class="mt-4 text-center">
        <div :style="castResult.total_string_css">過程: {{ castResult.total_string }}</div>
        <div>總計: {{ castResult.total_number }}</div>
        <hr>
        <div class="font-bold text-lg">結果: {{ castResult.result_string }}</div>
        <div v-if="castResult.fail_message" v-html="castResult.fail_message"></div>
      </div>
    </a-modal>
    <!-- 抵抗 Modal -->
    <a-modal v-model:open="showResistModal" title="抵抗檢定" :footer="null" :centered="true"  :bodyStyle="modalBodyStyle">
      <a-form layout="vertical" @submit.prevent="handleResistRoll()">
        <a-form-item label="RR DC（預設50）">
          <a-input v-model:value="resistForm.rr_check" placeholder="50" />
        </a-form-item>
        <a-form-item label="修改（填上每個±）">
          <a-input v-model:value="resistForm.total" placeholder="+0" />
        </a-form-item>
        <div class="flex mt-2">
          <a-button type="primary" @click="handleResistRoll()">擲骰</a-button>
        </div>
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex gap-2">
            <a-input v-model:value="manual.resist" placeholder="手動 D100" style="width:100px" />
            <a-button @click="handleResistRoll(Number(manual.resist) || undefined)">手動擲骰</a-button>
          </div>
        </div>
      </a-form>
      <div v-if="resistResult" class="mt-4 text-center">
        <div>RR DC: {{ resistResult.rrDC }}</div>
        <div :style="resistResult.total_string_css">過程: {{ resistResult.total_string }}</div>
        <div>差額比較: {{ resistResult.total_number }} vs. {{ resistResult.rrDC }} = {{ resistResult.compareNumber }}</div>
        <hr>
        <div class="font-bold text-lg">結果: {{ resistResult.result_string }}</div>
      </div>
    </a-modal>
    <!-- 神諭問答 Modal -->
    <a-modal v-model:open="showOracleModal" title="神諭問答" :footer="null" :centered="true"  :bodyStyle="modalBodyStyle">
      <a-form layout="vertical" @submit.prevent="handleOracleRoll()">
        <a-form-item label="機率">
          <a-select v-model:value="oracleForm.chance" :options="oracleChanceOptions" />
        </a-form-item>
        <a-form-item label="混沌值">
          <a-slider v-model:value="oracleForm.chaos" :min="1" :max="9" :marks="{1:'1',5:'5',9:'9'}" />
        </a-form-item>
        <div class="flex mt-2">
          <a-button type="primary" @click="handleOracleRoll()">擲骰</a-button>
        </div>
      </a-form>
      <div v-if="oracleResult" class="mt-4 text-center">        
        <div class="flex items-end justify-center gap-1 mt-2">
          <span class="text-base text-gray-400">{{ oracleResult.left }}</span>
          <span class="text-4xl font-bold text-gray-700">{{ oracleResult.mid }}</span>
          <span class="text-base text-gray-400">{{ oracleResult.right }}</span>
        </div>
        <div :class=" [
          'font-bold text-lg mt-2',
          oracleResult.result.includes('否') ? 'text-red-600' : '',
          oracleResult.result.includes('是') ? 'text-green-600' : ''
        ]">
          結果: {{ oracleResult.result }}：{{ oracleResult.roll}}
        </div>
      </div>
    </a-modal>
  </div>
</template>