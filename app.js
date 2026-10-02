const TWD = new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 });
const INT = new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 });
const STORAGE_KEY = 'duBooPlannerState_v2_1_20261002';

const state = {
  preset: 'institutional',
  biobankN: 60,
  duN: 15,
  booN: 15,
  effectSize: 1.06,
  alpha: 0.05,
  boxesPerBasket: 4,
  reserveRate: 10,
  budgetCap: 400000,
  controls: { urine16s: 14, vagina16s: 10, urineShotgun: 4, vaginaShotgun: 4 },
  enabled: {},
  editedCosts: {}
};

const nodes = [
  {
    id: 'u-clinical', branch: 'urine', code: 'U-CLIN', title: 'Voided urine 臨床品質控制 aliquot', stage: 'core', critical: true,
    specimen: '3–5 mL clean-catch voided urine；由 primary voided specimen 先分裝',
    collection: '導尿、內診與 UDS 灌注前；與研究主檢體同一泡尿。若要兼顧 free uroflow，流程需先與 UDS 單位確認。',
    process: 'UA、沉渣／pyuria、culture；另測 creatinine 與 specific gravity（或 osmolality）作 normalization／敏感度分析',
    storage: '依臨床檢驗流程；不進研究 cryobox', box: '不入盒',
    purpose: '排除／標記感染、血尿與濃縮程度；讓未來 noninvasive urine assay 有可比較的臨床背景',
    costs: [{ label: 'UA／culture／Cr／SG（每位 targeted 分析個案；若已為例行檢驗可改 0）', mode: 'targetedAnalysis', unit: 850 }]
  },
  {
    id: 'u-dna', branch: 'urine', code: 'U-VOID-DNA', title: 'Voided urine microbiome pellet', stage: 'core', critical: true, specimenBox: true,
    specimen: '15–20 mL clean-catch voided urine 離心後 pellet ×1',
    collection: 'Primary translational specimen；導尿前自然排尿取得。固定 clean-catch SOP，不因 DU／BOO 組別改變。',
    process: '4°C、10,000 ×g 約 10 分鐘；保留 pellet，避免反覆解凍；低生物量分析必須搭配 blanks 與 absolute bacterial load',
    storage: '2 mL cryovial，−80°C；依研究編號位置存放', box: 'Box 01',
    purpose: '未來以「病人自己留尿」為 intended-use specimen 的 microbiome／absolute load；最終目標是可轉譯到 routine urine test',
    costs: [{ label: '離心管、cryovial、標籤與分裝（每位收案）', mode: 'biobank', unit: 250 }]
  },
  {
    id: 'u-met', branch: 'urine', code: 'U-M1 / U-M2', title: 'Voided urine cell-free supernatant ×2', stage: 'core', critical: true, specimenBox: true, boxCount: 2,
    specimen: '1 mL ×2；一管正式分析、一管備份',
    collection: 'Primary translational specimen；同一泡 clean-catch voided urine',
    process: '冰上運送；4°C 離心去除細胞與碎屑，目標 30–60 分鐘內完成。若平台證實可直接 −80°C，SOP 可再簡化。',
    storage: '−80°C；避免 freeze–thaw', box: 'Box 02／03',
    purpose: 'PGE₂、8-OHdG、NOx、citrulline/proline 與其他較適合 batch analysis 的候選物',
    costs: [{ label: '低吸附 cryovial ×2（每位收案）', mode: 'biobank', unit: 160 }]
  },
  {
    id: 'u-purine', branch: 'urine', code: 'U-P1 / U-P2', title: 'Purinergic／NO 特殊 aliquot', stage: 'core', critical: true, specimenBox: true, boxCount: 2,
    specimen: '0.5–1 mL ×2；快速冷凍主 aliquot＋方法學備份',
    collection: 'Primary voided urine；採檢後立即上冰／快速冷凍。是否需要 fresh ATP 僅在 6–8 人 feasibility pilot 比較，不預設全 cohort 當日測。',
    process: '先比較 fresh vs frozen ATP recovery；U-P2 供 ATP degradation chain（ADP／AMP／adenosine）與 NOx。平台確認 stabilizer 前不自行加藥。',
    storage: '快速凍存 −80°C；記錄 collection-to-freeze time', box: 'Box 04／05',
    purpose: 'ATP/NOx 是 mechanistic starting axis，而非已驗證臨床檢驗；同時判斷 ATP 下降是 release 少還是 degradation 快',
    costs: [{ label: '專用管、快速冷凍與備份分裝（每位收案）', mode: 'biobank', unit: 180 }]
  },
  {
    id: 'u-cat-ref', branch: 'urine', code: 'U-CATH-REF', title: 'Catheterized bladder-reference aliquot', stage: 'core', critical: true, specimenBox: true,
    specimen: '導尿取得 2–5 mL，依實際殘尿量留存；低量不排除個案',
    collection: 'Free uroflow／voided urine 後、UDS filling 前；因臨床本來需導尿而取得。不是 intended-use clinical test specimen。',
    process: '優先留 1–2 mL reference aliquot；若量足可再分 pellet／supernatant。目的為來源定位，不以取得大量殘尿作納入條件。',
    storage: '−80°C；volume 與處理方式完整紀錄', box: 'Box 06',
    purpose: 'Mechanistic/reference specimen：判斷 voided signal 是 bladder-derived、outlet-associated 或整體 urogenital phenotype',
    costs: [{ label: 'reference cryovial、標籤與處理（每位收案）', mode: 'biobank', unit: 100 }]
  },
  {
    id: 'u-target-core', branch: 'urine', code: 'ASSAY TIER 1', title: '核心 detrusor-failure targeted panel', stage: 'core', assay: true,
    specimen: 'U-M1／U-P1／U-P2；pure DU vs pure BOO extreme-phenotype targeted cohort',
    collection: '正式 biological comparison 直接採 pure DU 15＋pure BOO 15（或依上方設定）；一次 balanced batch、分析者盲化。6–8 人 pre-analytic feasibility 僅測 recovery／freeze–thaw／ATP fresh-vs-frozen，不作 DU vs BOO biological comparison。',
    process: 'Tier 1：ATP、NO₂⁻、NO₃⁻、PGE₂、8-OHdG。ATP/NOx 為預先指定 mechanistic contrast；PGE₂ 與 8-OHdG 提供 contractility／injury complementary axes。',
    storage: '同一 assay plate／batch 平衡 DU 與 BOO；pooled QC、calibration、LLOQ 與 isotope-labelled internal standards 依平台 SOP',
    box: '取 Box 02–05',
    purpose: '核心問題：能否在 routine-style voided urine 中偵測「逼尿肌真正 contractile failure」而非只是 low-flow phenotype；陰性結果亦可提供 effect-size、precision 與 feasibility evidence。',
    costs: [
      { label: 'Pre-analytic feasibility／recovery pilot（固定 placeholder）', mode: 'fixed', unit: 50000 },
      { label: '核心方法建立／標準品／內標／QC（固定 placeholder）', mode: 'fixed', unit: 170000 },
      { label: '正式 Tier 1 assay（每位 targeted 分析個案 placeholder）', mode: 'targetedAnalysis', unit: 4000 }
    ]
  },
  {
    id: 'u-target-mech', branch: 'urine', code: 'ASSAY TIER 2', title: 'Mechanistic add-on：purine turnover＋oxidative stress', stage: 'addon', assay: true,
    specimen: 'U-P2／U-M1；只有在不需大幅增加方法數或平台建議時加入',
    collection: '與 Tier 1 同一批 targeted samples',
    process: 'ADP、AMP、adenosine；8-isoprostane 若可與 oxidative-stress method 低成本併入。目的在拆解 ATP degradation 與 oxidative injury。',
    storage: '同批一次性解凍；與 Tier 1 共同 QC',
    box: '取 Box 02–05',
    purpose: '不是已驗證 diagnostic biomarkers，而是幫助解讀 ATP 低值與 cellular injury 的機制',
    costs: [
      { label: 'Tier 2 額外方法建立（若平台可併入可改 0）', mode: 'fixed', unit: 50000 },
      { label: 'Tier 2 額外 assay／人（placeholder）', mode: 'targetedAnalysis', unit: 1200 }
    ]
  },
  {
    id: 'u-target-explore', branch: 'urine', code: 'ASSAY TIER 3', title: 'Exploratory add-on：arginine/remodeling＋bioenergetics', stage: 'addon', assay: true,
    specimen: 'U-M1；只在平台可用同一 extraction／run 低成本加入時執行',
    collection: '與 Tier 1 同一批 targeted samples',
    process: '優先問 citrulline、proline；lactate、pyruvate、succinate、citrate 僅在不需另開昂貴方法時保留。',
    storage: '一次性解凍；依平台 matrix/recovery 驗證',
    box: '取 Box 02／03',
    purpose: 'Citrulline/proline 有 LUTS/BOO exploratory rationale；energy quartet 為 hypothesis-driven bioenergetic module，direct DU/BOO human evidence較弱',
    costs: [
      { label: 'Tier 3 額外方法建立（若同法可改 0）', mode: 'fixed', unit: 50000 },
      { label: 'Tier 3 額外 assay／人（placeholder）', mode: 'targetedAnalysis', unit: 1000 }
    ]
  },
  {
    id: 'u-ach', branch: 'urine', code: 'FUTURE ACh', title: 'Cholinergic special aliquot', stage: 'future', specimenBox: true,
    specimen: '0.5–1 mL ×1；僅在平台先確認 stabilization 後才收',
    collection: '不要先自行加 cholinesterase inhibitor；先由平台定義採檢管與 LLOQ',
    process: 'ACh、choline；若 recovery 不佳則不列核心研究問題',
    storage: '依平台指定快速凍存', box: 'Box 07',
    purpose: '較弱的 mechanistic add-on，不應擠壓第一期 detrusor-failure core panel',
    costs: [{ label: '特殊保存管／inhibitor（每位收案；未確認前不建議納入）', mode: 'biobank', unit: 500 }]
  },
  {
    id: 'u-adr', branch: 'urine', code: 'FUTURE ADR', title: 'Adrenergic special aliquot', stage: 'future', specimenBox: true,
    specimen: '1 mL ×1；僅在平台先確認酸化條件後才收',
    collection: '記錄咖啡因、壓力、α-blocker／SNRI 等；不自行選酸化劑',
    process: 'norepinephrine、normetanephrine；較適合 bladder-neck／sympathetic BOO 次群',
    storage: '平台指定酸化後快速凍存', box: 'Box 08',
    purpose: 'BOO subtype exploratory module，不是辨認 detrusor failure 的第一優先',
    costs: [{ label: '酸化管與分裝（每位收案；未確認前不建議納入）', mode: 'biobank', unit: 150 }]
  },
  {
    id: 'u-16s', branch: 'urine', code: 'FUTURE 16S', title: 'Urine full-length 16S V1–V9＋absolute bacterial load', stage: 'future', assay: true,
    specimen: 'U-VOID-DNA pellet；pure DU／BOO 與同批 low-biomass controls',
    collection: 'field blank、extraction blank、PCR/library blank、positive mock 均需進流程',
    process: '低生物量 DNA extraction、16S qPCR／ddPCR＋PacBio HiFi full-length V1–V9；污染辨識後再做 community analysis',
    storage: 'extract 與原 pellet 均保留 −80°C；樣本與 controls 同批建庫',
    box: '取 Box 01／CTRL',
    purpose: '第二階段：測試 noninvasive voided-urine microbial load/community 是否增加 targeted metabolite 之外的資訊；full-length 16S 仍非 functional metagenome',
    costs: [
      { label: 'DNA extraction、qPCR、mock 與 low-biomass QC（固定 placeholder）', mode: 'fixed', unit: 75000 },
      { label: 'PacBio full-length V1–V9（每件；樣本＋14 controls placeholder）', mode: 'analysisPlusUrine16sControls', unit: 2500 }
    ]
  },
  {
    id: 'u-shotgun', branch: 'urine', code: 'FUTURE SHOTGUN', title: 'Urine deep shotgun metagenomics', stage: 'future', assay: true,
    specimen: 'U-VOID-DNA／必要時 U-CATH-REF；先評估 bacterial load 與 host fraction',
    collection: '不在院內 40 萬 pilot 例行執行；先確認低生物量是否高於 blank/background',
    process: '未來才做 strain／gene／pathway；host depletion 必須用 undepleted control 驗證 taxon bias',
    storage: 'DNA extract 與原 pellet −80°C',
    box: '取 Box 01／06',
    purpose: '功能／strain／resistome／virulome；只有在 biomass 與成本可行時進入第二階段',
    costs: [{ label: '深度 shotgun 建庫＋定序 placeholder（分析樣本＋4 controls）', mode: 'analysisPlusUrineShotgunControls', unit: 20000 }]
  },
  {
    id: 'v-dna', branch: 'vagina', code: 'V-DNA', title: 'Vaginal DNA swab', stage: 'core', critical: true, specimenBox: true,
    specimen: 'sterile flocked swab ×1；mid-vaginal lateral wall',
    collection: 'voided urine 之後、lubricant／內診／導尿前；固定部位旋轉約 10 秒',
    process: '放入經驗證的 DNA 保存液；同批 field blank；避免不同品牌 swab 混用',
    storage: '−80°C；先確認 swab 管高度可放 cryobox',
    box: 'Box 09',
    purpose: '建立 urogenital ecology reference；未來可和 voided urine 比較 cross-site signal',
    costs: [{ label: 'flocked swab＋DNA 保存管（每位收案）', mode: 'biobank', unit: 200 }]
  },
  {
    id: 'v-met', branch: 'vagina', code: 'V-MET', title: 'Vaginal metabolomics swab', stage: 'core', critical: true, specimenBox: true,
    specimen: 'sterile dry swab ×1；與 V-DNA 相同解剖位置、另一側取樣',
    collection: 'voided urine 之後、lubricant／內診／導尿前；研究中固定取樣順序',
    process: '不加可能造成代謝背景的 transport medium；立即置於預冷無添加保存管',
    storage: '快速凍存 −80°C',
    box: 'Box 10',
    purpose: '第二階段做 vagina–urine metabolomic ecology；第一期只收存、不消耗',
    costs: [{ label: 'dry swab＋低背景保存管（每位收案）', mode: 'biobank', unit: 200 }]
  },
  {
    id: 'v-16s', branch: 'vagina', code: 'FUTURE 16S', title: 'Vaginal full-length 16S V1–V9＋absolute bacterial load', stage: 'future', assay: true,
    specimen: 'V-DNA swab；與 urine 分析個案配對',
    collection: '第一期只收存；第二階段成批萃取',
    process: '16S qPCR／ddPCR＋PacBio HiFi full-length V1–V9；paired batch design 與 controls',
    storage: 'extract 與剩餘 swab −80°C',
    box: '取 Box 09／CTRL',
    purpose: '評估 vaginal community 是否解釋 voided urinary microbial/metabolic phenotype',
    costs: [
      { label: 'DNA extraction、qPCR 與 QC（固定 placeholder）', mode: 'fixed', unit: 70000 },
      { label: 'PacBio full-length V1–V9（每件；樣本＋10 controls placeholder）', mode: 'analysisPlusVagina16sControls', unit: 2500 }
    ]
  },
  {
    id: 'v-targeted', branch: 'vagina', code: 'FUTURE METABOLOME', title: 'Vaginal targeted metabolomics', stage: 'future', assay: true,
    specimen: 'V-MET dry swab；paired urine–vagina subset',
    collection: '先以 pooled swab／剩餘樣本確認 matrix effect 與 recovery',
    process: 'lactate、short-chain acids、biogenic amines 等為候選；不可直接套用尿液 extraction',
    storage: '一次性解凍、成批萃取',
    box: '取 Box 10',
    purpose: '第二階段：陰道代謝環境是否修飾 voided urinary phenotype',
    costs: [
      { label: 'vaginal matrix 方法建立（固定 placeholder）', mode: 'fixed', unit: 150000 },
      { label: '正式 assay（每位完整分析個案 placeholder）', mode: 'analysis', unit: 5000 }
    ]
  },
  {
    id: 'v-shotgun', branch: 'vagina', code: 'FUTURE SHOTGUN', title: 'Vaginal shotgun metagenomics', stage: 'future', assay: true,
    specimen: 'V-DNA swab；paired urine–vagina subset',
    collection: '先做 host fraction pilot；與 urine 對位且同批建庫',
    process: '第二階段才做 strain／functional pathways',
    storage: 'DNA extract 與剩餘 swab −80°C',
    box: '取 Box 09',
    purpose: 'cross-site strain／functional analysis；不屬於院內第一期',
    costs: [{ label: '完整建庫＋定序 placeholder（分析樣本＋4 controls）', mode: 'analysisPlusVaginaShotgunControls', unit: 12000 }]
  }
];

const operations = [
  { id: 'op-biobank', code: 'BIOBANK', title: '共用採檢與 biobank 耗材', stage: 'core', scope: '所有收案', purpose: '手套、尿杯、轉運、條碼／標籤、cryobox 與一般耗材差額；特殊管已在各 node 另列', costs: [{ label: '每位一般耗材 placeholder', mode: 'biobank', unit: 250 }] },
  { id: 'op-ra', code: 'PERSONNEL', title: '共享／兼職研究助理', stage: 'addon', scope: '18–24 個月', purpose: 'UDS 日採檢、時間戳、分裝、freezer log；若現有人力可吸收可先不列院內 40 萬版', costs: [{ label: '兼職 0.15–0.2 FTE placeholder', mode: 'fixed', unit: 200000 }] },
  { id: 'op-adjudication', code: 'UDS QC', title: 'UDS trace adjudication 與資料庫', stage: 'core', scope: '全部收案', purpose: '盲化判讀；先選 pure DU／pure BOO，mixed／indeterminate 留作未來 gray-zone validation', costs: [{ label: '資料建置、重判與會議 placeholder', mode: 'fixed', unit: 20000 }] },
  { id: 'op-bioinfo', code: 'ANALYSIS', title: '統計與生物資訊', stage: 'addon', scope: '第一期與第二階段', purpose: 'effect size、FDR／permutation、microbiome contamination control、可重現 script', costs: [{ label: '協作／顧問 placeholder', mode: 'fixed', unit: 50000 }] },
  { id: 'op-coldchain', code: 'LOGISTICS', title: '冷鏈、運送與資料管理', stage: 'core', scope: '全期', purpose: '冰盒、dry ice／運送、freezer temperature log、REDCap／資料備份', costs: [{ label: '全期 placeholder', mode: 'fixed', unit: 10000 }] },
  { id: 'op-publication', code: 'OUTPUT', title: '投稿、圖表與雜支', stage: 'addon', scope: '研究完成後', purpose: '英文編修、圖表、open access 差額／會議摘要；院內計畫極限時可延後', costs: [{ label: '預留 placeholder', mode: 'fixed', unit: 50000 }] }
];

const presets = {
  institutional: [
    'u-clinical','u-dna','u-met','u-purine','u-cat-ref','u-target-core',
    'v-dna','v-met','op-biobank','op-adjudication','op-coldchain'
  ],
  targeted30: [
    'u-clinical','u-dna','u-met','u-purine','u-cat-ref','u-target-core','u-target-mech',
    'v-dna','v-met','op-biobank','op-adjudication','op-bioinfo','op-coldchain'
  ],
  biobank: [
    'u-dna','u-met','u-purine','u-cat-ref','v-dna','v-met',
    'op-biobank','op-adjudication','op-coldchain'
  ],
  complete: [...nodes.map(n => n.id), ...operations.map(n => n.id)]
};


function initialEnabled() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const saved = JSON.parse(stored);
      Object.assign(state, saved);
      if (!presets[state.preset] && state.preset !== 'custom') state.preset = 'institutional';
      return;
    } catch (_) { /* ignore corrupt preference */ }
  }
  presets.institutional.forEach(id => { state.enabled[id] = true; });
}

function targetedAnalysisN() { return analysisN(); }
function analysisN() { return state.duN + state.booN; }

function countForMode(mode) {
  const n = analysisN();
  const t = targetedAnalysisN();
  const map = {
    fixed: 1,
    biobank: state.biobankN,
    targetedAnalysis: t,
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
  let denom = analysisN();
  if (item.costs.every(c => c.mode === 'biobank')) denom = state.biobankN;
  if (item.costs.some(c => c.mode === 'targetedAnalysis') && !item.costs.some(c => c.mode === 'analysis')) denom = targetedAnalysisN();
  const per = denom > 0 ? total / denom : total;
  return `${TWD.format(total)}｜約 ${TWD.format(per)}/人`;
}

function stageText(item) {
  if (!state.enabled[item.id]) return '目前不計價／第二階段';
  if (item.stage === 'future') return '完整探索版納入';
  if (item.stage === 'addon') return '可選 add-on';
  if (state.preset === 'institutional') return '院內第一期／目前納入';
  return '目前納入';
}

function modeLabel(mode) {
  const labels = {
    fixed: '固定 1 式',
    biobank: `× ${state.biobankN} 位收案`,
    targetedAnalysis: `× ${analysisN()} 位 targeted 分析`,
    analysis: `× ${analysisN()} 位完整分析`,
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
      <h3>用 voided urine 找出「逼尿肌真正 contractile failure」</h3>
      <p>先建立 ${INT.format(state.biobankN)} 人的 UDS-linked biobank；以 pure DU 與 pure BOO 作為 preserved-vs-failed contractility 的 extreme-phenotype contrast。正式 targeted biological comparison 直接為 DU ${state.duN}＋BOO ${state.booN}；另做 6–8 人 pre-analytic feasibility，但不拿來作 first-batch group comparison。</p>
      <div class="root-flow"><span>Clean-catch voided urine</span><span>Paired catheter reference</span><span>Blinded UDS adjudication</span><span>6–8 人 pre-analytic pilot</span><span>15+15 targeted comparison</span></div>
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
        <p class="cost-footnote">全部是規劃用 placeholder；正式申請前以合作平台書面 quotation 更新。若同一 LC-MS method 可合併 analytes，請把額外 method development 改為 0 或實際報價。</p>
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
  if (n1 < 2 || n2 < 2) return NaN;
  const df = n1 + n2 - 2;
  const ncp = d * Math.sqrt((n1 * n2) / (n1 + n2));
  const crit = jStat.studentt.inv(1 - alpha / 2, df);
  return jStat.noncentralt.cdf(-crit, df, ncp) + (1 - jStat.noncentralt.cdf(crit, df, ncp));
}

function solveMde(n1, n2, targetPower = 0.8) {
  if (n1 < 2 || n2 < 2) return NaN;
  let low = 0.001, high = 5;
  for (let i = 0; i < 70; i += 1) {
    const mid = (low + high) / 2;
    if (powerFor(mid, n1, n2, state.alpha) < targetPower) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

function groupCosts() {
  const groups = { 'Urine 採檢／分析': 0, 'Vagina 採檢／保存': 0, '共用研究成本': 0 };
  nodes.forEach(item => {
    if (!state.enabled[item.id]) return;
    groups[item.branch === 'urine' ? 'Urine 採檢／分析' : 'Vagina 採檢／保存'] += itemCost(item);
  });
  operations.forEach(item => { if (state.enabled[item.id]) groups['共用研究成本'] += itemCost(item); });
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
  rows.push('<div class="box-row"><span class="box-number">CTRL</span><span><b>Controls／overflow</b><br>field、extraction、PCR/library blanks；mock；重抽與 overflow</span></div>');
  document.getElementById('box-map').innerHTML = rows.join('');
}

function renderDashboard() {
  const p = powerFor(state.effectSize, state.duN, state.booN, state.alpha);
  const mde = solveMde(state.duN, state.booN);

  document.getElementById('power-value').textContent = Number.isFinite(p) ? `${(p * 100).toFixed(1)}%` : '—';
  document.getElementById('power-note').textContent = `d=${state.effectSize.toFixed(2)}；n=${state.duN}+${state.booN}；pure DU vs pure BOO extreme-phenotype comparison`;
  document.getElementById('mde-value').textContent = Number.isFinite(mde) ? `d = ${mde.toFixed(2)}` : '—';

  const groups = groupCosts();
  const subtotal = Object.values(groups).reduce((a, b) => a + b, 0);
  const reserve = subtotal * state.reserveRate / 100;
  const total = subtotal + reserve;
  const gap = state.budgetCap - total;

  document.getElementById('budget-value').textContent = TWD.format(total);
  document.getElementById('budget-note').textContent = `小計 ${TWD.format(subtotal)}＋預備金 ${TWD.format(reserve)}`;
  document.getElementById('budget-gap-value').textContent = gap >= 0 ? `尚餘 ${TWD.format(gap)}` : `超出 ${TWD.format(Math.abs(gap))}`;
  document.getElementById('budget-gap-note').textContent = `相對院內上限 ${TWD.format(state.budgetCap)}；用平台報價即時修正`;

  const storage = storageSummary();
  document.getElementById('storage-value').textContent = `${storage.boxes} 盒／${storage.baskets} 籃`;
  document.getElementById('storage-note').textContent = `${storage.positionsPerPerson} positions／人；100 positions／盒；${state.boxesPerBasket} 盒／籃`;

  document.getElementById('budget-breakdown').innerHTML = Object.entries(groups).map(([name, value]) => `
    <div class="breakdown-line"><b>${name}</b><span>${TWD.format(value)}</span></div>`).join('') +
    `<div class="breakdown-line"><b>預備金 ${state.reserveRate}%</b><span>${TWD.format(reserve)}</span></div>` +
    `<div class="breakdown-line breakdown-line--total"><b>總計</b><span>${TWD.format(total)}</span></div>`;

const powerText = Number.isFinite(p)
  ? `本研究以 pure DU ${state.duN} 人與 pure BOO ${state.booN} 人進行 targeted metabolite comparison。此樣本數約有 ${(p*100).toFixed(1)}% power 偵測 Cohen's d≈${state.effectSize.toFixed(2)} 的大型組間差異，因此主要目的是尋找具有明顯 biological signal 的候選尿液指標，而不是建立或驗證臨床 diagnostic classifier。`
  : '';

const feasibilityText = `另外收集的 6–8 人只用於 pre-analytic feasibility，例如 ATP fresh-vs-frozen、recovery、freeze–thaw、stabilizer 與 LLOQ，不作 DU vs BOO biological comparison。`;

const capText = gap >= 0
  ? `依目前暫定單價，總預算在院內上限內，仍有 ${TWD.format(gap)} 緩衝。`
  : `依目前暫定單價，總預算較院內上限高 ${TWD.format(Math.abs(gap))}。正式預算仍取決於平台報價，尤其是 method development 能否共用、ATP 是否必須採用 fresh workflow，以及 Tier 2/3 analytes 是否可在不增加額外 analytical method 的情況下併入。`;

  document.getElementById('interpretation').innerHTML = `<p><strong>如何解讀：</strong>${powerText} ${feasibilityText} ${capText}</p>`;
  renderBoxMap();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function syncInputs() {
  document.getElementById('biobank-n').value = state.biobankN;
  document.getElementById('du-n').value = state.duN;
  document.getElementById('boo-n').value = state.booN;
  document.getElementById('effect-size').value = state.effectSize;
  document.getElementById('alpha').value = state.alpha;
  document.getElementById('boxes-per-basket').value = state.boxesPerBasket;
  document.getElementById('reserve-rate').value = state.reserveRate;
  document.getElementById('budget-cap').value = state.budgetCap;
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

function applyPreset(name) {
  state.preset = name;
  state.enabled = {};
  (presets[name] || []).forEach(id => { state.enabled[id] = true; });
  render();
}

function bindControls() {
  const numericBindings = {
    'biobank-n': ['biobankN', 1],
    'du-n': ['duN', 2],
    'boo-n': ['booN', 2],
    'effect-size': ['effectSize', 0.05],
    'alpha': ['alpha', 0.001],
    'boxes-per-basket': ['boxesPerBasket', 1],
    'reserve-rate': ['reserveRate', 0],
    'budget-cap': ['budgetCap', 0]
  };
  Object.entries(numericBindings).forEach(([id, [key, min]]) => {
    document.getElementById(id).addEventListener('change', event => {
      state[key] = Math.max(min, Number(event.target.value) || min);
      state.preset = 'custom';
      render();
    });
  });
  document.querySelectorAll('.preset').forEach(button => {
    button.addEventListener('click', () => applyPreset(button.dataset.preset));
  });
  document.getElementById('print-plan').addEventListener('click', () => window.print());
  document.getElementById('export-csv').addEventListener('click', exportCsv);
}

function csvEscape(value) {
  const s = String(value ?? '');
  return `"${s.replaceAll('"', '""')}"`;
}

function exportCsv() {
  const rows = [
    ['方案', state.preset, '樣本庫N', state.biobankN, 'Primary_targeted_DU', state.duN, 'Primary_targeted_BOO', state.booN],
    ['Preanalytic_feasibility', '6–8 participants', '院內上限_NT$', state.budgetCap, '預備金_%', state.reserveRate],
    [],
    ['狀態','分支','項目','費用內容','計價方式','數量','單價_NT$','小計_NT$']
  ];
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
  const reserve = subtotal * state.reserveRate / 100;
  const total = subtotal + reserve;
  rows.push(['目前納入','','預備金',`${state.reserveRate}%`,'固定',1,reserve,reserve]);
  rows.push(['目前納入','','總計','','',1,total,total]);
  rows.push(['','','相對院內上限差額','','',1,state.budgetCap-total,state.budgetCap-total]);
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
