import { useState, useMemo } from "react";

// ═════════════════════════════════════════════════════════════════════════════
// WARMINDO CASH MANAGEMENT SYSTEM
// Pemisahan Kas: Omset • Operasional • Modal • Cadangan • Karyawan
// Data Riil dari Daily Report 11 Mar – 5 Apr 2026
// ═════════════════════════════════════════════════════════════════════════════

const rp=n=>{const a=Math.abs(n||0);const f="Rp"+a.toLocaleString("id-ID");return n<0?"-"+f:f};
const pct=(a,b)=>b===0?"0%":(a/b*100).toFixed(1)+"%";

// ═════════════════════════════════════════════════════════════════════════════
// REAL DATA — derived from the PDF daily report
// ═════════════════════════════════════════════════════════════════════════════
const DAILY=[
{d:"11 Mar",day:"Rabu",omset:2572000,gojekK:38643,grabK:171600,qrisK:983000,bp:1247900,ops:165000,aset:0,lain:32000},
{d:"12 Mar",day:"Kamis",omset:1723800,gojekK:57600,grabK:0,qrisK:787800,bp:1095460,ops:140000,aset:351400,lain:0},
{d:"13 Mar",day:"Jumat",omset:2701000,gojekK:47307,grabK:105930,qrisK:1314000,bp:1226800,ops:284000,aset:0,lain:0},
{d:"14 Mar",day:"Sabtu",omset:1530000,gojekK:249500,grabK:137362,qrisK:531000,bp:975000,ops:155000,aset:0,lain:120000},
{d:"15 Mar",day:"Minggu",omset:2055800,gojekK:0,grabK:180400,qrisK:733000,bp:726000,ops:163000,aset:0,lain:20000},
{d:"16 Mar",day:"Senin",omset:1357000,gojekK:0,grabK:73000,qrisK:557000,bp:1979600,ops:140000,aset:0,lain:4000},
{d:"17 Mar",day:"Selasa",omset:3259300,gojekK:184000,grabK:130137,qrisK:1067000,bp:1065000,ops:145000,aset:0,lain:136800},
{d:"18 Mar",day:"Rabu",omset:3008200,gojekK:60000,grabK:661339,qrisK:1125000,bp:4388250,ops:348000,aset:14500,lain:0},
{d:"19 Mar",day:"Kamis",omset:3550200,gojekK:296100,grabK:414066,qrisK:1255000,bp:976500,ops:140000,aset:0,lain:283600},
{d:"20 Mar",day:"Jumat",omset:3508900,gojekK:239100,grabK:0,qrisK:1928800,bp:1894000,ops:140000,aset:0,lain:2780000},
{d:"22 Mar",day:"Minggu",omset:2318100,gojekK:62100,grabK:0,qrisK:804000,bp:1365700,ops:314800,aset:0,lain:0},
{d:"23 Mar",day:"Senin",omset:2317600,gojekK:330600,grabK:0,qrisK:919000,bp:1276750,ops:140000,aset:0,lain:0},
{d:"24 Mar",day:"Selasa",omset:3424800,gojekK:395200,grabK:0,qrisK:845000,bp:1392000,ops:140000,aset:0,lain:0},
{d:"25 Mar",day:"Rabu",omset:2311050,gojekK:99000,grabK:143550,qrisK:923500,bp:2399500,ops:1187953,aset:0,lain:0},
{d:"26 Mar",day:"Kamis",omset:1937980,gojekK:43600,grabK:158565,qrisK:798000,bp:1436900,ops:477600,aset:0,lain:0},
{d:"27 Mar",day:"Jumat",omset:2399052,gojekK:153600,grabK:106452,qrisK:1146000,bp:578500,ops:160000,aset:0,lain:770000},
{d:"28 Mar",day:"Sabtu",omset:2470425,gojekK:187200,grabK:428725,qrisK:917500,bp:1512950,ops:290700,aset:0,lain:1100000},
{d:"29 Mar",day:"Minggu",omset:2390365,gojekK:77200,grabK:231165,qrisK:809000,bp:2059000,ops:160000,aset:1595200,lain:0},
{d:"30 Mar",day:"Senin",omset:2153200,gojekK:40000,grabK:0,qrisK:770400,bp:941600,ops:294500,aset:31500,lain:200000},
{d:"31 Mar",day:"Selasa",omset:2809275,gojekK:54200,grabK:134475,qrisK:1187000,bp:1114500,ops:241000,aset:0,lain:50000},
{d:"1 Apr",day:"Rabu",omset:3159637,gojekK:306200,grabK:156433,qrisK:1022000,bp:1544300,ops:285000,aset:0,lain:145900},
{d:"2 Apr",day:"Kamis",omset:2854739,gojekK:43200,grabK:256239,qrisK:1022500,bp:1411000,ops:185000,aset:0,lain:50000},
{d:"3 Apr",day:"Jumat",omset:6032224,gojekK:481900,grabK:454754,qrisK:2786600,bp:8090000,ops:1740000,aset:0,lain:550000},
{d:"4 Apr",day:"Sabtu",omset:4583552,gojekK:459352,grabK:322200,qrisK:1531650,bp:3052600,ops:370000,aset:128000,lain:254200},
{d:"5 Apr",day:"Minggu",omset:5091906,gojekK:0,grabK:0,qrisK:0,bp:5536000,ops:356000,aset:95500,lain:0},
];

// Lain-lain breakdown from PDF
const LAIN_DETAIL=[
  {d:"11 Mar",items:[{n:"Batere jam",v:32000}]},
  {d:"12 Mar",items:[{n:"Stiker",v:36000},{n:"Tas hampers 5pcs",v:290000},{n:"Pita hampers",v:25400}]},
  {d:"14 Mar",items:[{n:"Tinwall 2pcs",v:56000},{n:"Sedotan 2pak",v:64000}]},
  {d:"15 Mar",items:[{n:"Keresek",v:20000}]},
  {d:"17 Mar",items:[{n:"Pulpen 2pcs",v:40800},{n:"Kertas rol 2",v:96000}]},
  {d:"18 Mar",items:[{n:"Tinwall",v:130000},{n:"Plastik vakum 4",v:153600}]},
  {d:"19 Mar",items:[{n:"Kasbon karyawan",v:550000},{n:"THR karyawan",v:2080000},{n:"Gaji casual 3org",v:150000}]},
  {d:"27 Mar",items:[{n:"Gaji Rian",v:770000}]},
  {d:"28 Mar",items:[{n:"Gaji Ica",v:1100000}]},
  {d:"30 Mar",items:[{n:"Kasbon Rizal",v:100000},{n:"Kasbon Ica",v:100000}]},
  {d:"31 Mar",items:[{n:"Kasbon Rifki",v:50000}]},
  {d:"1 Apr",items:[{n:"Batre",v:50000},{n:"Tisu toilet",v:20300},{n:"Tisu roll",v:14100},{n:"Print menu",v:61500}]},
  {d:"2 Apr",items:[{n:"Kasbon Rifki",v:50000}]},
  {d:"3 Apr",items:[{n:"Kasbon Rifki",v:500000},{n:"Kasbon Devi",v:50000}]},
  {d:"4 Apr",items:[{n:"Ziper bag",v:18000},{n:"Pulpen",v:20000},{n:"Thermal",v:48000},{n:"Faktur 3fly",v:12000},{n:"Buku kas",v:6000},{n:"Nota",v:36500},{n:"Stick note 2",v:16000},{n:"Sunlight",v:57800},{n:"WFC extra",v:13300},{n:"Muscle kaca 5",v:20000},{n:"Stella",v:28900},{n:"Swallow toilet",v:23000},{n:"Tisu 4pcs",v:111200}]},
];

const GAJI=[
  {n:"Devi",role:"Head Kitchen",pokok:1800000,kasbon:50000,net:1750000},
  {n:"Dilla",role:"Kitchen",pokok:1700000,kasbon:400000,net:1300000},
  {n:"Rizki",role:"Helper",pokok:1600000,kasbon:0,net:1600000},
  {n:"Eca",role:"Helper",pokok:1600000,kasbon:100000,net:1500000},
  {n:"Rifki",role:"Barista",pokok:1650000,kasbon:600000,net:1050000},
  {n:"Rizal",role:"Barista",pokok:1650000,kasbon:100000,net:1550000},
  {n:"Wike",role:"Waiters",pokok:1500000,kasbon:0,net:1500000},
  {n:"Elma",role:"-",pokok:3000000,kasbon:0,net:3000000},
  {n:"Iqbal",role:"-",pokok:500000,kasbon:0,net:500000},
];

// ═════════════════════════════════════════════════════════════════════════════
// COMPUTED: KAS SEPARATION LOGIC
// ═════════════════════════════════════════════════════════════════════════════
// From PDF totals (25 days, 11 Mar – 5 Apr):
// Total Omset: 76,612,011 | Total BP: 54,821,810 | Ops: 8,518,553
// Aset: ~2,216,100 | Lain: various | Saldo akhir: 1,246,726 | Total gaji: 13,250,000

const TOTALS = (() => {
  const t = { omset:0, bp:0, ops:0, aset:0, lain:0, gojekK:0, grabK:0, qrisK:0 };
  DAILY.forEach(d => { t.omset+=d.omset; t.bp+=d.bp; t.ops+=d.ops; t.aset+=d.aset; t.lain+=d.lain; t.gojekK+=d.gojekK; t.grabK+=d.grabK; t.qrisK+=d.qrisK; });
  t.totalExp = t.bp + t.ops + t.aset + t.lain;
  t.cashOmset = t.omset - t.gojekK - t.grabK - t.qrisK;
  t.grossProfit = t.omset - t.bp;
  t.netProfit = t.omset - t.totalExp;
  t.totalGaji = GAJI.reduce((s,g) => s + g.pokok, 0);
  t.totalKasbon = GAJI.reduce((s,g) => s + g.kasbon, 0);
  // THR & casual from lain
  t.thr = 2080000;
  t.gajiCasual = 150000;
  t.gajiRian = 770000;
  t.gajiIca = 1100000;
  t.totalLabor = t.totalGaji + t.thr + t.gajiCasual + t.gajiRian + t.gajiIca;
  return t;
})();

// ─── KAS POCKETS ────────────────────────────────────────────────────
const KAS_INIT = {
  kasOmset: { balance: TOTALS.omset - TOTALS.totalExp, label: "Kas Omset", desc: "Pendapatan bersih setelah semua pengeluaran", color: "#10B981", bg: "rgba(16,185,129,.1)", icon: "💰" },
  kasOperasional: { balance: 0, label: "Kas Operasional", desc: "Uang harian belanja bahan & biaya ops", color: "#F97316", bg: "rgba(249,115,22,.1)", icon: "⚙️" },
  kasModal: { balance: 454243, label: "Kas Modal / Owner", desc: "Modal awal + setoran/tarik pemilik", color: "#3B82F6", bg: "rgba(59,130,246,.1)", icon: "🏦" },
  kasCadangan: { balance: 0, label: "Kas Cadangan", desc: "Tabungan darurat & dana pengembangan", color: "#8B5CF6", bg: "rgba(139,92,246,.1)", icon: "🛡️" },
  kasKaryawan: { balance: 0, label: "Kas Karyawan", desc: "Alokasi gaji, THR, kasbon, bonus", color: "#EC4899", bg: "rgba(236,72,153,.1)", icon: "👥" },
};

// ─── STYLES ─────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
:root{
--b0:#04060C;--b1:#080C16;--b2:#0F1520;--b3:#17202F;--b4:#202D42;--bh:#1A2540;
--bd:#1A2438;--bd2:#253350;
--t1:#F1F5F9;--t2:#CBD5E1;--t3:#7C8BA1;--t4:#4F5D78;
--ac:#F97316;--acg:rgba(249,115,22,.1);
--gn:#10B981;--gng:rgba(16,185,129,.08);
--rd:#EF4444;--rdg:rgba(239,68,68,.08);
--bl:#3B82F6;--blg:rgba(59,130,246,.08);
--pr:#8B5CF6;--prg:rgba(139,92,246,.08);
--yl:#FBBF24;--ylg:rgba(251,191,36,.08);
--cn:#06B6D4;--cng:rgba(6,182,212,.08);
--pk:#EC4899;--pkg:rgba(236,72,153,.08);
--f:'Outfit',sans-serif;--fm:'JetBrains Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
.A{font-family:var(--f);background:var(--b0);color:var(--t1);min-height:100vh;display:flex}
.S{width:210px;background:var(--b1);border-right:1px solid var(--bd);display:flex;flex-direction:column;padding:14px 0;flex-shrink:0;overflow-y:auto}.S::-webkit-scrollbar{width:0}
.S-logo{display:flex;align-items:center;gap:8px;padding:0 14px;margin-bottom:18px}
.S-li{width:34px;height:34px;background:linear-gradient(135deg,#F97316,#DC2626);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 16px rgba(249,115,22,.3)}
.S-lt{font-size:14px;font-weight:800;letter-spacing:-.02em}.S-ls{font-size:7px;color:var(--t4);font-weight:700;letter-spacing:.08em}
.S-sec{padding:0 8px}
.S-lbl{font-size:7px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;padding:10px 8px 4px}
.S-item{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:500;color:var(--t3);transition:all .15s;margin-bottom:1px}
.S-item:hover{background:var(--b3);color:var(--t2)}.S-item.on{background:var(--acg);color:var(--ac);font-weight:700}
.S-em{font-size:14px;width:20px;text-align:center}
.S-sp{flex:1}
.S-ft{padding:10px 14px;border-top:1px solid var(--bd);margin-top:6px;font-size:8px;color:var(--t4);line-height:1.6}
.MN{flex:1;display:flex;flex-direction:column;overflow:hidden}
.H{height:50px;background:var(--b1);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 20px;gap:10px}
.H-t{font-size:15px;font-weight:800;letter-spacing:-.02em}.H-sp{flex:1}
.H-b{font-size:8px;color:var(--ac);background:var(--acg);padding:3px 8px;border-radius:999px;font-weight:700}
.H-p{font-family:var(--fm);font-size:10px;color:var(--t3);background:var(--b2);padding:4px 10px;border-radius:6px;border:1px solid var(--bd)}
.CT{flex:1;overflow-y:auto;padding:16px 20px}.CT::-webkit-scrollbar{width:3px}.CT::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
/* Cards */
.g{display:grid;gap:10px;margin-bottom:14px}.g5{grid-template-columns:repeat(5,1fr)}.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}.g2{grid-template-columns:repeat(2,1fr)}
.kc{border-radius:14px;padding:16px;position:relative;overflow:hidden;border:1px solid;transition:all .2s}
.kc:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.3)}
.kc-ic{font-size:24px;margin-bottom:6px}
.kc-l{font-size:10px;font-weight:600;margin-bottom:2px;opacity:.8}
.kc-v{font-size:22px;font-weight:900;font-family:var(--fm);letter-spacing:-.03em}
.kc-d{font-size:9px;opacity:.6;margin-top:4px;line-height:1.4}
.kc-pct{position:absolute;top:12px;right:12px;font-size:9px;font-weight:700;padding:2px 7px;border-radius:999px}
/* Box */
.bx{background:var(--b2);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:14px}
.bx-t{font-size:13px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.bx-t .cnt{font-size:8px;color:var(--t4);background:var(--b3);padding:2px 7px;border-radius:999px;font-weight:600;margin-left:auto}
/* Table */
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{text-align:left;font-size:8px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;padding:7px 10px;border-bottom:1px solid var(--bd);background:var(--b2);position:sticky;top:0;z-index:1}
.tbl th.r{text-align:right}
.tbl td{padding:6px 10px;font-size:11px;border-bottom:1px solid var(--bd);vertical-align:middle}.tbl td.r{text-align:right;font-family:var(--fm);font-weight:600;font-size:10px}
.tbl tr:hover td{background:rgba(255,255,255,.015)}
.tbl tr.tot td{background:var(--acg);font-weight:700}
.bdg{display:inline-flex;align-items:center;gap:2px;padding:2px 7px;border-radius:999px;font-size:8px;font-weight:600}
.b-gn{background:var(--gng);color:var(--gn)}.b-rd{background:var(--rdg);color:var(--rd)}.b-bl{background:var(--blg);color:var(--bl)}
.b-yl{background:var(--ylg);color:var(--yl)}.b-pr{background:var(--prg);color:var(--pr)}.b-ac{background:var(--acg);color:var(--ac)}
.b-cn{background:var(--cng);color:var(--cn)}.b-pk{background:var(--pkg);color:var(--pk)}
/* Bars */
.bars{display:flex;align-items:flex-end;gap:4px;height:120px;padding:14px 0 0}
.bar-c{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
.bar{width:100%;border-radius:4px 4px 0 0;transition:height .6s cubic-bezier(.4,0,.2,1);min-height:2px}
.bar-l{font-size:7px;color:var(--t4);text-align:center;white-space:nowrap}.bar-v{font-size:7px;color:var(--t3);font-family:var(--fm);font-weight:700}
/* HBar */
.hb{display:flex;align-items:center;gap:8px;padding:5px 0}
.hb-l{font-size:11px;color:var(--t2);width:110px;flex-shrink:0;font-weight:500}
.hb-tr{flex:1;height:8px;background:var(--b4);border-radius:4px;overflow:hidden}
.hb-fl{height:100%;border-radius:4px;transition:width .6s}
.hb-v{font-family:var(--fm);font-size:10px;font-weight:700;min-width:90px;text-align:right}
/* Flow diagram */
.flow{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;margin:16px 0}
.flow-box{padding:10px 14px;border-radius:10px;text-align:center;min-width:100px;border:1px solid}
.flow-box .fl-v{font-size:14px;font-weight:800;font-family:var(--fm)}
.flow-box .fl-l{font-size:9px;margin-top:2px}
.flow-arrow{font-size:18px;color:var(--t4)}
/* Waterfall */
.wf-row{display:flex;align-items:center;padding:8px 0;border-bottom:1px solid var(--bd)}
.wf-l{flex:1;font-size:12px;font-weight:500}
.wf-bar{width:200px;height:20px;position:relative;margin:0 12px}
.wf-fill{height:100%;border-radius:4px;position:absolute;top:0}
.wf-v{font-family:var(--fm);font-size:11px;font-weight:700;min-width:100px;text-align:right}
/* Tabs */
.tabs{display:flex;gap:3px;margin-bottom:12px;flex-wrap:wrap}
.tab{padding:5px 12px;border:1px solid var(--bd);background:var(--b2);color:var(--t4);border-radius:999px;font-size:10px;font-weight:600;font-family:var(--f);cursor:pointer;transition:all .15s}
.tab:hover{border-color:var(--t4)}.tab.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}
/* Transfer card */
.tf-card{background:var(--b3);border:1px solid var(--bd);border-radius:10px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px}
.tf-icon{font-size:20px}
.tf-info{flex:1}
.tf-amount{font-family:var(--fm);font-size:13px;font-weight:700}
/* Anim */
.pe{animation:pe .3s ease}@keyframes pe{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1100px){.g5{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.S{width:52px}.S-lt,.S-ls,.S-lbl,.S-item span:not(.S-em),.S-ft{display:none}.S-item{justify-content:center;padding:8px}.g5,.g4,.g3{grid-template-columns:repeat(2,1fr)}}
`;

// ═════════════════════════════════════════════════════════════════════════════
// PAGES
// ═════════════════════════════════════════════════════════════════════════════

const KasCard=({icon,label,balance,desc,color,bg,pctLabel})=>(
  <div className="kc" style={{background:bg,borderColor:color+"33"}}>
    <div className="kc-ic">{icon}</div>
    <div className="kc-l" style={{color}}>{label}</div>
    <div className="kc-v" style={{color}}>{rp(balance)}</div>
    <div className="kc-d">{desc}</div>
    {pctLabel&&<div className="kc-pct" style={{background:bg,color}}>{pctLabel}</div>}
  </div>
);

const HBar=({label,value,max,color,display})=>(
  <div className="hb"><div className="hb-l">{label}</div><div className="hb-tr"><div className="hb-fl" style={{width:`${Math.min(Math.abs(value)/max*100,100)}%`,background:color}}/></div><div className="hb-v" style={{color}}>{display||rp(value)}</div></div>
);

// ── OVERVIEW ────────────────────────────────────────────────────
const OverviewPage=()=>{
  const T=TOTALS;
  const saldoAkhir=1246726;
  const laba=T.omset-T.bp-T.ops;
  const labaSetelahGaji=laba-T.totalLabor;
  const maxOmset=Math.max(...DAILY.map(d=>d.omset));

  // Recommended kas split
  const recOps=Math.round(T.omset*.35); // 35% for daily ops
  const recCadangan=Math.round(T.omset*.05); // 5% emergency
  const recKaryawan=T.totalLabor;
  const recOwner=Math.round(labaSetelahGaji*.5); // 50% profit to owner
  const recOmsetKas=saldoAkhir;

  return(<div className="pe">
    {/* Status: Masalah Sekarang */}
    <div className="bx" style={{background:"var(--rdg)",borderColor:"rgba(239,68,68,.2)"}}>
      <div className="bx-t" style={{color:"var(--rd)"}}>⚠️ Masalah: Uang Campur Jadi Satu</div>
      <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.7}}>
        Dari data laporan harian, semua uang masuk ke satu pot <b>"Sisa Uang"</b> tanpa pemisahan. Ini menyebabkan:
        uang omset tercampur modal, gaji karyawan diambil dari kas harian, tidak jelas berapa laba bersih pemilik,
        tidak ada dana darurat terpisah, dan sulit tracking pinjaman karyawan (kasbon).
      </div>
    </div>

    {/* 5 Kas Pockets */}
    <div style={{fontSize:13,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>💼 Rekomendasi Pemisahan 5 Kas</div>
    <div className="g g5">
      <KasCard icon="💰" label="Kas Omset" balance={saldoAkhir} desc="Saldo omset bersih hari ini" color="var(--gn)" bg="var(--gng)" pctLabel="Aktif"/>
      <KasCard icon="⚙️" label="Kas Operasional" balance={T.bp+T.ops} desc="Bahan pokok + biaya harian" color="var(--ac)" bg="var(--acg)" pctLabel={pct(T.bp+T.ops,T.omset)}/>
      <KasCard icon="🏦" label="Kas Modal" balance={454243} desc="Modal awal pemilik" color="var(--bl)" bg="var(--blg)" pctLabel="Owner"/>
      <KasCard icon="🛡️" label="Kas Cadangan" balance={0} desc="Belum ada alokasi!" color="var(--pr)" bg="var(--prg)" pctLabel="⚠️ 0"/>
      <KasCard icon="👥" label="Kas Karyawan" balance={T.totalLabor} desc="Gaji + THR + Kasbon" color="var(--pk)" bg="var(--pkg)" pctLabel={`${GAJI.length} org`}/>
    </div>

    {/* Arus Kas Flow */}
    <div className="bx">
      <div className="bx-t">📊 Arus Kas: Dari Mana ke Mana?</div>
      <div className="flow">
        <div className="flow-box" style={{background:"var(--gng)",borderColor:"var(--gn)"}}><div style={{fontSize:18}}>💰</div><div className="fl-v" style={{color:"var(--gn)"}}>{rp(T.omset)}</div><div className="fl-l" style={{color:"var(--gn)"}}>Omset Masuk</div></div>
        <div className="flow-arrow">→</div>
        <div className="flow-box" style={{background:"var(--rdg)",borderColor:"var(--rd)"}}><div style={{fontSize:18}}>🥬</div><div className="fl-v" style={{color:"var(--rd)"}}>{rp(T.bp)}</div><div className="fl-l" style={{color:"var(--rd)"}}>Bahan Pokok</div></div>
        <div className="flow-arrow">→</div>
        <div className="flow-box" style={{background:"var(--ylg)",borderColor:"var(--yl)"}}><div style={{fontSize:18}}>⚙️</div><div className="fl-v" style={{color:"var(--yl)"}}>{rp(T.ops)}</div><div className="fl-l" style={{color:"var(--yl)"}}>Operasional</div></div>
        <div className="flow-arrow">→</div>
        <div className="flow-box" style={{background:"var(--pkg)",borderColor:"var(--pk)"}}><div style={{fontSize:18}}>👥</div><div className="fl-v" style={{color:"var(--pk)"}}>{rp(T.totalLabor)}</div><div className="fl-l" style={{color:"var(--pk)"}}>Karyawan</div></div>
        <div className="flow-arrow">→</div>
        <div className="flow-box" style={{background:laba-T.totalLabor>0?"var(--gng)":"var(--rdg)",borderColor:laba-T.totalLabor>0?"var(--gn)":"var(--rd)"}}><div style={{fontSize:18}}>{labaSetelahGaji>0?"📈":"📉"}</div><div className="fl-v" style={{color:labaSetelahGaji>0?"var(--gn)":"var(--rd)"}}>{rp(labaSetelahGaji)}</div><div className="fl-l" style={{color:labaSetelahGaji>0?"var(--gn)":"var(--rd)"}}>Sisa Laba</div></div>
      </div>
    </div>

    {/* Waterfall P&L */}
    <div className="bx">
      <div className="bx-t">📉 Waterfall: Omset → Laba Bersih</div>
      {[
        {l:"Omset Kotor",v:T.omset,c:"var(--gn)",type:"+"},
        {l:"(-) Bahan Pokok",v:-T.bp,c:"var(--rd)",type:"-"},
        {l:"= Laba Kotor",v:T.grossProfit,c:T.grossProfit>0?"var(--gn)":"var(--rd)",type:"="},
        {l:"(-) Operasional",v:-T.ops,c:"var(--yl)",type:"-"},
        {l:"(-) Aset",v:-T.aset,c:"var(--cn)",type:"-"},
        {l:"(-) Lain-lain",v:-T.lain,c:"var(--pr)",type:"-"},
        {l:"= Laba Operasional",v:T.netProfit,c:T.netProfit>0?"var(--gn)":"var(--rd)",type:"="},
        {l:"(-) Total Gaji+THR",v:-T.totalLabor,c:"var(--pk)",type:"-"},
        {l:"= LABA BERSIH OWNER",v:T.netProfit-T.totalLabor,c:T.netProfit-T.totalLabor>0?"var(--gn)":"var(--rd)",type:"="},
      ].map((r,i)=>(
        <div key={i} className="wf-row" style={r.type==="="?{background:"var(--b3)",borderRadius:6,margin:"4px 0",padding:"10px"}:{}}>
          <div className="wf-l" style={{fontWeight:r.type==="="?700:400,color:r.type==="="?"var(--t1)":"var(--t2)"}}>{r.l}</div>
          <div className="wf-bar"><div className="wf-fill" style={{width:`${Math.abs(r.v)/T.omset*100}%`,background:r.c,left:r.v>=0?0:undefined,right:r.v<0?0:undefined}}/></div>
          <div className="wf-v" style={{color:r.c,fontSize:r.type==="="?13:11}}>{rp(r.v)}</div>
        </div>
      ))}
    </div>

    {/* Omset chart */}
    <div className="bx">
      <div className="bx-t">📈 Omset Harian (25 hari)</div>
      <div className="bars" style={{height:130}}>
        {DAILY.map((d,i)=>{const avg=T.omset/DAILY.length;return(
          <div key={i} className="bar-c"><div className="bar-v">{(d.omset/1e6).toFixed(1)}</div>
            <div className="bar" style={{height:`${(d.omset/maxOmset)*110}px`,background:d.omset>=avg?"linear-gradient(180deg,var(--gn),#059669)":"linear-gradient(180deg,var(--ac),#EA580C)"}}/>
            <div className="bar-l">{d.d.split(" ")[0]}</div></div>
        )})}
      </div>
      <div style={{textAlign:"center",marginTop:6,fontSize:9,color:"var(--t4)"}}>(juta Rp) • Avg: {rp(Math.round(T.omset/DAILY.length))}/hari</div>
    </div>
  </div>);
};

// ── KAS DETAIL ────────────────────────────────────────────────────
const KasDetailPage=()=>{
  const T=TOTALS;
  const labaBersih=T.omset-T.totalExp-T.totalLabor;
  return(<div className="pe">
    <div className="bx" style={{background:"var(--gng)",borderColor:"rgba(16,185,129,.15)"}}>
      <div className="bx-t" style={{color:"var(--gn)"}}>✅ Sistem 5 Kas — Cara Kerja</div>
      <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.8}}>
        Setiap kali ada omset masuk, uang langsung dipecah ke 5 kantong berbeda.
        Tidak ada lagi "uang campur". Setiap pengeluaran harus dari kas yang benar.
      </div>
    </div>

    {/* Detailed breakdown per kas */}
    {[
      {icon:"💰",name:"Kas Omset",color:"var(--gn)",bg:"var(--gng)",desc:"Tempat semua pendapatan masuk sebelum dipecah",
        items:[
          {l:"Total omset kotor",v:T.omset,t:"+"},
          {l:"Potongan GoJek/Grab (selisih)",v:-(DAILY.reduce((s,d)=>s+(d.gojekK-0)+(d.grabK-0),0)-T.omset+T.cashOmset+T.qrisK),t:"-"},
          {l:"Transfer ke Kas Operasional",v:-(T.bp+T.ops),t:"→"},
          {l:"Transfer ke Kas Karyawan",v:-T.totalLabor,t:"→"},
          {l:"Transfer ke Kas Cadangan (rec. 5%)",v:-Math.round(T.omset*.05),t:"→"},
        ],
        saldo:1246726
      },
      {icon:"⚙️",name:"Kas Operasional",color:"var(--ac)",bg:"var(--acg)",desc:"Uang harian untuk belanja bahan & biaya operasional",
        items:[
          {l:"Terima dari Kas Omset",v:T.bp+T.ops,t:"+"},
          {l:"Belanja bahan pokok",v:-T.bp,t:"-"},
          {l:"Biaya operasional",v:-T.ops,t:"-"},
          {l:"Pembelian aset",v:-T.aset,t:"-"},
        ],
        saldo:0
      },
      {icon:"🏦",name:"Kas Modal / Owner",color:"var(--bl)",bg:"var(--blg)",desc:"Modal pemilik — setoran & penarikan",
        items:[
          {l:"Modal awal (saldo awal)",v:454243,t:"+"},
          {l:"Laba bersih tersedia tarik",v:Math.max(0,labaBersih),t:"+"},
          {l:"Penarikan owner (belum ada)",v:0,t:"-"},
        ],
        saldo:454243+Math.max(0,labaBersih)
      },
      {icon:"🛡️",name:"Kas Cadangan",color:"var(--pr)",bg:"var(--prg)",desc:"Dana darurat — idealnya 1-2 minggu biaya ops",
        items:[
          {l:"Alokasi 5% dari omset (rekomendasi)",v:Math.round(T.omset*.05),t:"+"},
          {l:"Target: 2 minggu biaya ops",v:Math.round((T.bp+T.ops)/DAILY.length*14),t:"target"},
        ],
        saldo:0
      },
      {icon:"👥",name:"Kas Karyawan",color:"var(--pk)",bg:"var(--pkg)",desc:"Gaji, THR, kasbon, bonus karyawan",
        items:[
          {l:"Terima dari Kas Omset",v:T.totalLabor,t:"+"},
          {l:"Bayar gaji pokok (9 orang)",v:-T.totalGaji,t:"-"},
          {l:"THR",v:-T.thr,t:"-"},
          {l:"Gaji casual",v:-(T.gajiCasual+T.gajiRian+T.gajiIca),t:"-"},
          {l:"Kasbon outstanding",v:-T.totalKasbon,t:"-"},
        ],
        saldo:T.totalLabor-T.totalGaji-T.thr-T.gajiCasual-T.gajiRian-T.gajiIca
      },
    ].map((kas,ki)=>(
      <div key={ki} className="bx">
        <div className="bx-t"><span style={{fontSize:18}}>{kas.icon}</span> {kas.name} <span className="cnt" style={{color:kas.color}}>Saldo: {rp(kas.saldo)}</span></div>
        <div style={{fontSize:10,color:"var(--t3)",marginBottom:10}}>{kas.desc}</div>
        <table className="tbl"><thead><tr><th>Keterangan</th><th>Tipe</th><th className="r">Jumlah</th></tr></thead>
          <tbody>{kas.items.map((it,i)=>(
            <tr key={i}><td style={{fontWeight:it.t==="+"?600:400}}>{it.l}</td>
              <td><span className={`bdg ${it.t==="+"?"b-gn":it.t==="-"?"b-rd":it.t==="→"?"b-bl":"b-yl"}`}>{it.t==="+"?"Masuk":it.t==="-"?"Keluar":it.t==="→"?"Transfer":"Target"}</span></td>
              <td className="r" style={{color:it.t==="+"||it.t==="target"?kas.color:"var(--rd)"}}>{rp(it.v)}</td>
            </tr>
          ))}</tbody></table>
      </div>
    ))}
  </div>);
};

// ── REKONSILIASI ────────────────────────────────────────────────
const RekonPage=()=>{
  const T=TOTALS;
  return(<div className="pe">
    <div className="g g3" style={{marginBottom:14}}>
      <div className="kc" style={{background:"var(--gng)",borderColor:"var(--gn)33"}}><div className="kc-ic">💰</div><div className="kc-l" style={{color:"var(--gn)"}}>Total Masuk</div><div className="kc-v" style={{color:"var(--gn)"}}>{rp(T.omset)}</div></div>
      <div className="kc" style={{background:"var(--rdg)",borderColor:"var(--rd)33"}}><div className="kc-ic">📤</div><div className="kc-l" style={{color:"var(--rd)"}}>Total Keluar</div><div className="kc-v" style={{color:"var(--rd)"}}>{rp(T.totalExp)}</div></div>
      <div className="kc" style={{background:"var(--blg)",borderColor:"var(--bl)33"}}><div className="kc-ic">🏦</div><div className="kc-l" style={{color:"var(--bl)"}}>Saldo PDF</div><div className="kc-v" style={{color:"var(--bl)"}}>{rp(1246726)}</div></div>
    </div>

    <div className="bx">
      <div className="bx-t">📋 Rekonsiliasi Harian — Omset vs Pengeluaran</div>
      <div style={{overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr><th>Tanggal</th><th className="r">Omset</th><th className="r">Bhn Pokok</th><th className="r">Ops</th><th className="r">Aset</th><th className="r">Lain</th><th className="r">Total Keluar</th><th className="r">Surplus/Defisit</th><th className="r">Sisa Kumulatif</th></tr></thead>
          <tbody>{(()=>{let cum=454243;return DAILY.map((d,i)=>{
            const tot=d.bp+d.ops+d.aset+d.lain;
            const surplus=d.omset-tot;
            cum+=surplus;
            return(<tr key={i}>
              <td style={{fontWeight:600,fontSize:10}}>{d.d}</td>
              <td className="r" style={{color:"var(--gn)"}}>{rp(d.omset)}</td>
              <td className="r" style={{color:"var(--rd)"}}>{rp(d.bp)}</td>
              <td className="r" style={{color:"var(--yl)"}}>{rp(d.ops)}</td>
              <td className="r" style={{color:d.aset?"var(--cn)":"var(--t4)"}}>{d.aset?rp(d.aset):"—"}</td>
              <td className="r" style={{color:d.lain?"var(--pk)":"var(--t4)"}}>{d.lain?rp(d.lain):"—"}</td>
              <td className="r">{rp(tot)}</td>
              <td className="r"><span className={`bdg ${surplus>=0?"b-gn":"b-rd"}`}>{surplus>=0?"+":""}{rp(surplus)}</span></td>
              <td className="r" style={{fontWeight:700,color:cum>=0?"var(--gn)":"var(--rd)"}}>{rp(cum)}</td>
            </tr>);
          })})()}</tbody>
        </table>
      </div>
    </div>

    {/* Pengeluaran Lain-lain detail */}
    <div className="bx">
      <div className="bx-t">📎 Rincian Pengeluaran "Lain-lain" <span className="cnt">{LAIN_DETAIL.length} hari</span></div>
      <div style={{fontSize:10,color:"var(--t3)",marginBottom:8}}>Item-item yang harusnya masuk ke kas yang berbeda:</div>
      {LAIN_DETAIL.map((day,i)=>(
        <div key={i} style={{marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,marginBottom:4,color:"var(--ac)"}}>{day.d} 2026</div>
          {day.items.map((it,j)=>{
            const isGaji=it.n.toLowerCase().includes("gaji")||it.n.toLowerCase().includes("thr")||it.n.toLowerCase().includes("casual");
            const isKasbon=it.n.toLowerCase().includes("kasbon");
            const kasTarget=isGaji?"👥 Kas Karyawan":isKasbon?"👥 Kas Karyawan":"⚙️ Kas Operasional";
            return(
              <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0",borderBottom:"1px solid var(--bd)",fontSize:11}}>
                <div style={{flex:1}}>{it.n}</div>
                <span className={`bdg ${isGaji||isKasbon?"b-pk":"b-yl"}`}>{kasTarget}</span>
                <div style={{fontFamily:"var(--fm)",fontSize:10,fontWeight:600,color:"var(--rd)",minWidth:80,textAlign:"right"}}>{rp(it.v)}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>);
};

// ── GAJI ────────────────────────────────────────────────────────
const GajiPage=()=>{
  const T=TOTALS;
  const totalPokok=GAJI.reduce((s,g)=>s+g.pokok,0);
  const totalKasbon=GAJI.reduce((s,g)=>s+g.kasbon,0);
  const totalNet=GAJI.reduce((s,g)=>s+g.net,0);
  const maxGaji=Math.max(...GAJI.map(g=>g.pokok));

  return(<div className="pe">
    <div className="g g4">
      <div className="kc" style={{background:"var(--pkg)",borderColor:"var(--pk)33"}}><div className="kc-ic">👥</div><div className="kc-l" style={{color:"var(--pk)"}}>Total Gaji Pokok</div><div className="kc-v" style={{color:"var(--pk)"}}>{rp(totalPokok)}</div></div>
      <div className="kc" style={{background:"var(--rdg)",borderColor:"var(--rd)33"}}><div className="kc-ic">📋</div><div className="kc-l" style={{color:"var(--rd)"}}>Total Kasbon</div><div className="kc-v" style={{color:"var(--rd)"}}>{rp(totalKasbon)}</div></div>
      <div className="kc" style={{background:"var(--gng)",borderColor:"var(--gn)33"}}><div className="kc-ic">💵</div><div className="kc-l" style={{color:"var(--gn)"}}>Total Dibayar</div><div className="kc-v" style={{color:"var(--gn)"}}>{rp(totalNet)}</div></div>
      <div className="kc" style={{background:"var(--ylg)",borderColor:"var(--yl)33"}}><div className="kc-ic">📊</div><div className="kc-l" style={{color:"var(--yl)"}}>% dari Omset</div><div className="kc-v" style={{color:"var(--yl)"}}>{pct(T.totalLabor,T.omset)}</div></div>
    </div>

    <div className="bx">
      <div className="bx-t">💰 Slip Gaji Karyawan <span className="cnt">{GAJI.length} karyawan</span></div>
      <table className="tbl"><thead><tr><th>Nama</th><th>Jabatan</th><th className="r">Gaji Pokok</th><th className="r">Kasbon</th><th className="r">Diterima</th><th>Sumber Kas</th></tr></thead>
        <tbody>{GAJI.map((g,i)=>(
          <tr key={i}>
            <td style={{fontWeight:600}}>{g.n}</td>
            <td><span className={`bdg ${g.role.includes("Head")?"b-ac":g.role.includes("Kitchen")||g.role.includes("Helper")?"b-bl":g.role.includes("Barista")?"b-pr":g.role.includes("Wait")?"b-cn":"b-yl"}`}>{g.role||"-"}</span></td>
            <td className="r">{rp(g.pokok)}</td>
            <td className="r" style={{color:g.kasbon?"var(--rd)":"var(--t4)"}}>{g.kasbon?rp(g.kasbon):"—"}</td>
            <td className="r" style={{fontWeight:700,color:"var(--gn)"}}>{rp(g.net)}</td>
            <td><span className="bdg b-pk">👥 Kas Karyawan</span></td>
          </tr>
        ))}
        <tr className="tot">
          <td colSpan={2} style={{color:"var(--ac)"}}>TOTAL</td>
          <td className="r" style={{color:"var(--ac)"}}>{rp(totalPokok)}</td>
          <td className="r" style={{color:"var(--rd)"}}>{rp(totalKasbon)}</td>
          <td className="r" style={{color:"var(--gn)"}}>{rp(totalNet)}</td>
          <td></td>
        </tr></tbody></table>
    </div>

    <div className="g g2">
      <div className="bx">
        <div className="bx-t">📊 Proporsi Gaji</div>
        {GAJI.map((g,i)=><HBar key={i} label={g.n} value={g.pokok} max={maxGaji} color="var(--pk)" display={rp(g.pokok)}/>)}
      </div>
      <div className="bx">
        <div className="bx-t">🔴 Kasbon Outstanding</div>
        {GAJI.filter(g=>g.kasbon>0).map((g,i)=><HBar key={i} label={g.n} value={g.kasbon} max={Math.max(...GAJI.map(x=>x.kasbon))} color="var(--rd)" display={rp(g.kasbon)}/>)}
        <div style={{marginTop:10,padding:10,background:"var(--rdg)",borderRadius:8,fontSize:10,color:"var(--rd)"}}>
          ⚠️ Total kasbon <b>{rp(totalKasbon)}</b> = {pct(totalKasbon,totalPokok)} dari total gaji. Rifki memiliki kasbon terbesar ({rp(600000)}).
        </div>
      </div>
    </div>
  </div>);
};

// ── REKOMENDASI ────────────────────────────────────────────────
const RekomendasiPage=()=>{
  const T=TOTALS;
  const avgDaily=Math.round(T.omset/DAILY.length);
  const avgBP=Math.round(T.bp/DAILY.length);
  const avgOps=Math.round(T.ops/DAILY.length);
  const labaBersih=T.omset-T.totalExp-T.totalLabor;

  return(<div className="pe">
    <div className="bx" style={{background:"var(--acg)",borderColor:"rgba(249,115,22,.15)"}}>
      <div className="bx-t" style={{color:"var(--ac)"}}>💡 Rekomendasi Pemisahan Kas Harian</div>
      <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.8,marginBottom:12}}>
        Berdasarkan rata-rata harian dari 24 hari data, berikut formula pembagian kas yang disarankan:
      </div>

      <div className="g g2" style={{marginBottom:0}}>
        {[
          {icon:"⚙️",name:"Kas Operasional",pct:"70%",amount:Math.round(avgDaily*.7),color:"var(--ac)",bg:"var(--acg)",rules:["Untuk belanja bahan pokok harian","Biaya operasional (makan karyawan, gas, air)","Kas kecil (ojek, parkir, dsb)","Hanya boleh dipakai untuk ops HARI INI"]},
          {icon:"💰",name:"Kas Omset",pct:"15%",amount:Math.round(avgDaily*.15),color:"var(--gn)",bg:"var(--gng)",rules:["Akumulasi laba harian","Bisa ditarik owner akhir bulan","Tracking terpisah dari modal","Target: minimal positif setiap minggu"]},
          {icon:"👥",name:"Kas Karyawan",pct:"10%",amount:Math.round(avgDaily*.1),color:"var(--pk)",bg:"var(--pkg)",rules:["Alokasi gaji (disisihkan setiap hari)","Gaji dibayar dari sini, bukan dari kas harian","Kasbon juga tercatat di sini","Target: cukup untuk 1 bulan gaji"]},
          {icon:"🛡️",name:"Kas Cadangan",pct:"5%",amount:Math.round(avgDaily*.05),color:"var(--pr)",bg:"var(--prg)",rules:["Dana darurat — JANGAN DISENTUH","Target: 2 minggu biaya ops","Untuk keadaan darurat saja","Review setiap bulan"]},
        ].map((kas,i)=>(
          <div key={i} style={{padding:14,background:kas.bg,border:`1px solid ${kas.color}33`,borderRadius:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:24}}>{kas.icon}</span>
              <div><div style={{fontSize:13,fontWeight:700,color:kas.color}}>{kas.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{kas.pct} dari omset harian</div></div>
              <div style={{marginLeft:"auto",fontSize:16,fontWeight:800,fontFamily:"var(--fm)",color:kas.color}}>{rp(kas.amount)}</div>
            </div>
            <div style={{fontSize:10,color:"var(--t3)",lineHeight:1.7}}>
              {kas.rules.map((r,j)=><div key={j}>• {r}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bx">
      <div className="bx-t">📋 SOP Harian Kasir</div>
      <div style={{fontSize:11,color:"var(--t2)",lineHeight:2}}>
        {[
          "🌅 BUKA: Hitung kas awal (seharusnya = sisa kemarin)",
          "📥 OMSET MASUK: Catat semua pemasukan (tunai, QRIS, GoFood, Grab)",
          "💰 PISAHKAN: 70% → Kas Ops | 15% → Kas Omset | 10% → Kas Karyawan | 5% → Kas Cadangan",
          "🛒 BELANJA: Ambil dari Kas Operasional SAJA untuk belanja bahan",
          "👥 GAJI/KASBON: Ambil dari Kas Karyawan SAJA",
          "🏦 TARIK OWNER: Hanya dari Kas Omset, setelah tutup bulan",
          "🌙 TUTUP: Hitung ulang semua kas, pastikan balance",
          "📊 REKONSILIASI: Bandingkan kas fisik vs catatan",
        ].map((step,i)=><div key={i} style={{padding:"4px 0",borderBottom:i<7?"1px solid var(--bd)":"none"}}>{step}</div>)}
      </div>
    </div>

    <div className="bx" style={{background:"var(--gng)",borderColor:"rgba(16,185,129,.15)"}}>
      <div className="bx-t" style={{color:"var(--gn)"}}>✅ Proyeksi Jika Kas Dipisah dari Awal</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{padding:12,background:"rgba(0,0,0,.15)",borderRadius:10}}>
          <div style={{fontSize:10,color:"var(--gn)",fontWeight:600}}>Kas Operasional (70%)</div>
          <div style={{fontSize:20,fontWeight:800,fontFamily:"var(--fm)",color:"var(--gn)"}}>{rp(Math.round(T.omset*.7))}</div>
          <div style={{fontSize:9,color:"var(--t3)"}}>vs aktual keluar: {rp(T.bp+T.ops)} → {T.bp+T.ops<=T.omset*.7?"✅ CUKUP":"⚠️ KURANG"}</div>
        </div>
        <div style={{padding:12,background:"rgba(0,0,0,.15)",borderRadius:10}}>
          <div style={{fontSize:10,color:"var(--gn)",fontWeight:600}}>Kas Karyawan (10%)</div>
          <div style={{fontSize:20,fontWeight:800,fontFamily:"var(--fm)",color:"var(--gn)"}}>{rp(Math.round(T.omset*.1))}</div>
          <div style={{fontSize:9,color:"var(--t3)"}}>vs aktual gaji: {rp(T.totalLabor)} → {T.totalLabor<=T.omset*.1?"✅ CUKUP":"⚠️ KURANG, naikkan ke 20%"}</div>
        </div>
        <div style={{padding:12,background:"rgba(0,0,0,.15)",borderRadius:10}}>
          <div style={{fontSize:10,color:"var(--gn)",fontWeight:600}}>Kas Omset / Laba (15%)</div>
          <div style={{fontSize:20,fontWeight:800,fontFamily:"var(--fm)",color:"var(--gn)"}}>{rp(Math.round(T.omset*.15))}</div>
          <div style={{fontSize:9,color:"var(--t3)"}}>Ini yang bisa ditarik owner per bulan</div>
        </div>
        <div style={{padding:12,background:"rgba(0,0,0,.15)",borderRadius:10}}>
          <div style={{fontSize:10,color:"var(--gn)",fontWeight:600}}>Kas Cadangan (5%)</div>
          <div style={{fontSize:20,fontWeight:800,fontFamily:"var(--fm)",color:"var(--gn)"}}>{rp(Math.round(T.omset*.05))}</div>
          <div style={{fontSize:9,color:"var(--t3)"}}>= ±{Math.round((T.omset*.05)/avgDaily)} hari cadangan ops</div>
        </div>
      </div>
    </div>
  </div>);
};

// ═════════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════════
export default function WarmindoCash(){
  const[pg,sPg]=useState("overview");
  const nav=[
    {id:"overview",em:"📊",l:"Overview"},
    {id:"kas",em:"💼",l:"Detail 5 Kas"},
    {id:"rekon",em:"📋",l:"Rekonsiliasi"},
    {id:"gaji",em:"👥",l:"Gaji & Kasbon"},
    {id:"rekomendasi",em:"💡",l:"Rekomendasi"},
  ];
  const titles={overview:"Cash Management Overview",kas:"Detail Pemisahan 5 Kas",rekon:"Rekonsiliasi Harian",gaji:"Gaji & Kasbon Karyawan",rekomendasi:"Rekomendasi & SOP"};

  return(<><style>{CSS}</style><div className="A">
    <nav className="S">
      <div className="S-logo"><div className="S-li">🔥</div><div><div className="S-lt">Warmindo</div><div className="S-ls">CASH MANAGEMENT</div></div></div>
      <div className="S-sec"><div className="S-lbl">Keuangan</div>
        {nav.map(n=><div key={n.id} className={`S-item ${pg===n.id?"on":""}`} onClick={()=>sPg(n.id)}>
          <span className="S-em">{n.em}</span><span>{n.l}</span></div>)}
      </div>
      <div className="S-sp"/>
      <div className="S-ft">📄 Data: Daily Report<br/>📅 11 Mar – 5 Apr 2026<br/>💰 Omset: Rp76.61jt<br/>🏦 Saldo: Rp1.246.726<br/>👥 9 Karyawan<br/><br/>🔥 Warmindo POS v6<br/>Cash Management System</div>
    </nav>
    <div className="MN">
      <header className="H"><div className="H-t">{titles[pg]}</div><div className="H-b">DATA RIIL</div><div className="H-sp"/><div className="H-p">📅 11 Mar – 5 Apr 2026</div></header>
      <div className="CT">
        {pg==="overview"&&<OverviewPage/>}
        {pg==="kas"&&<KasDetailPage/>}
        {pg==="rekon"&&<RekonPage/>}
        {pg==="gaji"&&<GajiPage/>}
        {pg==="rekomendasi"&&<RekomendasiPage/>}
      </div>
    </div>
  </div></>);
}
