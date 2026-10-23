const TWD = new Intl.NumberFormat('zh-TW',{style:'currency',currency:'TWD',maximumFractionDigits:0});
const N = new Intl.NumberFormat('zh-TW',{maximumFractionDigits:0});
const STORAGE_KEY='duBooPlanner_v3_2_20261023';
const CHECKED='2026-10-23';

const URLS={
 sequencing:'https://www.ntuh.gov.tw/LARD/Fpage.action?fid=6368',
 metabolomics:'https://reg.ntuh.gov.tw/WebAppointment/Intro/C004.aspx',
 bioinfo:'https://www.ntuh.gov.tw/LARD/Fpage.action?fid=9414&muid=8157',
 microbiome:'https://reg.ntuh.gov.tw/WebAppointment/Intro/C005.aspx',
 seahorseOld:'https://reg.ntuh.gov.tw/WebAppointment/Intro/S707.aspx',
 seahorsePro:'https://reg.ntuh.gov.tw/WebAppointment/Intro/S726.aspx',
 nanolive:'https://reg.ntuh.gov.tw/WebAppointment/Intro/S722.aspx'
};

const catalog=[
 {core:'基因定序暨生化核心',item:'體液 cell-free DNA extraction（Qiagen Circulating Nucleic Acid Kit）',price:1000,unit:'sample',status:'Official published price',matrix:'serum/plasma/urine cfDNA；不可直接當作低生物量 microbiome pellet DNA extraction 報價',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'體液 miRNA extraction（miRNeasy Serum/Plasma Advanced Kit）',price:500,unit:'sample',status:'Official published price',matrix:'官網列 serum/plasma；urine 未列，若做 urinary EV/miRNA 需另外確認',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'16S V3–V4 PCR（含毛細管電泳）',price:130,unit:'sample',status:'Official published price',matrix:'需先有適合之 DNA；尿液 microbiome DNA extraction workflow 另確認',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'Qubit DNA QC',price:120,unit:'sample',status:'Official published price',matrix:'DNA',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'gDNA / DNA library 毛細管電泳',price:100,unit:'sample',status:'Official published price',matrix:'gDNA/library',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'NGS DNA library preparation service',price:700,unit:'sample',status:'Official published price',matrix:'僅含代建庫耗材；建庫試劑另計。是否適用 16S workflow 須確認',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'MiniSeq Midi Output 300 cycles',price:32000,unit:'chip',status:'Official published price',matrix:'<600 bp sequencing',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'MiniSeq High Output 300 cycles',price:87000,unit:'chip',status:'Official published price',matrix:'<600 bp sequencing',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'Nanopore multiplex library preparation',price:1100,unit:'sample',status:'Official published price',matrix:'long-read library; full-length 16S-specific amplification/reagents 仍需確認',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'Nanopore R10 sequencing',price:45000,unit:'chip',status:'Official published price',matrix:'估算 8G bases；不保證 final yield',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'High-throughput bioinformatics',price:500,unit:'hour',status:'Official published price',matrix:'sequence processing/statistics/integration/visualization',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'高通量基因體暨巨量資料分析核心',item:'Bioinformatics analysis',price:500,unit:'hour',status:'Official published price',matrix:'16S/metagenome/Nanopore/PacBio/multi-omics integration',published:'page current; version date not shown',url:URLS.bioinfo},
 {core:'基因定序暨生化核心',item:'qPCR instrument（梯度溫度 PCR）',price:60,unit:'2.5 h / run',status:'Official published price',matrix:'僅儀器使用；primers/probes/standards/assay reagents 未含',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'ddPCR droplet-generation oil',price:2650,unit:'bottle',status:'Official published price',matrix:'reagent volume/number of runs still required',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'ddPCR cartridge set',price:1100,unit:'plate',status:'Official published price',matrix:'workflow quantity must be planned with core',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'ddPCR plate',price:250,unit:'plate',status:'Official published price',matrix:'workflow quantity must be planned with core',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'ddPCR droplet generation + amplification',price:50,unit:'run',status:'Official published price',matrix:'primers/probes/standards not included',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'ddPCR detection',price:1000,unit:'hour',status:'Official published price',matrix:'assay reagents/standards not included',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'代謝體暨藥物分析核心',item:'Glycolysis and TCA Cycle Metabolites Relative Quantification',price:2000,unit:'sample',status:'Official published price',matrix:'官網列 plasma/serum/cell；urine 未確認，需 matrix validation / quote',published:'page current; version date not shown',url:URLS.metabolomics},
 {core:'基因定序暨生化核心',item:'EV Size Exclusion Chromatography',price:800,unit:'run/sample',status:'Official published price',matrix:'urine applicability not explicitly confirmed',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'NTA delegated analysis',price:500,unit:'sample',status:'Official published price',matrix:'EV workflow; urine applicability to confirm',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'基因定序暨生化核心',item:'CytoFLEX nano',price:300,unit:'hour',status:'Official published price',matrix:'nano-flow; urine EV workflow to confirm',published:'2025-10-15 修正；2025-11-01 生效',url:URLS.sequencing},
 {core:'微菌體核心',item:'腸道厭氧菌分離純化培養',price:40000,unit:'strain',status:'Official published price',matrix:'official service is gut anaerobes; urinary/vaginal isolate applicability to confirm',published:'page current; version date not shown',url:URLS.microbiome},
 {core:'免疫研究核心',item:'Seahorse XFe24 bioenergetic assay',price:3800,unit:'commissioned run',status:'Official published price',matrix:'cell-based; contract price prevails',published:'page current; version date not shown',url:URLS.seahorseOld},
 {core:'免疫研究核心',item:'Seahorse XFe24 Mito Stress Test',price:4400,unit:'commissioned run',status:'Official published price',matrix:'cell-based; includes one reagent kit',published:'page current; version date not shown',url:URLS.seahorseOld},
 {core:'免疫研究核心',item:'Seahorse XFe24 Glycolysis Stress Test',price:6800,unit:'commissioned run',status:'Official published price',matrix:'cell-based',published:'page current; version date not shown',url:URLS.seahorseOld},
 {core:'免疫研究核心',item:'Seahorse XF Pro',price:null,unit:'quote',status:'Quote required',matrix:'cell-based; consumables/reagents fluctuate; Real-Time ATP Rate Assay available',published:'page current; detailed price not published',url:URLS.seahorsePro},
 {core:'免疫研究核心',item:'Nanolive time-lapse imaging',price:300,unit:'day',status:'Official published price',matrix:'cell imaging',published:'page current; version date not shown',url:URLS.nanolive},
 {core:'免疫研究核心',item:'Nanolive image-analysis module',price:400,unit:'analysis',status:'Official published price',matrix:'cell imaging',published:'page current; version date not shown',url:URLS.nanolive}
];

const DEFAULT_METABOLITES={
 atp:true,adp:false,amp:false,adenosine:false,
 nitrite:true,nitrate:true,pge2:true,ohdg:true,
 isoprostane:false,citrulline:false,proline:false,
 ach:false,choline:false,norepinephrine:false,normetanephrine:false
};
const EXPANDED_METABOLITES={...DEFAULT_METABOLITES,adp:true,amp:true,adenosine:true,isoprostane:true,citrulline:true,proline:true};

const metaboliteMethods=[
 {id:'purine',title:'Purinergic / purine method',note:'ATP 為核心；ADP/AMP/adenosine 若平台可同法併測，再一起加入。',analytes:[
  {id:'atp',label:'ATP',tier:'Tier 1',role:'purinergic / contractility'},
  {id:'adp',label:'ADP',tier:'Tier 2',role:'ATP degradation / turnover'},
  {id:'amp',label:'AMP',tier:'Tier 2',role:'ATP degradation / turnover'},
  {id:'adenosine',label:'adenosine',tier:'Tier 2',role:'purine turnover'}]},
 {id:'nox',title:'NOx method',note:'NO₂⁻ + NO₃⁻ 通常一起解讀成 NOx；實際方法由核心確認。',analytes:[
  {id:'nitrite',label:'NO₂⁻ (nitrite)',tier:'Tier 1',role:'NO pathway'},
  {id:'nitrate',label:'NO₃⁻ (nitrate)',tier:'Tier 1',role:'NO pathway'}]},
 {id:'pge2',title:'PGE₂ method',note:'先視為獨立方法；若核心可與其他 lipid mediator 同法，報價時再合併。',analytes:[
  {id:'pge2',label:'PGE₂',tier:'Tier 1',role:'contractility / remodeling'}]},
 {id:'ohdg',title:'8-OHdG method',note:'oxidative DNA injury marker；是否與其他 oxidative markers 共用方法需確認。',analytes:[
  {id:'ohdg',label:'8-OHdG',tier:'Tier 1',role:'oxidative injury / decompensation'}]},
 {id:'isoprostane',title:'8-isoprostane method',note:'只有平台能低成本併入時才優先加入。',analytes:[
  {id:'isoprostane',label:'8-isoprostane',tier:'Tier 2',role:'lipid oxidative stress'}]},
 {id:'arginine',title:'Arginine / remodeling method',note:'探索性候選；不是已驗證的 DU/BOO biomarker。',analytes:[
  {id:'citrulline',label:'citrulline',tier:'Tier 3',role:'arginine / NO pathway'},
  {id:'proline',label:'proline',tier:'Tier 3',role:'ECM / remodeling'}]},
 {id:'cholinergic',title:'Cholinergic method',note:'生理機制合理，但 urinary ACh/choline 尚不是 DU 臨床 biomarker；特殊前處理要先確認。',analytes:[
  {id:'ach',label:'acetylcholine (ACh)',tier:'Future',role:'parasympathetic / muscarinic signaling'},
  {id:'choline',label:'choline',tier:'Future',role:'cholinergic-related metabolite'}]},
 {id:'adrenergic',title:'Adrenergic method',note:'尿液可測，但全身 sympathetic / renal handling 影響大；較適合 BOO subtype 探索。',analytes:[
  {id:'norepinephrine',label:'norepinephrine',tier:'Future',role:'sympathetic signaling'},
  {id:'normetanephrine',label:'normetanephrine',tier:'Future',role:'stable catecholamine metabolite'}]}
];

const state={
 preset:'core',biobankN:60,duN:15,booN:15,urineN:30,vaginaN:30,urineRep:1,vaginaRep:1,negativeControls:8,positiveControls:2,technicalReplicates:4,qcSamples:4,bioinfoHours:20,
 module:{biobank:true,targeted:true,tca:false,short16s:true,nanopore16s:false,pacbio16s:false,bacterialLoad:true,ev:false,proteomics:false,wgs:false,bioinfo:true,seahorse:false,nanolive:false,isolate:false},
 metabolites:{...DEFAULT_METABOLITES},
 assumption:{
  biobankPerPerson:1200,
  preanalyticFixed:50000,
  metabolomicsPricingMode:'envelope',
  tier1Dev:170000,tier1PerSample:4000,
  purineDev:null,purinePerSample:null,noxDev:null,noxPerSample:null,pge2Dev:null,pge2PerSample:null,ohdgDev:null,ohdgPerSample:null,isoprostaneDev:null,isoprostanePerSample:null,arginineDev:null,argininePerSample:null,cholinergicDev:null,cholinergicPerSample:null,adrenergicDev:null,adrenergicPerSample:null,
  tcaUrineExtra:null,microbiomeExtractionPerSample:null,shortLibraryPrep:false,miniSeqMode:'MO300',miniSeqChips:1,nanoporeChips:1,nanoporeFullLengthExtra:null,pacbioPerSample:null,bacterialLoadReagents:null,qPCRRuns:2,ddpcrOilBottles:1,ddpcrCartridgePlates:1,ddpcrPlates:1,ddpcrRuns:1,ddpcrHours:2,evN:10,evNanoHours:4,proteomicsPerSample:null,wgsN:10,wgsPerSample:null,seahorseRuns:1,seahorseProQuote:null,nanoliveDays:1,nanoliveAnalyses:1,isolateStrains:1
 }
};

const presets={
 minimal:{module:{biobank:true,targeted:true,tca:false,short16s:false,nanopore16s:false,pacbio16s:false,bacterialLoad:false,ev:false,proteomics:false,wgs:false,bioinfo:true,seahorse:false,nanolive:false,isolate:false},metabolites:{...DEFAULT_METABOLITES},bioinfoHours:10},
 core:{module:{biobank:true,targeted:true,tca:false,short16s:true,nanopore16s:false,pacbio16s:false,bacterialLoad:true,ev:false,proteomics:false,wgs:false,bioinfo:true,seahorse:false,nanolive:false,isolate:false},metabolites:{...DEFAULT_METABOLITES},bioinfoHours:20},
 expanded:{module:{biobank:true,targeted:true,tca:true,short16s:true,nanopore16s:false,pacbio16s:false,bacterialLoad:true,ev:true,proteomics:true,wgs:true,bioinfo:true,seahorse:true,nanolive:true,isolate:false},metabolites:{...EXPANDED_METABOLITES},bioinfoHours:40}
};

const modules=[
 {id:'biobank',title:'Prospective biobank / specimen reserve',phase:'Phase 1',status:'Preliminary estimate',desc:'所有 enrollment 先留 standardized voided urine + vaginal biobank；future EV/proteomics reserve 不增加特殊處理，除非核心確認。'},
 {id:'targeted',title:'Urinary targeted metabolomics',phase:'Phase 1',status:'Quote required',desc:'每個 metabolite 可分開勾選；真正預算按分析方法計價，避免把同一套 method 重複收費。'},
 {id:'tca',title:'Glycolysis / TCA panel',phase:'Phase 1 pilot-dependent',status:'Official published price',desc:'glucose、pyruvate、lactate、citrate、succinate、α-KG、fumarate、malate；官方 2,000/sample，但目前公開 matrix 為 plasma/serum/cell，尿液仍需確認。'},
 {id:'short16s',title:'Short-read 16S V3–V4 (MiniSeq)',phase:'Phase 1 multi-omics',status:'Official published price',desc:'PCR、QC、chip 拆開計價；microbiome DNA extraction 與建庫試劑仍需確認。'},
 {id:'nanopore16s',title:'Full-length 16S – Nanopore',phase:'Phase 1 alternative',status:'Official published price',desc:'官方有 Nanopore multiplex library prep + R10 chip；full-length 16S-specific amplification/reagent workflow 需核心確認。'},
 {id:'pacbio16s',title:'Full-length 16S – PacBio HiFi',phase:'Phase 1 alternative',status:'Quote required',desc:'院內生物資訊可分析 PacBio，但目前查到的公開收費頁未提供 PacBio HiFi sequencing price。'},
 {id:'bacterialLoad',title:'Total bacterial load qPCR / ddPCR',phase:'Phase 1 QC',status:'Official published price',desc:'儀器/耗材有官方單價；primers/probes/standards、每批容量與完整 workflow 需核心確認。'},
 {id:'bioinfo',title:'Bioinformatics / multi-omics integration',phase:'Phase 1',status:'Official published price',desc:'按時數計費；小樣本、FDR、batch、contamination 與 multi-omics integration。'},
 {id:'ev',title:'Urinary EV pilot – SEC + NTA + nano-flow',phase:'Phase 2',status:'Official published price',desc:'官方服務有 SEC/NTA/CytoFLEX nano 單價；尿液 matrix 與保存 SOP 尚須確認。'},
 {id:'proteomics',title:'Urinary proteomics',phase:'Phase 2',status:'Quote required',desc:'injury/fibrosis/remodeling discovery；目前不放 Phase 1 必要預算。'},
 {id:'wgs',title:'Selected-sample shotgun WGS',phase:'Phase 2',status:'Quote required',desc:'選定樣本再做；low biomass / host DNA / host-depletion bias 必須先證明可行。'},
 {id:'seahorse',title:'Seahorse mechanistic validation',phase:'Phase 3',status:'Quote required',desc:'XF Pro 可做 mitochondrial respiration/glycolysis/ATP rate；正式 XF Pro consumables 需詢價。'},
 {id:'nanolive',title:'Nanolive cell imaging',phase:'Phase 3',status:'Official published price',desc:'未來 smooth-muscle/hypoxia/ischemia cell model。'},
 {id:'isolate',title:'Candidate bacterial isolation',phase:'Phase 3',status:'Official published price',desc:'官方 40,000/strain 為腸道厭氧菌平台；urinary/vaginal isolate applicability 需確認。'}
];

function analysisN(){return state.duN+state.booN}
function seqBioN(){return state.urineN*state.urineRep+state.vaginaN*state.vaginaRep}
function seqTotalN(){return seqBioN()+state.negativeControls+state.positiveControls+state.technicalReplicates+state.qcSamples}
function parseMaybe(v){const x=Number(v);return Number.isFinite(x)&&v!==''?x:null}
function money(x){return TWD.format(Math.round(x||0))}
function statusClass(s){return s.startsWith('Official')?'official':s.startsWith('Preliminary')?'preliminary':'quote'}

function line({module,item,core,status,type='variable',qty=1,unitPrice=null,assumptionPrice=null,source='',note='',published='',urineConfirmed=true}){
 const official = status==='Official published price' && unitPrice!=null && urineConfirmed;
 const planningUnit = assumptionPrice!=null?assumptionPrice:unitPrice;
 const hasPlanning = planningUnit!=null;
 return {module,item,core,status,type,qty,unitPrice,planningUnit,officialCost:official?qty*unitPrice:0,planningCost:hasPlanning?qty*planningUnit:0,pending:!hasPlanning || (!urineConfirmed && assumptionPrice==null),source,note,published};
}

function budgetLines(){
 const a=state.assumption, n=analysisN(), seqN=seqTotalN(); const out=[];
 if(state.module.biobank){out.push(line({module:'Biobank',item:'General collection / cryovials / labels / boxes',core:'Study operations',status:'Preliminary estimate',type:'variable',qty:state.biobankN,assumptionPrice:a.biobankPerPerson,note:'Planning placeholder; not an NTUH core published price'}));}
 if(state.module.targeted){
  out.push(line({module:'Targeted metabolomics',item:'Pre-analytic feasibility',core:'Metabolomics',status:'Preliminary estimate',type:'fixed',qty:1,assumptionPrice:a.preanalyticFixed,note:'6–8 urine specimens; only for handling/stability/SOP feasibility'}));
  if(a.metabolomicsPricingMode==='envelope'){
   out.push(line({module:'Targeted metabolomics',item:'Temporary method-development envelope',core:'Metabolomics',status:'Preliminary estimate',type:'fixed',qty:1,assumptionPrice:a.tier1Dev,note:'Previous global placeholder; not an analyte-specific quote'}));
   out.push(line({module:'Targeted metabolomics',item:'Temporary formal-assay envelope',core:'Metabolomics',status:'Preliminary estimate',type:'variable',qty:n,assumptionPrice:a.tier1PerSample,note:'Previous global placeholder; switch to method-level pricing after core quotes'}));
  }else{
   metaboliteMethods.forEach(g=>{
    const active=g.analytes.filter(x=>state.metabolites[x.id]);
    if(!active.length)return;
    const dev=a[g.id+'Dev'];
    const per=a[g.id+'PerSample'];
    const names=active.map(x=>x.label).join(' + ');
    out.push(line({module:'Targeted metabolomics',item:`${g.title} – method development (${names})`,core:'Metabolomics',status:'Quote required',type:'fixed',qty:1,assumptionPrice:dev,note:'Enter 0 if the core explicitly includes this in another method quote'}));
    out.push(line({module:'Targeted metabolomics',item:`${g.title} – formal assay (${names})`,core:'Metabolomics',status:'Quote required',type:'variable',qty:n,assumptionPrice:per,note:'Per analyzed participant; enter 0 only if explicitly included elsewhere'}));
   });
  }
 }
 if(state.module.tca){
  out.push(line({module:'TCA panel',item:'Glycolysis/TCA relative quantification',core:'Metabolomics',status:'Official published price',type:'variable',qty:n,unitPrice:2000,assumptionPrice:2000,source:URLS.metabolomics,published:'page current',urineConfirmed:false,note:'Published for plasma/serum/cell; urine validation/quote required'}));
  if(a.tcaUrineExtra!=null)out.push(line({module:'TCA panel',item:'Urine matrix validation extra assumption',core:'Metabolomics',status:'Preliminary estimate',type:'fixed',qty:1,assumptionPrice:a.tcaUrineExtra,note:'User-entered planning assumption'}));
 }
 if(state.module.short16s){
  out.push(line({module:'Short-read 16S',item:'16S V3–V4 PCR incl. capillary electrophoresis',core:'Sequencing',status:'Official published price',qty:seqN,unitPrice:130,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Short-read 16S',item:'Qubit DNA QC',core:'Sequencing',status:'Official published price',qty:seqN,unitPrice:120,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  if(a.shortLibraryPrep)out.push(line({module:'Short-read 16S',item:'NGS DNA library preparation service',core:'Sequencing',status:'Official published price',qty:seqN,unitPrice:700,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01',note:'Library reagents excluded; applicability to 16S workflow must be confirmed'}));
  const chip=a.miniSeqMode==='HO300'?87000:32000;
  out.push(line({module:'Short-read 16S',item:a.miniSeqMode==='HO300'?'MiniSeq High Output 300 cycles':'MiniSeq Midi Output 300 cycles',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.miniSeqChips,unitPrice:chip,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Short-read 16S',item:'Low-biomass urine/vaginal DNA extraction',core:'Sequencing / microbiome',status:'Quote required',qty:seqN,assumptionPrice:a.microbiomeExtractionPerSample,source:URLS.sequencing,note:'Public page does not provide a validated urine-microbiome extraction price'}));
 }
 if(state.module.nanopore16s){
  out.push(line({module:'Nanopore full-length 16S',item:'Qubit DNA QC',core:'Sequencing',status:'Official published price',qty:seqN,unitPrice:120,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Nanopore full-length 16S',item:'Nanopore multiplex library preparation',core:'Sequencing',status:'Official published price',qty:seqN,unitPrice:1100,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Nanopore full-length 16S',item:'Nanopore R10 chip',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.nanoporeChips,unitPrice:45000,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Nanopore full-length 16S',item:'Full-length 16S amplification / platform-specific reagents',core:'Sequencing',status:'Quote required',type:'fixed',qty:1,assumptionPrice:a.nanoporeFullLengthExtra,source:URLS.sequencing,note:'Not separately priced on public page'}));
 }
 if(state.module.pacbio16s){out.push(line({module:'PacBio HiFi full-length 16S',item:'External / institutional complete workflow',core:'Sequencing',status:'Quote required',qty:seqN,assumptionPrice:a.pacbioPerSample,note:'NTUH bioinformatics supports PacBio analysis; public sequencing price not found'}));}
 if(state.module.bacterialLoad){
  out.push(line({module:'Bacterial load',item:'qPCR instrument',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.qPCRRuns,unitPrice:60,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01',note:'60 / 2.5 h / run; assay reagents/standards not included'}));
  out.push(line({module:'Bacterial load',item:'ddPCR oil',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.ddpcrOilBottles,unitPrice:2650,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Bacterial load',item:'ddPCR cartridge',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.ddpcrCartridgePlates,unitPrice:1100,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Bacterial load',item:'ddPCR plate',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.ddpcrPlates,unitPrice:250,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Bacterial load',item:'ddPCR droplet generation + amplification',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.ddpcrRuns,unitPrice:50,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Bacterial load',item:'ddPCR detection',core:'Sequencing',status:'Official published price',type:'fixed',qty:a.ddpcrHours,unitPrice:1000,source:URLS.sequencing,published:'2025-10-15 / effective 2025-11-01'}));
  out.push(line({module:'Bacterial load',item:'Primers/probes/standards + workflow-specific reagents',core:'Sequencing',status:'Quote required',type:'fixed',qty:1,assumptionPrice:a.bacterialLoadReagents,note:'Cannot be inferred from instrument charges'}));
 }
 if(state.module.bioinfo){out.push(line({module:'Bioinformatics',item:'High-throughput / multi-omics analysis',core:'Bioinformatics',status:'Official published price',type:'variable',qty:state.bioinfoHours,unitPrice:500,source:URLS.bioinfo,published:'page current'}));}
 if(state.module.ev){
  out.push(line({module:'EV pilot',item:'Size Exclusion Chromatography',core:'Sequencing / EV',status:'Official published price',qty:a.evN,unitPrice:800,assumptionPrice:800,source:URLS.sequencing,urineConfirmed:false,note:'Urine applicability not explicitly confirmed'}));
  out.push(line({module:'EV pilot',item:'NTA delegated analysis',core:'Sequencing / EV',status:'Official published price',qty:a.evN,unitPrice:500,assumptionPrice:500,source:URLS.sequencing,urineConfirmed:false,note:'Urine applicability not explicitly confirmed'}));
  out.push(line({module:'EV pilot',item:'CytoFLEX nano',core:'Sequencing / EV',status:'Official published price',type:'fixed',qty:a.evNanoHours,unitPrice:300,assumptionPrice:300,source:URLS.sequencing,urineConfirmed:false,note:'Urine EV workflow to confirm'}));
 }
 if(state.module.proteomics){out.push(line({module:'Proteomics',item:'Urinary proteomics',core:'Proteomics',status:'Quote required',qty:n,assumptionPrice:a.proteomicsPerSample,note:'Future Phase 2; no official price entered'}));}
 if(state.module.wgs){out.push(line({module:'Selected WGS',item:'Shotgun WGS complete workflow',core:'Sequencing',status:'Quote required',qty:a.wgsN,assumptionPrice:a.wgsPerSample,note:'Selected samples only; low-biomass feasibility first'}));}
 if(state.module.seahorse){
  out.push(line({module:'Mechanistic validation',item:'Seahorse XFe24 Mito Stress reference',core:'Immune',status:'Official published price',type:'fixed',qty:a.seahorseRuns,unitPrice:4400,source:URLS.seahorseOld,published:'page current',note:'Reference future cell-model cost; XF Pro price is separate'}));
  out.push(line({module:'Mechanistic validation',item:'Seahorse XF Pro / Real-Time ATP workflow',core:'Immune',status:'Quote required',type:'fixed',qty:1,assumptionPrice:a.seahorseProQuote,source:URLS.seahorsePro,note:'XF Pro consumables/reagents fluctuate'}));
 }
 if(state.module.nanolive){
  out.push(line({module:'Cell imaging',item:'Nanolive time-lapse',core:'Immune',status:'Official published price',type:'fixed',qty:a.nanoliveDays,unitPrice:300,source:URLS.nanolive,published:'page current'}));
  out.push(line({module:'Cell imaging',item:'Nanolive image analysis',core:'Immune',status:'Official published price',type:'fixed',qty:a.nanoliveAnalyses,unitPrice:400,source:URLS.nanolive,published:'page current'}));
 }
 if(state.module.isolate){out.push(line({module:'Microbial validation',item:'Anaerobic strain isolation reference',core:'Microbiome',status:'Official published price',type:'variable',qty:a.isolateStrains,unitPrice:40000,assumptionPrice:40000,source:URLS.microbiome,urineConfirmed:false,note:'Official service is gut anaerobes; urinary/vaginal isolates require discussion'}));}
 return out;
}


function tierClass(t){return t==='Tier 1'?'tier1':t==='Tier 2'?'tier2':t==='Tier 3'?'tier3':'futurechip'}
function activeAnalytesForMethod(g){return g.analytes.filter(x=>state.metabolites[x.id])}
function selectedMetaboliteCount(){return Object.values(state.metabolites).filter(Boolean).length}
function activeMethodCount(){return metaboliteMethods.filter(g=>activeAnalytesForMethod(g).length).length}
function renderTargetedModule(m,lines){
 const enabled=state.module.targeted;
 const a=state.assumption;
 const costLines=enabled?lines.filter(x=>x.module==='Targeted metabolomics'):[];
 const analyteHtml=metaboliteMethods.map(g=>`<section class="analyte-group"><h5>${g.title}</h5><p class="method-note">${g.note}</p><div class="analyte-list">${g.analytes.map(x=>`<label class="analyte-row"><input type="checkbox" data-metabolite="${x.id}" ${state.metabolites[x.id]?'checked':''}><span class="analyte-name">${x.label}<span class="analyte-role">${x.role}</span></span><span class="tier-chip ${tierClass(x.tier)}">${x.tier}</span></label>`).join('')}</div></section>`).join('');
 const methodRows=metaboliteMethods.map(g=>{
  const active=activeAnalytesForMethod(g); if(!active.length)return '';
  return `<div class="method-quote"><div><strong>${g.title}</strong><small>目前勾選：${active.map(x=>x.label).join('、')}</small></div><label>方法建立 / 固定費<input data-assumption="${g.id}Dev" type="number" min="0" step="100" value="${a[g.id+'Dev']??''}" placeholder="待詢價"></label><label>每位正式樣本<input data-assumption="${g.id}PerSample" type="number" min="0" step="100" value="${a[g.id+'PerSample']??''}" placeholder="待詢價"></label></div>`;
 }).join('') || '<div class="method-empty">目前沒有勾選 metabolite。</div>';
 const pricingBody=a.metabolomicsPricingMode==='envelope'
  ? `<div class="method-quotes"><div class="method-quote"><div><strong>目前先用原本的總包暫估</strong><small>只是 proposal planning placeholder，不代表任何 analyte 的正式報價。</small></div><label>方法建立暫估<input data-assumption="tier1Dev" type="number" min="0" step="1000" value="${a.tier1Dev??''}"></label><label>每位正式樣本暫估<input data-assumption="tier1PerSample" type="number" min="0" step="100" value="${a.tier1PerSample??''}"></label></div></div>`
  : `<div class="method-quotes">${methodRows}<div class="quote-zero-note">如果核心明確說某一組 analytes 已包含在另一套 method 的報價裡，該組可填 0；不要在未確認時自行填 0。</div></div>`;
 const costs=enabled&&costLines.length?costLines.map(x=>`<div class="metab-cost-line"><span><b>${x.item}</b><br><small>${x.status}${x.pending?' · 待補報價':''}</small></span><span class="price">${x.planningUnit==null?'待詢價':`${money(x.planningUnit)} × ${N.format(x.qty)}`}</span></div>`).join(''):'<p class="module-sub">啟用後顯示預算。</p>';
 return `<article class="module targeted-module"><div class="module-head"><input class="module-check" type="checkbox" data-module="targeted" ${enabled?'checked':''}><div><h3>${m.title}<span class="selected-count">已選 ${selectedMetaboliteCount()} 項 / ${activeMethodCount()} 組 method</span></h3><p class="module-sub">${m.desc}</p></div><div class="tags"><span class="tag quote">Quote required</span><span class="tag phase1">Phase 1</span></div></div>${enabled?`<div class="metab-help"><b>怎麼看：</b>你可以勾很多 metabolite，但實驗室不一定要開同樣多套方法。例如 ATP、ADP、AMP、adenosine 若能同一套 method 併測，預算只算一次方法建立 + 每個樣本一次 assay。</div><div class="metab-step"><h4>1. 要測哪些 metabolite？</h4><p>先選生物學問題；勾選本身不等於「多收一次錢」。真正成本看它落在哪一套分析方法。</p><div class="analyte-groups">${analyteHtml}</div></div><div class="metab-step"><h4>2. 現在用哪種方式估價？</h4><div class="pricing-mode"><div class="pricing-mode-box"><label>估價模式<select data-assumption="metabolomicsPricingMode"><option value="envelope" ${a.metabolomicsPricingMode==='envelope'?'selected':''}>會議前：沿用總包暫估</option><option value="method" ${a.metabolomicsPricingMode==='method'?'selected':''}>拿到報價後：逐方法計價</option></select></label><label style="margin-top:10px">Pre-analytic feasibility 暫估<input data-assumption="preanalyticFixed" type="number" min="0" step="1000" value="${a.preanalyticFixed??''}"></label><div class="pricing-explain">會議前不知道每套方法多少錢時，用「總包暫估」比較誠實；許博士/代謝體核心給你實際報價後，再切到「逐方法計價」。</div></div>${pricingBody}</div></div><div class="metab-step"><h4>3. 目前代謝體預算怎麼算？</h4><div class="metab-cost-summary">${costs}</div></div>`:'<div class="module-body"><p class="module-sub">目前未納入預算。</p></div>'}</article>`;
}

function assumptionFields(m){
 const a=state.assumption; const input=(key,label,value,step=100)=>`<label>${label}<input class="module-input" data-assumption="${key}" type="number" min="0" step="${step}" value="${value??''}" placeholder="待詢價"></label>`;
 if(m.id==='biobank')return input('biobankPerPerson','一般採檢/保存暫估（每 enrollment）',a.biobankPerPerson);
 if(m.id==='targeted')return ''; // special renderer handles targeted metabolomics
 if(m.id==='tca')return input('tcaUrineExtra','尿液 matrix-validation 額外暫估',a.tcaUrineExtra);
 if(m.id==='short16s')return `<label>MiniSeq mode<select class="module-input" data-assumption="miniSeqMode"><option value="MO300" ${a.miniSeqMode==='MO300'?'selected':''}>Midi 300 cycles – 32,000/chip</option><option value="HO300" ${a.miniSeqMode==='HO300'?'selected':''}>High Output 300 cycles – 87,000/chip</option></select></label>`+input('miniSeqChips','Chip 數',a.miniSeqChips,1)+input('microbiomeExtractionPerSample','Low-biomass DNA extraction 暫估 / entry',a.microbiomeExtractionPerSample)+`<label><span><input data-assumption="shortLibraryPrep" type="checkbox" ${a.shortLibraryPrep?'checked':''}> 加入 NGS library-prep service 700/sample</span><small>是否適用 16S workflow 需核心確認；建庫試劑另計。</small></label>`;
 if(m.id==='nanopore16s')return input('nanoporeChips','R10 chip 數',a.nanoporeChips,1)+input('nanoporeFullLengthExtra','Full-length 16S PCR/reagent 額外暫估',a.nanoporeFullLengthExtra);
 if(m.id==='pacbio16s')return input('pacbioPerSample','PacBio complete workflow 暫估 / entry',a.pacbioPerSample);
 if(m.id==='bacterialLoad')return input('bacterialLoadReagents','Primers/probes/standards 暫估',a.bacterialLoadReagents)+input('qPCRRuns','qPCR runs (60/run)',a.qPCRRuns,1)+input('ddpcrOilBottles','ddPCR oil bottles',a.ddpcrOilBottles,1)+input('ddpcrCartridgePlates','ddPCR cartridge plates',a.ddpcrCartridgePlates,1)+input('ddpcrPlates','ddPCR plates',a.ddpcrPlates,1)+input('ddpcrRuns','ddPCR generation runs',a.ddpcrRuns,1)+input('ddpcrHours','ddPCR detection hours',a.ddpcrHours,1);
 if(m.id==='ev')return input('evN','EV pilot sample N',a.evN,1)+input('evNanoHours','Nano-flow hours',a.evNanoHours,1);
 if(m.id==='proteomics')return input('proteomicsPerSample','Proteomics 暫估 / sample',a.proteomicsPerSample);
 if(m.id==='wgs')return input('wgsN','Selected WGS sample N',a.wgsN,1)+input('wgsPerSample','WGS 暫估 / sample',a.wgsPerSample);
 if(m.id==='seahorse')return input('seahorseRuns','XFe24 reference runs',a.seahorseRuns,1)+input('seahorseProQuote','XF Pro planning quote',a.seahorseProQuote);
 if(m.id==='nanolive')return input('nanoliveDays','Time-lapse days',a.nanoliveDays,1)+input('nanoliveAnalyses','Image-analysis sessions',a.nanoliveAnalyses,1);
 if(m.id==='isolate')return input('isolateStrains','Candidate strains',a.isolateStrains,1);
 return '<p>No additional assumptions.</p>';
}

function renderModules(){
 const lines=budgetLines();
 document.getElementById('module-list').innerHTML=modules.map(m=>{
  if(m.id==='targeted')return renderTargetedModule(m,lines);
  const ml=lines.filter(x=>x.module.toLowerCase().includes(m.id==='short16s'?'short-read':m.id==='nanopore16s'?'nanopore':m.id==='pacbio16s'?'pacbio':m.id==='bacterialLoad'?'bacterial':m.id==='biobank'?'biobank':m.id==='tca'?'tca':m.id==='bioinfo'?'bioinformatics':m.id==='ev'?'ev':m.id==='proteomics'?'proteomics':m.id==='wgs'?'wgs':m.id==='seahorse'?'mechanistic':m.id==='nanolive'?'cell imaging':'microbial'));
  const enabled=state.module[m.id];
  const costHtml=enabled&&ml.length?ml.map(x=>`<div class="cost-line"><span>${x.item}<br><small>${x.status}${x.pending?' · pending/assumption needed':''}</small></span><span class="price">${x.planningUnit==null?'待詢價':`${money(x.planningUnit)} × ${N.format(x.qty)}`}</span></div>`).join(''):'<p class="module-sub">啟用後顯示成本明細。</p>';
  return `<article class="module"><div class="module-head"><input class="module-check" type="checkbox" data-module="${m.id}" ${enabled?'checked':''}><div><h3>${m.title}</h3><p class="module-sub">${m.desc}</p></div><div class="tags"><span class="tag ${statusClass(m.status)}">${m.status}</span><span class="tag ${m.phase.startsWith('Phase 1')?'phase1':'future'}">${m.phase}</span></div></div><div class="module-body"><div class="cost-lines">${costHtml}</div><div class="assumptions">${assumptionFields(m)}</div></div></article>`;
 }).join('');
}

function renderCatalog(){
 document.getElementById('catalogBody').innerHTML=catalog.map(x=>`<tr><td><b>${x.core}</b><br>${x.item}</td><td>${x.price==null?'待詢價':money(x.price)}</td><td>${x.unit}</td><td><span class="tag ${statusClass(x.status)}">${x.status}</span></td><td>${x.matrix}</td><td>${x.published}<br>checked ${CHECKED}</td><td><a href="${x.url}" target="_blank" rel="noopener">官方頁</a></td></tr>`).join('');
}

function powerFor(d,n1,n2,alpha=.05){if(n1<2||n2<2)return NaN;const df=n1+n2-2,ncp=d*Math.sqrt(n1*n2/(n1+n2)),crit=jStat.studentt.inv(1-alpha/2,df);return jStat.noncentralt.cdf(-crit,df,ncp)+(1-jStat.noncentralt.cdf(crit,df,ncp));}
function mde80(){let lo=.001,hi=5;for(let i=0;i<70;i++){const m=(lo+hi)/2;if(powerFor(m,state.duN,state.booN)<.8)lo=m;else hi=m}return(lo+hi)/2}

function renderDashboard(){
 const lines=budgetLines(), planning=lines.reduce((s,x)=>s+x.planningCost,0), official=lines.reduce((s,x)=>s+x.officialCost,0), pending=lines.filter(x=>x.pending);
 document.getElementById('planningTotal').textContent=money(planning);
 document.getElementById('officialSubtotal').textContent=money(official);
 document.getElementById('pendingNote').innerHTML=pending.length?`<span class="pending">${pending.length} 個 enabled cost item 尚未完整定價；planning total 不是最終報價。</span>`:'所有 enabled 項目都有 planning cost。';
 document.getElementById('costPerBiobank').textContent=state.biobankN?money(planning/state.biobankN):'—';
 document.getElementById('costPerAnalyzed').textContent=analysisN()?money(planning/analysisN()):'—';
 const r400=400000-planning,r1m=1000000-planning;
 document.getElementById('remain400').textContent=(r400>=0?'尚餘 ':'超出 ')+money(Math.abs(r400));
 document.getElementById('remain1000').textContent=(r1m>=0?'尚餘 ':'超出 ')+money(Math.abs(r1m));
 const provisional=pending.length?'（尚有待詢價，僅 provisional）':'';
 document.getElementById('remain400note').textContent=provisional;
 document.getElementById('remain1000note').textContent=provisional;
 const fixed=lines.filter(x=>x.type==='fixed').reduce((s,x)=>s+x.planningCost,0),variable=planning-fixed;
 document.getElementById('fixedVariable').innerHTML=`<div class="breakline"><b>Fixed / run-level</b><span>${money(fixed)}</span></div><div class="breakline"><b>Variable / sample-hour</b><span>${money(variable)}</span></div><div class="breakline"><b>Pending quote items</b><span>${pending.length}</span></div>`;
 const cores={};lines.forEach(x=>{cores[x.core]=(cores[x.core]||0)+x.planningCost});document.getElementById('coreBreakdown').innerHTML=Object.entries(cores).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="breakline"><b>${k}</b><span>${money(v)}</span></div>`).join('');
 const seqN=seqTotalN();const shortKnown=seqN*(130+120)+(state.assumption.miniSeqMode==='HO300'?87000:32000)*state.assumption.miniSeqChips;const nanoKnown=seqN*(1100+120)+45000*state.assumption.nanoporeChips;const delta=nanoKnown-shortKnown;
 const p=powerFor(1.06,state.duN,state.booN),m=mde80();
 const evIncrement=state.assumption.evN*(800+500)+state.assumption.evNanoHours*300;
 document.getElementById('decisionSupport').innerHTML=`
 <p><b>代謝體估價：</b>${state.assumption.metabolomicsPricingMode==='envelope'?'目前仍使用「總包暫估」。所以你勾選不同 metabolite 時，總額不會跟著一顆一顆增加；這是故意的，避免在尚未知道實驗室方法前亂算價格。':'目前使用「逐方法計價」。已勾選 '+selectedMetaboliteCount()+' 項 metabolite，分布在 '+activeMethodCount()+' 組分析方法；空白欄位代表仍待核心報價。'}</p>
 <p><b>15+15 pilot：</b>對 d=1.06 的 two-sample t-test power 約 ${(p*100).toFixed(1)}%；80% power MDE 約 d=${m.toFixed(2)}。這個樣本數主要用來找較大的生物學差異，還不是臨床診斷模型的驗證研究。</p>
 <p><b>只建庫、只分析 30 人：</b>biobank variable cost 依 enrollment=${state.biobankN} 計；targeted/16S assay 依各自 analysis N 計，因此不必把全部 banked samples 都送檢。</p>
 <p><b>Short-read vs Nanopore：</b>依目前可直接追溯的 published components、${seqN} sequencing entries 計，short-read 約 ${money(shortKnown)}，Nanopore 約 ${money(nanoKnown)}，差額 ${delta>=0?'Nanopore 多 ':'Nanopore 少 '}${money(Math.abs(delta))}。兩者都還有 workflow-specific pending costs，這不是完整報價。</p>
 <p><b>EV 第二階段：</b>若先做 ${state.assumption.evN} 件 SEC + NTA、nano-flow ${state.assumption.evNanoHours} 小時，官方單價參考的增量約 ${money(evIncrement)}；但 urine applicability / recovery 必須先確認，所以不可當正式預算。</p>
 <p><b>40 萬經費：</b>${planning<=400000?'目前 planning total 在 40 萬內，但仍需處理 pending quotes。':'目前 planning total 已超過 40 萬；優先保留 UDS + 15+15 targeted metabolomics，16S/EV/WGS 依 Phase 1 multi-omics 或後續經費分開啟動。'}</p>`;
}

function syncInputs(){['biobankN','duN','booN','urineN','vaginaN','urineRep','vaginaRep','negativeControls','positiveControls','technicalReplicates','qcSamples','bioinfoHours'].forEach(id=>document.getElementById(id).value=state[id]);document.querySelectorAll('[data-preset]').forEach(b=>b.classList.toggle('active',b.dataset.preset===state.preset));}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function load(){const raw=localStorage.getItem(STORAGE_KEY);if(raw){try{const s=JSON.parse(raw);Object.assign(state,s);state.module={...state.module,...s.module};state.metabolites={...DEFAULT_METABOLITES,...s.metabolites};state.assumption={...state.assumption,...s.assumption}}catch(e){}}}
function render(){syncInputs();renderModules();renderCatalog();renderDashboard();bindDynamic();save();}
function bindDynamic(){
 document.querySelectorAll('[data-module]').forEach(el=>el.onchange=()=>{state.module[el.dataset.module]=el.checked;state.preset='custom';render()});
 document.querySelectorAll('[data-metabolite]').forEach(el=>el.onchange=()=>{state.metabolites[el.dataset.metabolite]=el.checked;state.preset='custom';render()});
 document.querySelectorAll('[data-assumption]').forEach(el=>el.onchange=()=>{const k=el.dataset.assumption;if(el.type==='checkbox')state.assumption[k]=el.checked;else if(el.tagName==='SELECT')state.assumption[k]=el.value;else state.assumption[k]=parseMaybe(el.value);render()});
}
function bind(){
 ['biobankN','duN','booN','urineN','vaginaN','urineRep','vaginaRep','negativeControls','positiveControls','technicalReplicates','qcSamples','bioinfoHours'].forEach(id=>document.getElementById(id).onchange=e=>{state[id]=Math.max(0,Number(e.target.value)||0);render()});
 document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{const p=presets[b.dataset.preset];state.preset=b.dataset.preset;state.module={...state.module,...p.module};if(p.metabolites)state.metabolites={...p.metabolites};if(p.bioinfoHours!=null)state.bioinfoHours=p.bioinfoHours;render()});
 document.getElementById('printPlan').onclick=()=>window.print();document.getElementById('exportCsv').onclick=exportCsv;
}
function csv(v){const s=String(v??'');return `"${s.replaceAll('"','""')}"`}
function exportCsv(){const rows=[['Module','Item','Core','Price_status','Type','Quantity','Planning_unit_price_NTD','Planning_cost_NTD','Official_published_component_cost_NTD','Pending_quote','Source','Note','Checked_date'],['Targeted metabolomics','Selected analytes','','','','','','','','','',Object.entries(state.metabolites).filter(([k,v])=>v).map(([k])=>k).join('; '),CHECKED],['Targeted metabolomics','Pricing mode','','','','','','','','','',state.assumption.metabolomicsPricingMode,CHECKED]];budgetLines().forEach(x=>rows.push([x.module,x.item,x.core,x.status,x.type,x.qty,x.planningUnit??'',x.planningCost,x.officialCost,x.pending?'YES':'NO',x.source,x.note,CHECKED]));const blob=new Blob(['\ufeff'+rows.map(r=>r.map(csv).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`DU_BOO_budget_${CHECKED}.csv`;a.click();URL.revokeObjectURL(a.href)}
load();bind();render();
