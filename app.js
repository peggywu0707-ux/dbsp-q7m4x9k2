const TWD = new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 });
const INT = new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 });

const state = {
  preset: 'complete',
  biobankN: 60,
  duN: 15,
  booN: 15,
  effectSize: 1.06,
  alpha: 0.05,
  boxesPerBasket: 4,
  reserveRate: 10,
  controls: { urine16s: 14, vagina16s: 10, urineShotgun: 4, vaginaShotgun: 4 },
  enabled: {},
  editedCosts: {}
};

const nodes = [
  {
    id: 'u-clinical', branch: 'urine', code: 'U-CLIN', title: '臨床品質控制 aliquot', stage: 'core', critical: true,
    specimen: '3–5 mL 原尿；先於所有研究分裝', collection: '初始導尿後、UDS 灌注前；目標 50 mL，最低 20 mL 不排除',
    process: '尿液常規、沉渣／pyuria、culture；另測 creatinine 與 specific gravity（或 osmolality）',
    storage: '依臨床檢驗流程，不進研究 cryobox', box: '不入盒',
    purpose: '排除／標記 UTI 與 hematuria；代謝物 normalization 與敏感度分析',
    costs: [{ label: 'UA／culture／Cr／SG（每位分析個案）', mode: 'analysis', unit: 850 }]
  },
  {
    id: 'u-dna', branch: 'urine', code: 'U-DNA', title: 'Urine pellet', stage: 'core', critical: true, specimenBox: true,
    specimen: '15–20 mL 尿液離心後 pellet ×1', collection: '初始導尿尿液；全體 biobank 個案一律留存',
    process: '4°C、10,000 ×g 約 10 分鐘；保留 pellet，避免反覆解凍',
    storage: '2 mL cryovial，−80°C；依研究編號位置存放', box: 'Box 01',
    purpose: '第一期 urine 16S／absolute load；未來 shotgun metagenomics',
    costs: [{ label: '離心管、cryovial、標籤與分裝（每位收案）', mode: 'biobank', unit: 250 }]
  },
  {
    id: 'u-met', branch: 'urine', code: 'U-M1 / U-M2', title: '一般 cell-free supernatant ×2', stage: 'core', specimenBox: true, boxCount: 2,
    specimen: '1 mL ×2；一管正式分析、一管備份', collection: 'cell-free supernatant；全體 biobank 個案留存',
    process: '冰上運送；4°C 離心去除細胞與碎屑，30–60 分鐘內完成分裝',
    storage: '−80°C；避免 freeze–thaw', box: 'Box 02／03',
    purpose: 'PGE₂、8-OHdG、energy／myogenic metabolites 與備份',
    costs: [{ label: '低吸附 cryovial ×2（每位收案）', mode: 'biobank', unit: 160 }]
  },
  {
    id: 'u-purine', branch: 'urine', code: 'U-P1 / U-P2', title: 'Purinergic／NO 軸', stage: 'core', critical: true, specimenBox: true, boxCount: 2,
    specimen: '0.5–1 mL ×2；ATP fresh aliquot＋快速冷凍備份', collection: '初始導尿尿液，先留 U-P1；不可等全部收完才測 ATP',
    process: 'U-P1 目標 1 小時內 luciferase ATP；U-P2 迅速冷凍供 ADP／AMP／adenosine／NOx；先做 6–8 人 recovery pilot',
    storage: 'U-P1 剩餘與 U-P2 皆 −80°C', box: 'Box 04／05',
    purpose: '核心候選軸：ATP、ADP、AMP、adenosine、nitrite、nitrate；計算 NOx／ATP 與 degradation index',
    costs: [{ label: '專用管、當日 ATP 試劑與備份分裝（每位收案）', mode: 'biobank', unit: 240 }]
  },
  {
    id: 'u-ach', branch: 'urine', code: 'U-ACh', title: 'Cholinergic aliquot', stage: 'addon', specimenBox: true,
    specimen: '0.5–1 mL ×1', collection: '初始導尿尿液；全體收案保留',
    process: '依最終 assay 加入平台指定 cholinesterase inhibitor；pilot 比較有／無 inhibitor 與 LLOQ',
    storage: '快速凍存 −80°C', box: 'Box 06',
    purpose: 'ACh、choline；檢驗 DU 的 cholinergic output 假說。若 recovery／LLOQ 不合格則只留 choline',
    costs: [{ label: 'inhibitor、專用管與分裝（每位收案）', mode: 'biobank', unit: 500 }]
  },
  {
    id: 'u-adr', branch: 'urine', code: 'U-ADR', title: 'Adrenergic aliquot', stage: 'addon', specimenBox: true,
    specimen: '1 mL ×1', collection: '初始導尿尿液；記錄咖啡因、壓力、α-blocker／SNRI 等藥物',
    process: '使用檢驗平台指定酸化條件；不可先自行選酸化劑後才詢價',
    storage: '酸化後快速凍存 −80°C', box: 'Box 07',
    purpose: 'norepinephrine、normetanephrine；主要供 bladder-neck smooth-muscle BOO 次群分析',
    costs: [{ label: '酸化管與分裝（每位收案）', mode: 'biobank', unit: 150 }]
  },
  {
    id: 'u-target-core', branch: 'urine', code: 'ASSAY U-MET', title: '核心 targeted metabolomics', stage: 'core', assay: true,
    specimen: '從 U-M1／U-P1／U-P2 解盲前成批取樣', collection: '僅 pure DU 15 人＋pure BOO 15 人先跑；balanced batch、分析者盲化',
    process: '核心 12 項：ATP、ADP、AMP、adenosine、NO₂⁻、NO₃⁻、PGE₂、8-OHdG、lactate、pyruvate、succinate、citrate',
    storage: '同一個案同一 assay plate／batch；pooled QC 每 5–10 件插入', box: '取 Box 02–05',
    purpose: 'Primary aim：DU–BOO large-signal discovery；預先指定 NOx／ATP、purine degradation index、lactate／pyruvate',
    costs: [
      { label: '保存 feasibility＋方法建立／標準品／內標（固定）', mode: 'fixed', unit: 230000 },
      { label: '正式 targeted assay（每位分析個案）', mode: 'analysis', unit: 6300 }
    ]
  },
  {
    id: 'u-autonomic-assay', branch: 'urine', code: 'ASSAY AUTONOMIC', title: '自主神經 add-on panel', stage: 'addon', assay: true,
    specimen: 'U-ACh＋U-ADR；必要時加 U-M1', collection: '只在 pre-analytic pilot 過關後跑全 30 人',
    process: 'ACh、choline、norepinephrine、normetanephrine；betaine／dimethylglycine 僅在不增加方法數時加入',
    storage: '同組 sample 隨機分散 across batches', box: '取 Box 06／07',
    purpose: '驗證 cholinergic／adrenergic 直覺；adrenergic 分析預先限於 bladder-neck phenotype',
    costs: [
      { label: '第二套方法建立與標準品（固定）', mode: 'fixed', unit: 80000 },
      { label: '自主神經 panel（每位分析個案）', mode: 'analysis', unit: 2500 }
    ]
  },
  {
    id: 'u-16s', branch: 'urine', code: 'ASSAY 16S', title: 'Urine 16S＋absolute bacterial load', stage: 'core', assay: true,
    specimen: 'U-DNA pellet；pure DU／BOO 與同批 controls', collection: 'field blank、extraction blank、PCR blank、positive mock 均需進流程',
    process: '低生物量 DNA extraction、16S qPCR／ddPCR、V3–V4 16S；污染辨識後再做 community analysis',
    storage: 'extract 與原 pellet 均保留 −80°C；樣本與 controls 同批建庫', box: '取 Box 01／10',
    purpose: 'Secondary aim：microbial load／community 是否提供 targeted metabolites 以外的增額資訊',
    costs: [
      { label: 'DNA extraction、qPCR、mock 與 low-biomass QC（固定）', mode: 'fixed', unit: 75000 },
      { label: '16S V3–V4（每件；分析樣本＋14 controls）', mode: 'analysisPlusUrine16sControls', unit: 1700 }
    ]
  },
  {
    id: 'u-shotgun', branch: 'urine', code: 'FUTURE SHOTGUN', title: 'Urine deep shotgun metagenomics', stage: 'future', assay: true,
    specimen: 'U-DNA pellet；先以 10–20 對樣本評估 host fraction', collection: '不在第一期 30 人 pilot 例行執行',
    process: '建議 RFQ 寫 PE150、約 15 Gb／sample、host-depletion pilot、blanks sequenced、raw FASTQ',
    storage: 'DNA extract 與剩餘 pellet −80°C', box: '取 Box 01／10',
    purpose: '第二階段 strain／gene／pathway；與 vaginal shotgun 做 paired functional analysis',
    costs: [{ label: '完整建庫＋深度定序估價（分析樣本＋4 controls）', mode: 'analysisPlusUrineShotgunControls', unit: 20000 }]
  },
  {
    id: 'v-dna', branch: 'vagina', code: 'V-DNA', title: 'Vaginal DNA swab', stage: 'core', critical: true, specimenBox: true,
    specimen: 'sterile flocked swab ×1；mid-vaginal lateral wall', collection: 'lubricant、內診、導尿前；固定部位旋轉約 10 秒',
    process: '放入經驗證的 DNA 保存液；同批 field blank；避免不同品牌 swab 混用',
    storage: '−80°C；先確認 swab 管高度可放 cryobox', box: 'Box 08',
    purpose: '未來 vaginal 16S／shotgun；辨識尿液訊號是否反映 urogenital cross-site ecology',
    costs: [{ label: 'flocked swab＋DNA 保存管（每位收案）', mode: 'biobank', unit: 200 }]
  },
  {
    id: 'v-met', branch: 'vagina', code: 'V-MET', title: 'Vaginal metabolomics swab', stage: 'core', critical: true, specimenBox: true,
    specimen: 'sterile dry swab ×1；與 V-DNA 相同解剖位置、另一側取樣', collection: 'lubricant、內診、導尿前；記錄順序並於研究中固定',
    process: '不加可能造成代謝背景的 transport medium；立即置於預冷無添加保存管',
    storage: '快速凍存 −80°C', box: 'Box 09',
    purpose: '未來 vaginal metabolomics；保留但第一期不消耗',
    costs: [{ label: 'dry swab＋低背景保存管（每位收案）', mode: 'biobank', unit: 200 }]
  },
  {
    id: 'v-16s', branch: 'vagina', code: 'FUTURE 16S', title: 'Vaginal 16S＋absolute bacterial load', stage: 'future', assay: true,
    specimen: 'V-DNA swab；與 urine 分析個案配對', collection: '第一期只收存；有第二階段經費才成批萃取',
    process: '16S qPCR／ddPCR、V3–V4 16S；paired batch design 與 controls',
    storage: 'extract 與剩餘 swab −80°C', box: '取 Box 08／10',
    purpose: '評估 vaginal community、menopause 與尿液分子訊號的交互關係',
    costs: [
      { label: 'DNA extraction、qPCR 與 low-biomass QC（固定）', mode: 'fixed', unit: 70000 },
      { label: '16S V3–V4（每件；分析樣本＋10 controls）', mode: 'analysisPlusVagina16sControls', unit: 1700 }
    ]
  },
  {
    id: 'v-targeted', branch: 'vagina', code: 'FUTURE METABOLOME', title: 'Vaginal targeted metabolomics', stage: 'future', assay: true,
    specimen: 'V-MET dry swab；paired urine–vagina subset', collection: '先以 pooled swab／剩餘樣本確認 matrix effect 與 recovery',
    process: '以 lactate、short-chain acids、biogenic amines 等為候選；不可直接套用尿液 extraction',
    storage: '一次性解凍、成批萃取', box: '取 Box 09',
    purpose: '第二階段機制：陰道代謝環境是否修飾尿液 microbiome／voiding phenotype',
    costs: [
      { label: 'vaginal matrix 方法建立（固定）', mode: 'fixed', unit: 150000 },
      { label: '正式 assay（每位分析個案）', mode: 'analysis', unit: 5000 }
    ]
  },
  {
    id: 'v-shotgun', branch: 'vagina', code: 'FUTURE SHOTGUN', title: 'Vaginal shotgun metagenomics', stage: 'future', assay: true,
    specimen: 'V-DNA swab；paired urine–vagina subset', collection: '先做 host fraction pilot；與 urine 對位且同批建庫',
    process: 'RFQ 建議 PE150、6–10 Gb／sample、biological samples 與 blanks 同 lane',
    storage: 'DNA extract 與剩餘 swab −80°C', box: '取 Box 08／10',
    purpose: '第二階段 strain／functional pathways；釐清 vagina–urine source relationship',
    costs: [{ label: '完整建庫＋定序估價（分析樣本＋4 controls）', mode: 'analysisPlusVaginaShotgunControls', unit: 12000 }]
  }
];

const operations = [
  { id: 'op-biobank', code: 'BIOBANK', title: '全套採檢與 biobank 耗材', stage: 'core', scope: '所有收案', purpose: '手套、尿杯、轉運、9 類分裝管、條碼／標籤、cryobox 與一般耗材差額', costs: [{ label: '每位建立樣本庫個案', mode: 'biobank', unit: 850 }] },
  { id: 'op-ra', code: 'PERSONNEL', title: '共享／兼職研究助理', stage: 'core', scope: '18–24 個月', purpose: 'UDS 日採檢、30–60 分鐘內分裝、資料表與 freezer log；預設合作團隊共享人力', costs: [{ label: '兼職 0.15–0.2 FTE', mode: 'fixed', unit: 200000 }] },
  { id: 'op-adjudication', code: 'UDS QC', title: 'UDS trace adjudication 與資料庫', stage: 'core', scope: '全部收案', purpose: '先盲化判讀，再選 pure DU／pure BOO；mixed、indeterminate 保留為未來 gray-zone cohort', costs: [{ label: '資料建置、重判與會議', mode: 'fixed', unit: 20000 }] },
  { id: 'op-bioinfo', code: 'ANALYSIS', title: '統計與生物資訊', stage: 'core', scope: '第一期分析', purpose: 'effect size、permutation／FDR、pre-specified ratios、16S contamination control 與可重現 script', costs: [{ label: '協作／顧問估價', mode: 'fixed', unit: 50000 }] },
  { id: 'op-coldchain', code: 'LOGISTICS', title: '冷鏈、運送與資料管理', stage: 'core', scope: '全期', purpose: '冰盒、dry ice／運送、freezer temperature log、REDCap／資料備份', costs: [{ label: '全期估價', mode: 'fixed', unit: 20000 }] },
  { id: 'op-publication', code: 'OUTPUT', title: '投稿、圖表與雜支', stage: 'core', scope: '研究完成後', purpose: '英文編修、圖表、open access 差額／會議摘要；可於院內計畫極限時延後', costs: [{ label: '預留', mode: 'fixed', unit: 50000 }] }
];

const presets = {
  complete: [...nodes.map(n => n.id), ...operations.map(n => n.id)],
  pilot: [
    'u-clinical','u-dna','u-met','u-purine','u-ach','u-adr','u-target-core','u-16s',
    'v-dna','v-met','op-biobank','op-ra','op-adjudication','op-bioinfo','op-coldchain','op-publication'
  ],
  biobank: ['u-clinical','u-dna','u-met','u-purine','u-ach','u-adr','v-dna','v-met','op-biobank','op-ra','op-adjudication','op-coldchain']
};

function initialEnabled() {
  const stored = localStorage.getItem('duBooPlannerState');
  if (stored) {
    try {
      const saved = JSON.parse(stored);
      Object.assign(state, saved);
      return;
    } catch (_) { /* ignore a corrupt local preference */ }
  }
  presets.complete.forEach(id => { state.enabled[id] = true; });
}

function analysisN() { return state.duN + state.booN; }

function countForMode(mode) {
  const n = analysisN();
  const map = {
    fixed: 1,
    biobank: state.biobankN,
    analysis: n,
    analysisPlusUrine16sControls: n + state.controls.urine16s,
    analysisPlusVagina16sControls: n + state.controls.vagina16s,
    analysisPlusUrineShotgunControls: n + state.controls.urineShotgun,
    analysisPlusVaginaShotgunControls: n + state.controls.vaginaShotgun
  };
  return map[mode] ?? 1;
}

function costKey(itemId, index) { return `${itemId}:${index}`; }

function unitCost(itemId, index, defaultUnit) {
  const key = costKey(itemId, index);
  return Number.isFinite(state.editedCosts[key]) ? state.editedCosts[key] : defaultUnit;
}

function itemCost(item) {
  return item.costs.reduce((sum, cost, index) => sum + unitCost(item.id, index, cost.unit) * countForMode(cost.mode), 0);
}

function formatCost(item) {
  const total = itemCost(item);
  const denom = item.costs.every(c => c.mode === 'biobank') ? state.biobankN : analysisN();
  const per = denom > 0 ? total / denom : total;
  return `${TWD.format(total)}｜約 ${TWD.format(per)}/人`;
}

function stageText(item) {
  if (!state.enabled[item.id]) return '第二階段／目前不計價';
  if (item.stage === 'future') return '完整探索版納入';
  if (item.stage === 'addon') return '先收存；pilot 過關才檢測';
  return '第一期／目前納入';
}

function modeLabel(mode) {
  const labels = {
    fixed: '固定 1 式', biobank: `× ${state.biobankN} 位收案`, analysis: `× ${analysisN()} 位分析`,
    analysisPlusUrine16sControls: `× ${analysisN() + state.controls.urine16s} 件`,
    analysisPlusVagina16sControls: `× ${analysisN() + state.controls.vagina16s} 件`,
    analysisPlusUrineShotgunControls: `× ${analysisN() + state.controls.urineShotgun} 件`,
    analysisPlusVaginaShotgunControls: `× ${analysisN() + state.controls.vaginaShotgun} 件`
  };
  return labels[mode] || '';
}

function renderRoot() {
  document.getElementById('root-node').innerHTML = `
    <article class="root-card">
      <div class="node-code">STUDY ROOT</div>
      <h3>所有因 voiding difficulty 接受 pressure-flow study 的女性</h3>
      <p>先同意、統一採全套檢體，再依 UDS trace 選出 extreme phenotypes。預計樣本庫 ${INT.format(state.biobankN)} 人；第一期分析 pure DU ${state.duN} 人＋pure BOO ${state.booN} 人。</p>
      <div class="root-flow"><span>Prospective consent</span><span>Full biobank</span><span>Blinded UDS adjudication</span><span>Extreme-phenotype pilot</span><span>Gray-zone reserve</span></div>
    </article>`;
}

function nodeHTML(item) {
  const enabled = Boolean(state.enabled[item.id]);
  const costs = item.costs.map((cost, index) => `
    <label class="cost-line">
      <span>${cost.label}<br><small>${modeLabel(cost.mode)}</small></span>
      <input type="number" min="0" step="50" value="${unitCost(item.id, index, cost.unit)}" data-cost-item="${item.id}" data-cost-index="${index}" aria-label="${cost.label}單價">
    </label>`).join('');
  return `
    <article class="study-node ${enabled ? '' : 'deferred'}" data-node-id="${item.id}">
      <div class="node-top">
        <div>
          <div class="node-code">${item.code}${item.critical ? '<span class="critical-mark">● 前分析關鍵</span>' : ''}</div>
          <h4 class="node-title">${item.title}</h4>
        </div>
        <label class="stage-toggle" title="納入目前預算／改為第二階段">
          <input type="checkbox" data-toggle-id="${item.id}" ${enabled ? 'checked' : ''} aria-label="${item.title}納入目前預算">
          <span></span>
        </label>
      </div>
      <div class="node-status">${stageText(item)}</div>
      <dl class="node-specs">
        <div><dt>檢體</dt><dd>${item.specimen}</dd></div>
        <div><dt>怎麼取</dt><dd>${item.collection}</dd></div>
        <div><dt>怎麼處理</dt><dd>${item.process}</dd></div>
        <div><dt>保存</dt><dd>${item.storage}</dd></div>
        <div><dt>Cryobox</dt><dd><span class="box-chip">${item.box}</span></dd></div>
        <div><dt>Purpose</dt><dd>${item.purpose}</dd></div>
        <div><dt>估價</dt><dd><span class="price-chip">${formatCost(item)}</span></dd></div>
      </dl>
      <details>
        <summary>預算假設（點開可改單價）</summary>
        <div class="cost-editor">${costs}</div>
        <p class="cost-footnote">估價是規劃用 placeholder；正式申請前請用平台書面 quotation 更新。</p>
      </details>
    </article>`;
}

function operationHTML(item) {
  const enabled = Boolean(state.enabled[item.id]);
  const costs = item.costs.map((cost, index) => `
    <label class="cost-line"><span>${cost.label}<br><small>${modeLabel(cost.mode)}</small></span>
    <input type="number" min="0" step="100" value="${unitCost(item.id, index, cost.unit)}" data-cost-item="${item.id}" data-cost-index="${index}"></label>`).join('');
  return `
    <article class="operation-node ${enabled ? '' : 'deferred'}" data-node-id="${item.id}">
      <div class="node-top">
        <div><div class="node-code">${item.code}</div><h4 class="node-title">${item.title}</h4></div>
        <label class="stage-toggle"><input type="checkbox" data-toggle-id="${item.id}" ${enabled ? 'checked' : ''}><span></span></label>
      </div>
      <div class="node-status">${stageText(item)}</div>
      <dl class="node-specs">
        <div><dt>範圍</dt><dd>${item.scope}</dd></div>
        <div><dt>Purpose</dt><dd>${item.purpose}</dd></div>
        <div><dt>估價</dt><dd><span class="price-chip">${formatCost(item)}</span></dd></div>
      </dl>
      <details><summary>預算假設（點開可改單價）</summary><div class="cost-editor">${costs}</div></details>
    </article>`;
}

function renderNodes() {
  document.getElementById('urine-nodes').innerHTML = nodes.filter(n => n.branch === 'urine').map(nodeHTML).join('');
  document.getElementById('vagina-nodes').innerHTML = nodes.filter(n => n.branch === 'vagina').map(nodeHTML).join('');
  document.getElementById('operation-nodes').innerHTML = operations.map(operationHTML).join('');
}

function powerFor(d, n1, n2, alpha) {
  const df = n1 + n2 - 2;
  const ncp = d * Math.sqrt((n1 * n2) / (n1 + n2));
  const crit = jStat.studentt.inv(1 - alpha / 2, df);
  return jStat.noncentralt.cdf(-crit, df, ncp) + (1 - jStat.noncentralt.cdf(crit, df, ncp));
}

function solveMde(targetPower = 0.8) {
  let low = 0.001, high = 5;
  for (let i = 0; i < 70; i += 1) {
    const mid = (low + high) / 2;
    if (powerFor(mid, state.duN, state.booN, state.alpha) < targetPower) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

function activeItems() { return [...nodes, ...operations].filter(item => state.enabled[item.id]); }

function groupCosts() {
  const groups = { 'Urine 採檢／分析': 0, 'Vagina 採檢／分析': 0, '共用人力／研究成本': 0 };
  nodes.forEach(item => {
    if (!state.enabled[item.id]) return;
    groups[item.branch === 'urine' ? 'Urine 採檢／分析' : 'Vagina 採檢／分析'] += itemCost(item);
  });
  operations.forEach(item => { if (state.enabled[item.id]) groups['共用人力／研究成本'] += itemCost(item); });
  return groups;
}

function storageSummary() {
  const activeSpecimens = nodes.filter(n => n.specimenBox && state.enabled[n.id]);
  const positionsPerPerson = activeSpecimens.reduce((sum, n) => sum + (n.boxCount || 1), 0);
  const baseTypes = positionsPerPerson;
  const boxes = baseTypes * Math.ceil(state.biobankN / 100) + 1;
  const baskets = Math.ceil(boxes / state.boxesPerBasket);
  return { positionsPerPerson, boxes, baskets };
}

function renderBoxMap() {
  const specimenNodes = nodes.filter(n => n.specimenBox);
  const rows = specimenNodes.map(n => {
    const active = state.enabled[n.id];
    return `<div class="box-row ${active ? '' : 'inactive'}"><span class="box-number">${n.box.replace('Box ', '')}</span><span><b>${n.code}</b><br>${n.title}</span></div>`;
  });
  rows.push('<div class="box-row"><span class="box-number">10</span><span><b>CTRL／overflow</b><br>field、extraction、PCR blanks；mock；重抽與 overflow</span></div>');
  document.getElementById('box-map').innerHTML = rows.join('');
}

function renderDashboard() {
  const p = powerFor(state.effectSize, state.duN, state.booN, state.alpha);
  const mde = solveMde();
  document.getElementById('power-value').textContent = `${(p * 100).toFixed(1)}%`;
  document.getElementById('power-note').textContent = `d=${state.effectSize.toFixed(2)}；n=${state.duN}+${state.booN}；df=${state.duN + state.booN - 2}`;
  document.getElementById('mde-value').textContent = `d = ${mde.toFixed(2)}`;

  const groups = groupCosts();
  const subtotal = Object.values(groups).reduce((a, b) => a + b, 0);
  const reserve = subtotal * state.reserveRate / 100;
  const total = subtotal + reserve;
  document.getElementById('budget-value').textContent = TWD.format(total);
  document.getElementById('budget-note').textContent = `小計 ${TWD.format(subtotal)}＋預備金 ${TWD.format(reserve)}`;

  const storage = storageSummary();
  document.getElementById('storage-value').textContent = `${storage.boxes} 盒／${storage.baskets} 籃`;
  document.getElementById('storage-note').textContent = `${storage.positionsPerPerson} 管／人；100 positions／盒；${state.boxesPerBasket} 盒／籃`;

  document.getElementById('budget-breakdown').innerHTML = Object.entries(groups).map(([name, value]) => `
    <div class="breakdown-line"><b>${name}</b><span>${TWD.format(value)}</span></div>`).join('') +
    `<div class="breakdown-line"><b>預備金 ${state.reserveRate}%</b><span>${TWD.format(reserve)}</span></div>`;

  const interpretation = p >= 0.8
    ? `目前設計對 d=${state.effectSize.toFixed(2)} 的兩組平均差，精確 two-sample t test power 約 ${(p*100).toFixed(1)}%。這仍是 extreme-phenotype discovery，不是臨床 classifier validation。`
    : `目前 power 約 ${(p*100).toFixed(1)}%，低於 80%；在 n=${state.duN}+${state.booN} 下，需約 d=${mde.toFixed(2)} 才達 80% power。陰性結果只能表示本 panel／採檢／樣本數未捕捉到足夠大的差異，不能證明 PFS 永遠不可取代。`;
  document.getElementById('interpretation').innerHTML = `<p><strong>如何解讀：</strong>${interpretation}</p>`;
  renderBoxMap();
}

function saveState() {
  localStorage.setItem('duBooPlannerState', JSON.stringify(state));
}

function syncInputs() {
  document.getElementById('biobank-n').value = state.biobankN;
  document.getElementById('du-n').value = state.duN;
  document.getElementById('boo-n').value = state.booN;
  document.getElementById('effect-size').value = state.effectSize;
  document.getElementById('alpha').value = state.alpha;
  document.getElementById('boxes-per-basket').value = state.boxesPerBasket;
  document.getElementById('reserve-rate').value = state.reserveRate;
  document.querySelectorAll('.preset').forEach(button => button.classList.toggle('active', button.dataset.preset === state.preset));
}

function render() {
  syncInputs();
  renderRoot();
  renderNodes();
  renderDashboard();
  bindDynamicEvents();
  saveState();
}

function bindDynamicEvents() {
  document.querySelectorAll('[data-toggle-id]').forEach(input => {
    input.addEventListener('change', event => {
      state.enabled[event.target.dataset.toggleId] = event.target.checked;
      state.preset = 'custom';
      render();
    });
  });
  document.querySelectorAll('[data-cost-item]').forEach(input => {
    input.addEventListener('change', event => {
      const key = costKey(event.target.dataset.costItem, Number(event.target.dataset.costIndex));
      state.editedCosts[key] = Math.max(0, Number(event.target.value) || 0);
      render();
    });
  });
}

function bindControls() {
  const numericBindings = {
    'biobank-n': ['biobankN', 1], 'du-n': ['duN', 2], 'boo-n': ['booN', 2],
    'effect-size': ['effectSize', 0.05], 'alpha': ['alpha', 0.001],
    'boxes-per-basket': ['boxesPerBasket', 1], 'reserve-rate': ['reserveRate', 0]
  };
  Object.entries(numericBindings).forEach(([id, [key, min]]) => {
    document.getElementById(id).addEventListener('change', event => {
      state[key] = Math.max(min, Number(event.target.value) || min);
      render();
    });
  });
  document.querySelectorAll('.preset').forEach(button => {
    button.addEventListener('click', () => {
      state.preset = button.dataset.preset;
      [...nodes, ...operations].forEach(item => { state.enabled[item.id] = presets[state.preset].includes(item.id); });
      render();
    });
  });
  document.getElementById('print-plan').addEventListener('click', () => window.print());
  document.getElementById('export-csv').addEventListener('click', exportCsv);
}

function csvEscape(value) {
  const s = String(value ?? '');
  return `"${s.replaceAll('"', '""')}"`;
}

function exportCsv() {
  const rows = [['狀態','分支','項目','費用內容','計價方式','數量','單價_NT$','小計_NT$']];
  [...nodes, ...operations].forEach(item => {
    item.costs.forEach((cost, index) => {
      const unit = unitCost(item.id, index, cost.unit);
      const qty = countForMode(cost.mode);
      rows.push([
        state.enabled[item.id] ? '目前納入' : '第二階段', item.branch || '共用', item.title,
        cost.label, modeLabel(cost.mode), qty, unit, state.enabled[item.id] ? unit * qty : 0
      ]);
    });
  });
  const groups = groupCosts();
  const subtotal = Object.values(groups).reduce((a,b) => a+b, 0);
  rows.push(['目前納入','','預備金',`${state.reserveRate}%`,'固定',1,subtotal * state.reserveRate / 100,subtotal * state.reserveRate / 100]);
  const csv = '\ufeff' + rows.map(row => row.map(csvEscape).join(',')).join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = `DU_BOO_study_budget_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

initialEnabled();
bindControls();
render();
