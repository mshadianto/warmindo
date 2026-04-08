import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// WARMINDO DJAYA RASA — REAL DATA DASHBOARD
// Source: Qasir PRO+ Export • 04/08/2025 – 04/08/2026
// 10,526 items sold • 2,695 transactions • Rp152.3 jt total penjualan
// ═══════════════════════════════════════════════════════════════════════════════

const rp=n=>"Rp"+(Math.abs(n||0)).toLocaleString("id-ID");
const pct=(a,b)=>b?((a/b)*100).toFixed(1)+"%":"0%";

// ─── 100% REAL DATA FROM QASIR EXPORT ──────────────────────────────────────

const R={penjualan_kotor:157001184,diskon:5419831,bersih:151581353,biaya_layanan:727900,total:152309253,keuntungan:151581353};

const PRODUCTS=[
{n:"indomie kuah original",c:"toping",q:783,g:9151000},
{n:"mie bangladesh",c:"toping",q:656,g:12997000},
{n:"indomie goreng original",c:"toping",q:547,g:6108000},
{n:"air mineral",c:"minuman",q:450,g:1888000},
{n:"nasi goreng daun jeruk",c:"makanan",q:431,g:5685000},
{n:"teh manis hot/ice",c:"minuman",q:376,g:1880000},
{n:"nasi goreng djaya",c:"makanan",q:267,g:3241000},
{n:"ekstrajos+susu",c:"minuman",q:266,g:2660000},
{n:"dimsum goreng",c:"makanan",q:239,g:3585000},
{n:"milo",c:"minuman",q:236,g:1888000},
{n:"risol 1 porsi",c:"makanan",q:234,g:4203000},
{n:"teh tarik",c:"minuman",q:200,g:1598000},
{n:"nutrisari",c:"minuman",q:188,g:1128000},
{n:"cireng rujak",c:"makanan",q:167,g:2004000},
{n:"telor gimbal",c:"makanan",q:157,g:1854000},
{n:"mix plater",c:"makanan",q:136,g:2040000},
{n:"ayam penyet sambal ijo",c:"makanan",q:127,g:3175000},
{n:"rice bowl asam manis",c:"makanan",q:126,g:2142000},
{n:"dancow",c:"minuman",q:122,g:992000},
{n:"rice bowl chilli padi",c:"makanan",q:122,g:2074000},
{n:"risol beef mayo",c:"makanan",q:121,g:605000},
{n:"ayam sambal matah",c:"makanan",q:120,g:3000000},
{n:"pisang bakar suke",c:"makanan",q:109,g:1090000},
{n:"risol choco chees",c:"makanan",q:106,g:529500},
{n:"tempe mendoan",c:"makanan",q:102,g:1224000},
{n:"roti bakar chocolate cruncy",c:"makanan",q:100,g:1200000},
{n:"roti bakar susu keju",c:"makanan",q:100,g:1000000},
{n:"butterscotch latte",c:"minuman",q:96,g:2112000},
{n:"pop ice",c:"minuman",q:91,g:639000},
{n:"piscok lumer",c:"toping",q:90,g:900000},
{n:"kapal api",c:"minuman",q:89,g:534000},
{n:"goodday capucino",c:"minuman",q:72,g:576000},
{n:"kentang goreng",c:"makanan",q:71,g:826000},
{n:"ayam hot plate",c:"makanan",q:68,g:1700000},
{n:"risol matcha chees",c:"makanan",q:68,g:339500},
{n:"jasuke original",c:"toping",q:67,g:670000},
{n:"americano",c:"minuman",q:66,g:990000},
{n:"kukubima+susu",c:"minuman",q:62,g:620000},
{n:"susu jahe",c:"minuman",q:58,g:301000},
{n:"soda+susu",c:"minuman",q:57,g:579000},
{n:"ovaltine",c:"minuman",q:54,g:530000},
{n:"cireng original",c:"makanan",q:53,g:530000},
{n:"sosis goreng",c:"makanan",q:50,g:500000},
{n:"risol ayam",c:"makanan",q:50,g:250000},
{n:"ayam bakar",c:"makanan",q:49,g:1225000},
{n:"pisang bakar caramel",c:"makanan",q:46,g:460000},
{n:"matcha latte",c:"minuman",q:45,g:900000},
{n:"goodday moccacino",c:"minuman",q:44,g:264000},
{n:"chocolatos",c:"minuman",q:44,g:352000},
{n:"goodday 3in1 vanilla",c:"minuman",q:43,g:258000},
{n:"kerupuk",c:"Umum",q:42,g:84000},
{n:"bengbeng drink",c:"minuman",q:42,g:336000},
{n:"roti bakar strawberry",c:"makanan",q:39,g:390000},
{n:"stmj",c:"minuman",q:39,g:312000},
{n:"mie hot plate",c:"toping",q:38,g:760000},
{n:"kopsu aren creamy",c:"minuman",q:36,g:828000},
{n:"gojek",c:"Umum",q:34,g:637000},
{n:"cilok goang",c:"makanan",q:33,g:330000},
{n:"grab",c:"Umum",q:30,g:355000},
{n:"lemon tea",c:"minuman",q:29,g:261000},
{n:"nasi kuning",c:"makanan",q:28,g:364000},
];

const KATEGORI=[
{n:"Makanan",q:3580,g:49214500,s:48033660,color:"#F97316",bg:"rgba(249,115,22,.1)"},
{n:"Minuman",q:3577,g:33111002,s:31044731,color:"#3B82F6",bg:"rgba(59,130,246,.1)"},
{n:"Toping",q:2233,g:31286500,s:30090419,color:"#8B5CF6",bg:"rgba(139,92,246,.1)"},
{n:"Umum",q:153,g:1286000,s:1277900,color:"#06B6D4",bg:"rgba(6,182,212,.1)"},
];

const METODE=[
{n:"QRIS (Total)",cnt:998,v:80154266,color:"#8B5CF6"},
{n:"Tunai",cnt:1465,v:60027200,color:"#10B981"},
{n:"Grab",cnt:159,v:8915103,color:"#F97316"},
{n:"GoJek",cnt:103,v:5157460,color:"#22C55E"},
{n:"Transfer",cnt:2,v:221200,color:"#3B82F6"},
{n:"Non Tunai",cnt:4,v:295070,color:"#06B6D4"},
{n:"Lainnya",cnt:4,v:153770,color:"#64748B"},
];

const TIPE_ORDER=[
{n:"Tanpa Tipe",cnt:1656,v:100294632,color:"#64748B"},
{n:"Dine In",cnt:675,v:36898120,color:"#3B82F6"},
{n:"Takeaway",cnt:246,v:8700901,color:"#F97316"},
{n:"Grab",cnt:74,v:4367400,color:"#F59E0B"},
{n:"GoJek",cnt:42,v:1947200,color:"#22C55E"},
{n:"Delivery",cnt:2,v:83000,color:"#8B5CF6"},
];

const PEGAWAI=[
{n:"Rifki",role:"Operator",txn:2637,total:137006145,pct:"90.0%"},
{n:"Elma Fauziah",role:"Admin",txn:27,total:14006958,pct:"9.2%"},
{n:"Risha Septiani",role:"Operator",txn:33,total:1361620,pct:"0.9%"},
];

const DAILY=[
{d:"24 Mar",i:84,t:938600,tx:18},{d:"25 Mar",i:195,t:2334550,tx:48},
{d:"26 Mar",i:155,t:1937980,tx:46},{d:"27 Mar",i:200,t:2399052,tx:65},
{d:"28 Mar",i:193,t:2381525,tx:64},{d:"29 Mar",i:203,t:2518765,tx:60},
{d:"30 Mar",i:179,t:2186000,tx:51},{d:"31 Mar",i:244,t:2815075,tx:62},
{d:"1 Apr",i:258,t:3162637,tx:63},{d:"2 Apr",i:228,t:2859939,tx:64},
{d:"3 Apr",i:472,t:6052824,tx:106},{d:"4 Apr",i:341,t:4602902,tx:80},
{d:"5 Apr",i:383,t:5093206,tx:85},{d:"6 Apr",i:276,t:3474817,tx:81},
{d:"7 Apr",i:260,t:3452375,tx:74},{d:"8 Apr",i:102,t:1373375,tx:33},
];

// ─── STYLES ─────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
:root{
--b0:#03050A;--b1:#070B14;--b2:#0D1320;--b3:#151D30;--b4:#1E2A42;
--bd:#182238;--t1:#F1F5F9;--t2:#C8D5E3;--t3:#728BA6;--t4:#4A6080;
--ac:#F97316;--acg:rgba(249,115,22,.08);
--gn:#10B981;--gng:rgba(16,185,129,.07);
--rd:#EF4444;--rdg:rgba(239,68,68,.07);
--bl:#3B82F6;--blg:rgba(59,130,246,.07);
--pr:#8B5CF6;--prg:rgba(139,92,246,.07);
--yl:#FBBF24;--ylg:rgba(251,191,36,.07);
--cn:#06B6D4;--pk:#EC4899;
--f:'Bricolage Grotesque',sans-serif;--fm:'JetBrains Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
.A{font-family:var(--f);background:var(--b0);color:var(--t1);min-height:100vh;display:flex}
.S{width:210px;background:var(--b1);border-right:1px solid var(--bd);display:flex;flex-direction:column;padding:12px 0;flex-shrink:0;overflow-y:auto}.S::-webkit-scrollbar{width:0}
.S-logo{display:flex;align-items:center;gap:8px;padding:0 14px;margin-bottom:16px}
.S-li{width:36px;height:36px;background:linear-gradient(135deg,#F97316,#DC2626);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 20px rgba(249,115,22,.35)}
.S-lt{font-size:13px;font-weight:800;letter-spacing:-.03em;line-height:1.2}.S-ls{font-size:7px;color:var(--t4);font-weight:600;letter-spacing:.06em}
.S-lb{font-size:7px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;padding:10px 14px 4px}
.S-i{display:flex;align-items:center;gap:7px;padding:7px 12px;cursor:pointer;font-size:12px;font-weight:500;color:var(--t3);transition:all .15s;margin:0 6px;border-radius:8px}
.S-i:hover{background:var(--b3);color:var(--t2)}.S-i.on{background:var(--acg);color:var(--ac);font-weight:700}
.S-sp{flex:1}
.S-ft{padding:10px 14px;border-top:1px solid var(--bd);font-size:8px;color:var(--t4);line-height:1.6}
.MN{flex:1;display:flex;flex-direction:column;overflow:hidden}
.H{height:48px;background:var(--b1);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 20px;gap:8px}
.H-t{font-size:15px;font-weight:800}.H-sp{flex:1}
.H-b{font-size:8px;padding:3px 8px;border-radius:999px;font-weight:700}
.CT{flex:1;overflow-y:auto;padding:16px 20px}.CT::-webkit-scrollbar{width:3px}.CT::-webkit-scrollbar-thumb{background:var(--b4);border-radius:3px}
.g{display:grid;gap:10px;margin-bottom:14px}
.g5{grid-template-columns:repeat(5,1fr)}.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}.g2{grid-template-columns:repeat(2,1fr)}
.sc{background:var(--b2);border:1px solid var(--bd);border-radius:14px;padding:14px;position:relative;overflow:hidden}
.sc-i{font-size:22px;margin-bottom:4px}.sc-l{font-size:10px;color:var(--t4);font-weight:500;margin-bottom:2px}.sc-v{font-size:20px;font-weight:800;font-family:var(--fm);letter-spacing:-.02em}.sc-s{font-size:9px;color:var(--t3);margin-top:3px}
.bx{background:var(--b2);border:1px solid var(--bd);border-radius:14px;padding:16px;margin-bottom:14px}
.bx-t{font-size:13px;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:6px}
.bx-t .c{font-size:8px;color:var(--t4);background:var(--b3);padding:2px 7px;border-radius:999px;font-weight:600;margin-left:auto}
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{text-align:left;font-size:8px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;padding:6px 10px;border-bottom:1px solid var(--bd);background:var(--b2);position:sticky;top:0;z-index:1}
.tbl th.r{text-align:right}
.tbl td{padding:5px 10px;font-size:11px;border-bottom:1px solid var(--bd)}.tbl td.r{text-align:right;font-family:var(--fm);font-weight:600;font-size:10px}
.tbl tr:hover td{background:rgba(255,255,255,.015)}
.tbl tr.hl td{background:rgba(249,115,22,.03)}
.bdg{display:inline-flex;align-items:center;gap:2px;padding:2px 6px;border-radius:999px;font-size:8px;font-weight:600}
.b-gn{background:var(--gng);color:var(--gn)}.b-rd{background:var(--rdg);color:var(--rd)}.b-bl{background:var(--blg);color:var(--bl)}
.b-pr{background:var(--prg);color:var(--pr)}.b-ac{background:var(--acg);color:var(--ac)}.b-yl{background:var(--ylg);color:var(--yl)}
.bars{display:flex;align-items:flex-end;gap:4px;height:130px;padding:12px 0 0}
.bar-c{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px}
.bar{width:100%;border-radius:4px 4px 0 0;transition:height .6s cubic-bezier(.4,0,.2,1);min-height:2px}
.bar-l{font-size:7px;color:var(--t4);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.bar-v{font-size:7px;color:var(--t3);font-family:var(--fm);font-weight:700}
.hb{display:flex;align-items:center;gap:8px;padding:4px 0}
.hb-l{font-size:11px;color:var(--t2);width:130px;flex-shrink:0;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hb-tr{flex:1;height:7px;background:var(--b4);border-radius:4px;overflow:hidden}
.hb-fl{height:100%;border-radius:4px;transition:width .6s}
.hb-v{font-family:var(--fm);font-size:9px;font-weight:700;min-width:75px;text-align:right}
.tabs{display:flex;gap:3px;margin-bottom:10px;flex-wrap:wrap}
.tab{padding:5px 10px;border:1px solid var(--bd);background:var(--b2);color:var(--t4);border-radius:999px;font-size:10px;font-weight:600;font-family:var(--f);cursor:pointer;transition:all .15s}
.tab:hover{border-color:var(--t4)}.tab.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}
.donut{display:flex;align-items:center;gap:16px}
.pe{animation:pe .3s ease}@keyframes pe{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1100px){.g5,.g4{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.S{width:50px}.S-lt,.S-ls,.S-lb,.S-i span:last-child,.S-ft{display:none}.S-i{justify-content:center;padding:8px}.g5,.g4,.g3{grid-template-columns:repeat(2,1fr)}}
`;

const HBar=({l,v,max,color,display})=>(<div className="hb"><div className="hb-l">{l}</div><div className="hb-tr"><div className="hb-fl" style={{width:`${Math.min(Math.abs(v)/max*100,100)}%`,background:color}}/></div><div className="hb-v" style={{color}}>{display||rp(v)}</div></div>);

// ═══════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════

const OverviewPage=()=>{
  const maxD=Math.max(...DAILY.map(d=>d.t));
  const avgD=Math.round(DAILY.reduce((s,d)=>s+d.t,0)/DAILY.length);
  const totalTxn=DAILY.reduce((s,d)=>s+d.tx,0);
  const totalItems=DAILY.reduce((s,d)=>s+d.i,0);
  return(<div className="pe">
    <div className="g g5">
      <div className="sc"><div className="sc-i">💰</div><div className="sc-l">Penjualan Kotor</div><div className="sc-v" style={{color:"var(--ac)",fontSize:17}}>{rp(R.penjualan_kotor)}</div><div className="sc-s">1 tahun data</div></div>
      <div className="sc"><div className="sc-i">✅</div><div className="sc-l">Penjualan Bersih</div><div className="sc-v" style={{color:"var(--gn)",fontSize:17}}>{rp(R.bersih)}</div><div className="sc-s">Setelah diskon</div></div>
      <div className="sc"><div className="sc-i">🏷️</div><div className="sc-l">Diskon Diberikan</div><div className="sc-v" style={{color:"var(--rd)"}}>{rp(R.diskon)}</div><div className="sc-s">{pct(R.diskon,R.penjualan_kotor)} dari kotor</div></div>
      <div className="sc"><div className="sc-i">🧾</div><div className="sc-l">Total Transaksi</div><div className="sc-v" style={{color:"var(--bl)"}}>2,695</div><div className="sc-s">10,526 items terjual</div></div>
      <div className="sc"><div className="sc-i">📊</div><div className="sc-l">Avg/Transaksi</div><div className="sc-v" style={{color:"var(--pr)"}}>{rp(Math.round(R.total/2695))}</div><div className="sc-s">Ticket size</div></div>
    </div>

    <div className="g g2">
      <div className="bx">
        <div className="bx-t">📈 Omset Harian (16 hari terakhir) <span className="c">Avg: {rp(avgD)}/hari</span></div>
        <div className="bars">
          {DAILY.map((d,i)=>(
            <div key={i} className="bar-c">
              <div className="bar-v">{(d.t/1e6).toFixed(1)}</div>
              <div className="bar" style={{height:`${(d.t/maxD)*110}px`,background:d.t>=avgD?'linear-gradient(180deg,#10B981,#059669)':'linear-gradient(180deg,#F97316,#EA580C)'}}/>
              <div className="bar-l">{d.d.split(" ")[0]}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:6,fontSize:8,color:"var(--t4)"}}>(juta Rp) • 🟢 ≥ avg • 🟠 &lt; avg • Peak: 3 Apr Rp6.05jt</div>
      </div>

      <div className="bx">
        <div className="bx-t">📂 Revenue per Kategori</div>
        {KATEGORI.map((k,i)=><HBar key={i} l={`${k.n} (${k.q})`} v={k.g} max={KATEGORI[0].g} color={k.color} display={rp(k.g)}/>)}
        <div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {KATEGORI.map((k,i)=>(
            <div key={i} style={{textAlign:"center",padding:8,background:k.bg,borderRadius:8}}>
              <div style={{fontSize:18,fontWeight:800,fontFamily:"var(--fm)",color:k.color}}>{pct(k.g,R.penjualan_kotor)}</div>
              <div style={{fontSize:9,color:k.color}}>{k.n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="g g2">
      <div className="bx">
        <div className="bx-t">💳 Metode Pembayaran <span className="c">Top: QRIS {rp(80154266)}</span></div>
        {METODE.slice(0,5).map((m,i)=><HBar key={i} l={`${m.n} (${m.cnt})`} v={m.v} max={METODE[0].v} color={m.color} display={rp(m.v)}/>)}
      </div>
      <div className="bx">
        <div className="bx-t">📦 Tipe Order <span className="c">{TIPE_ORDER.reduce((s,o)=>s+o.cnt,0)} transaksi</span></div>
        {TIPE_ORDER.map((o,i)=><HBar key={i} l={`${o.n} (${o.cnt})`} v={o.v} max={TIPE_ORDER[0].v} color={o.color} display={rp(o.v)}/>)}
      </div>
    </div>
  </div>);
};

const ProductsPage=()=>{
  const[cat,sCat]=useState("all");
  const filtered=cat==="all"?PRODUCTS:PRODUCTS.filter(p=>p.c===cat);
  const maxQ=PRODUCTS[0]?.q||1;
  const cats=[...new Set(PRODUCTS.map(p=>p.c))];
  return(<div className="pe">
    <div className="g g4">
      <div className="sc"><div className="sc-i">🍜</div><div className="sc-l">Total Menu</div><div className="sc-v">161</div><div className="sc-s">produk unik</div></div>
      <div className="sc"><div className="sc-i">📦</div><div className="sc-l">Total Terjual</div><div className="sc-v" style={{color:"var(--ac)"}}>10,526</div><div className="sc-s">items (1 tahun)</div></div>
      <div className="sc"><div className="sc-i">🏆</div><div className="sc-l">Best Seller</div><div className="sc-v" style={{color:"var(--gn)",fontSize:13}}>Indomie Kuah</div><div className="sc-s">783 terjual</div></div>
      <div className="sc"><div className="sc-i">💰</div><div className="sc-l">Revenue Tertinggi</div><div className="sc-v" style={{color:"var(--bl)",fontSize:13}}>Mie Bangladesh</div><div className="sc-s">{rp(12997000)}</div></div>
    </div>

    <div className="tabs">
      <button className={`tab ${cat==="all"?"on":""}`} onClick={()=>sCat("all")}>Semua ({PRODUCTS.length})</button>
      {cats.map(c=><button key={c} className={`tab ${cat===c?"on":""}`} onClick={()=>sCat(c)}>{c} ({PRODUCTS.filter(p=>p.c===c).length})</button>)}
    </div>

    <div className="bx" style={{padding:0}}>
      <table className="tbl">
        <thead><tr><th style={{width:30}}>#</th><th>Produk</th><th>Kategori</th><th className="r">Qty Terjual</th><th className="r">Revenue Kotor</th><th className="r">Avg Price</th><th style={{width:120}}>Share</th></tr></thead>
        <tbody>{filtered.map((p,i)=>(
          <tr key={i} className={i<3?"hl":""}>
            <td style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--t4)"}}>{i+1}</td>
            <td style={{fontWeight:600}}>{i<3?"🏆 ":""}{p.n}</td>
            <td><span className={`bdg ${p.c==="makanan"?"b-ac":p.c==="minuman"?"b-bl":p.c==="toping"?"b-pr":"b-yl"}`}>{p.c}</span></td>
            <td className="r" style={{color:p.q>=100?"var(--gn)":"var(--t1)"}}>{p.q.toLocaleString()}</td>
            <td className="r" style={{color:"var(--ac)"}}>{rp(p.g)}</td>
            <td className="r" style={{color:"var(--t3)"}}>{p.q?rp(Math.round(p.g/p.q)):"-"}</td>
            <td><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{flex:1,height:5,background:"var(--b4)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${(p.q/maxQ)*100}%`,height:"100%",background:p.c==="makanan"?"var(--ac)":p.c==="minuman"?"var(--bl)":"var(--pr)",borderRadius:3}}/></div><span style={{fontSize:8,color:"var(--t4)",fontFamily:"var(--fm)"}}>{pct(p.q,10526)}</span></div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </div>);
};

const EmployeePage=()=>{
  const totalTxn=PEGAWAI.reduce((s,p)=>s+p.txn,0);
  const totalRev=PEGAWAI.reduce((s,p)=>s+p.total,0);
  return(<div className="pe">
    <div className="g g3">
      <div className="sc"><div className="sc-i">👥</div><div className="sc-l">Total Pegawai</div><div className="sc-v">3</div><div className="sc-s">aktif di Qasir</div></div>
      <div className="sc"><div className="sc-i">🧾</div><div className="sc-l">Total Transaksi</div><div className="sc-v" style={{color:"var(--ac)"}}>{totalTxn.toLocaleString()}</div></div>
      <div className="sc"><div className="sc-i">💰</div><div className="sc-l">Total Handle</div><div className="sc-v" style={{color:"var(--gn)"}}>{rp(totalRev)}</div></div>
    </div>

    <div className="bx">
      <div className="bx-t">👨‍🍳 Performa Pegawai</div>
      <table className="tbl">
        <thead><tr><th>Nama</th><th>Role</th><th className="r">Transaksi</th><th className="r">Total Penjualan</th><th className="r">% Revenue</th><th>Kontribusi</th></tr></thead>
        <tbody>{PEGAWAI.map((p,i)=>(
          <tr key={i}>
            <td style={{fontWeight:700,fontSize:13}}>{i===0?"🏆 ":""}{p.n}</td>
            <td><span className={`bdg ${p.role==="Admin"?"b-ac":"b-bl"}`}>{p.role}</span></td>
            <td className="r">{p.txn.toLocaleString()}</td>
            <td className="r" style={{color:"var(--gn)"}}>{rp(p.total)}</td>
            <td className="r" style={{color:"var(--ac)"}}>{p.pct}</td>
            <td><div style={{height:6,background:"var(--b4)",borderRadius:3,overflow:"hidden"}}><div style={{width:p.pct,height:"100%",background:i===0?"var(--ac)":"var(--bl)",borderRadius:3}}/></div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>

    <div className="bx">
      <div className="bx-t">📊 Insight</div>
      <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.8}}>
        <b>Rifki</b> menangani <b>90%</b> dari seluruh revenue ({rp(137006145)}) dengan 2,637 transaksi — dia adalah tulang punggung operasional kasir.
        <b> Elma Fauziah</b> sebagai Admin menangani 27 transaksi (Rp14 jt) — kemungkinan hanya handle transaksi besar atau khusus.
        <b> Risha Septiani</b> baru 33 transaksi dan 1x absensi — kemungkinan karyawan baru atau part-time.
      </div>
    </div>
  </div>);
};

const DailyPage=()=>{
  const maxT=Math.max(...DAILY.map(d=>d.tx));
  const maxI=Math.max(...DAILY.map(d=>d.i));
  return(<div className="pe">
    <div className="bx">
      <div className="bx-t">📅 Penjualan Harian Detail <span className="c">{DAILY.length} hari data transaksi</span></div>
      <table className="tbl">
        <thead><tr><th>Tanggal</th><th className="r">Transaksi</th><th className="r">Items</th><th className="r">Omset</th><th className="r">Avg/Txn</th><th>Volume</th></tr></thead>
        <tbody>{DAILY.map((d,i)=>{
          const avg=d.tx?Math.round(d.t/d.tx):0;
          return(<tr key={i} className={d.t>=4000000?"hl":""}>
            <td style={{fontWeight:600}}>{d.d} 2026</td>
            <td className="r">{d.tx}</td>
            <td className="r">{d.i}</td>
            <td className="r" style={{color:d.t>=4000000?"var(--gn)":"var(--t1)"}}>{rp(d.t)}</td>
            <td className="r" style={{color:"var(--pr)"}}>{rp(avg)}</td>
            <td><div style={{height:6,background:"var(--b4)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${(d.t/DAILY[10].t)*100}%`,height:"100%",background:d.t>=4000000?"var(--gn)":"var(--ac)",borderRadius:3}}/></div></td>
          </tr>);
        })}</tbody>
      </table>
    </div>

    <div className="g g2">
      <div className="bx">
        <div className="bx-t">📊 Jumlah Transaksi per Hari</div>
        <div className="bars" style={{height:100}}>
          {DAILY.map((d,i)=>(
            <div key={i} className="bar-c">
              <div className="bar-v">{d.tx}</div>
              <div className="bar" style={{height:`${(d.tx/maxT)*80}px`,background:'linear-gradient(180deg,var(--bl),#1E40AF)'}}/>
              <div className="bar-l">{d.d.split(" ")[0]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bx">
        <div className="bx-t">📦 Items Terjual per Hari</div>
        <div className="bars" style={{height:100}}>
          {DAILY.map((d,i)=>(
            <div key={i} className="bar-c">
              <div className="bar-v">{d.i}</div>
              <div className="bar" style={{height:`${(d.i/maxI)*80}px`,background:'linear-gradient(180deg,var(--pr),#6D28D9)'}}/>
              <div className="bar-l">{d.d.split(" ")[0]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>);
};

const PaymentPage=()=>{
  const totalV=METODE.reduce((s,m)=>s+m.v,0);
  const totalC=METODE.reduce((s,m)=>s+m.cnt,0);
  const totalO=TIPE_ORDER.reduce((s,o)=>s+o.v,0);
  return(<div className="pe">
    <div className="g g2">
      <div className="bx">
        <div className="bx-t">💳 Metode Pembayaran <span className="c">{totalC.toLocaleString()} transaksi</span></div>
        <table className="tbl">
          <thead><tr><th>Metode</th><th className="r">Penggunaan</th><th className="r">Nominal</th><th className="r">% Share</th></tr></thead>
          <tbody>{METODE.map((m,i)=>(
            <tr key={i}>
              <td style={{fontWeight:600}}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:m.color,marginRight:6}}/>{m.n}</td>
              <td className="r">{m.cnt.toLocaleString()}</td>
              <td className="r" style={{color:m.color}}>{rp(m.v)}</td>
              <td className="r"><span className="bdg b-ac">{pct(m.v,totalV)}</span></td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{marginTop:10,padding:10,background:"var(--prg)",borderRadius:8,fontSize:10,color:"var(--pr)"}}>
          📱 <b>QRIS dominan</b> — Rp80.1 jt (52.6%) dari total. Digital payment sudah jadi kebiasaan pelanggan.
        </div>
      </div>

      <div className="bx">
        <div className="bx-t">📦 Tipe Order <span className="c">{TIPE_ORDER.reduce((s,o)=>s+o.cnt,0)} order</span></div>
        <table className="tbl">
          <thead><tr><th>Tipe</th><th className="r">Jumlah</th><th className="r">Penjualan</th><th className="r">% Share</th></tr></thead>
          <tbody>{TIPE_ORDER.map((o,i)=>(
            <tr key={i}>
              <td style={{fontWeight:600}}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:o.color,marginRight:6}}/>{o.n}</td>
              <td className="r">{o.cnt.toLocaleString()}</td>
              <td className="r" style={{color:o.color}}>{rp(o.v)}</td>
              <td className="r"><span className="bdg b-bl">{pct(o.v,totalO)}</span></td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{marginTop:10,padding:10,background:"var(--blg)",borderRadius:8,fontSize:10,color:"var(--bl)"}}>
          🪑 <b>Dine In</b> (675 txn / Rp36.9jt) menunjukkan pelanggan suka makan di tempat. Grab (74) + GoJek (42) = 116 order ojol.
        </div>
      </div>
    </div>
  </div>);
};

const InsightPage=()=>{
  const avgPrice=PRODUCTS.filter(p=>p.q>10).map(p=>({n:p.n,avg:Math.round(p.g/p.q)})).sort((a,b)=>b.avg-a.avg);
  return(<div className="pe">
    <div className="bx" style={{background:"var(--acg)",borderColor:"rgba(249,115,22,.15)"}}>
      <div className="bx-t" style={{color:"var(--ac)"}}>🔥 Key Insights — Warmindo Djaya Rasa</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          {icon:"🏆",title:"Menu Andalan",desc:"Indomie Kuah Original (783) + Mie Bangladesh (656) + Indomie Goreng (547) = 1,986 unit — 3 menu ini 20% dari total penjualan",color:"var(--ac)"},
          {icon:"💰",title:"Revenue King",desc:`Mie Bangladesh menghasilkan ${rp(12997000)} — revenue tertinggi per produk meski bukan yang paling laku. Harga per porsi tinggi (Rp19.800) dan margin besar.`,color:"var(--gn)"},
          {icon:"📱",title:"QRIS Dominan",desc:"52.6% revenue via QRIS (Rp80.1jt). Pelanggan sudah terbiasa cashless. Pertimbangkan promo khusus QRIS untuk push lebih tinggi.",color:"var(--pr)"},
          {icon:"📊",title:"Peak Day",desc:"3 April 2026: Rp6.05jt omset, 106 transaksi, 472 items — hari terbaik. Kemungkinan ada event/promo. Replikasi strategi ini.",color:"var(--bl)"},
          {icon:"👨‍🍳",title:"Rifki = MVP",desc:"Menangani 90% revenue (Rp137jt) dari 2,637 transaksi. Sangat bergantung pada 1 orang — risiko tinggi kalau sakit/cuti. Perlu backup kasir.",color:"var(--yl)"},
          {icon:"🍜",title:"Toping > Makanan",desc:"Kategori Toping (Rp31.3jt) hampir menyaingi Makanan (Rp49.2jt) — customer suka tambah topping. Upsell topping = strategi margin tinggi.",color:"var(--pk)"},
        ].map((ins,i)=>(
          <div key={i} style={{padding:12,background:"rgba(0,0,0,.2)",borderRadius:10}}>
            <div style={{fontSize:16,marginBottom:4}}>{ins.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:ins.color,marginBottom:4}}>{ins.title}</div>
            <div style={{fontSize:10,color:"var(--t2)",lineHeight:1.6}}>{ins.desc}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="bx">
      <div className="bx-t">💎 Menu dengan Harga Tertinggi per Porsi</div>
      {avgPrice.slice(0,15).map((p,i)=><HBar key={i} l={p.n} v={p.avg} max={avgPrice[0].avg} color="var(--ac)" display={rp(p.avg)+" /pcs"}/>)}
    </div>
  </div>);
};

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
export default function App(){
  const[pg,sPg]=useState("overview");
  const nav=[
    {id:"overview",e:"📊",l:"Overview"},
    {id:"products",e:"🍜",l:"Produk (161)"},
    {id:"daily",e:"📅",l:"Harian"},
    {id:"payment",e:"💳",l:"Pembayaran"},
    {id:"employees",e:"👨‍🍳",l:"Pegawai"},
    {id:"insight",e:"💡",l:"Insights"},
  ];
  const titles={overview:"Dashboard Overview",products:"Penjualan per Produk",daily:"Laporan Harian",payment:"Pembayaran & Tipe Order",employees:"Laporan Pegawai",insight:"Business Insights"};
  return(<><style>{CSS}</style><div className="A">
    <nav className="S">
      <div className="S-logo"><div className="S-li">🔥</div><div><div className="S-lt">Warmindo<br/>Djaya Rasa</div><div className="S-ls">QASIR DATA DASHBOARD</div></div></div>
      <div className="S-lb">Analytics</div>
      {nav.map(n=><div key={n.id} className={`S-i ${pg===n.id?"on":""}`} onClick={()=>sPg(n.id)}><span>{n.e}</span> <span>{n.l}</span></div>)}
      <div className="S-sp"/>
      <div className="S-ft">📄 Source: Qasir PRO+<br/>🏪 warmindo-djaya-rasa<br/>📅 08 Apr 2025 – 08 Apr 2026<br/>🧾 2,695 transaksi<br/>📦 10,526 items<br/>💰 Rp152.3 juta<br/>👥 3 pegawai • 161 menu</div>
    </nav>
    <div className="MN">
      <header className="H"><div className="H-t">{titles[pg]}</div><div className="H-sp"/><div className="H-b" style={{background:"var(--rdg)",color:"var(--rd)"}}>REAL DATA</div><div className="H-b" style={{background:"var(--acg)",color:"var(--ac)"}}>QASIR PRO+</div><div className="H-b" style={{background:"var(--gng)",color:"var(--gn)"}}>Apr 2025 – Apr 2026</div></header>
      <div className="CT">
        {pg==="overview"&&<OverviewPage/>}
        {pg==="products"&&<ProductsPage/>}
        {pg==="daily"&&<DailyPage/>}
        {pg==="payment"&&<PaymentPage/>}
        {pg==="employees"&&<EmployeePage/>}
        {pg==="insight"&&<InsightPage/>}
      </div>
    </div>
  </div></>);
}
