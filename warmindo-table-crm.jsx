import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ═════════════════════════════════════════════════════════════════════════════
// WARMINDO POS v5 — TABLE MANAGEMENT + CUSTOMER CRM
// QR per Meja • Self-Order • Kitchen Print • Feedback QR • Customer Database
// ═════════════════════════════════════════════════════════════════════════════

// ─── UTILS ──────────────────────────────────────────────────────────────────
const rp=n=>"Rp"+(n||0).toLocaleString("id-ID");
const gid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const fTime=()=>new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
const fDate=()=>new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
const fFull=d=>new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short"})+" "+new Date(d).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
const _useLS=(k,i)=>{const[v,s]=useState(()=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):i}catch{return i}});useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},[k,v]);return[v,s]};
const useLS=window.WDB?window.WDB.useDB:_useLS;

// ─── QR GENERATOR ───────────────────────────────────────────────────────────
const QR=({data,size=160,fg="#000",bg="#FFF",logo})=>{
  const m=useMemo(()=>{
    const sz=25,a=[];let s=0;
    for(let i=0;i<(data||"X").length;i++)s=((s<<5)-s+(data||"X").charCodeAt(i))|0;
    const r=()=>{s=(s*16807)%2147483647;return(s&0x7fffffff)/0x7fffffff};
    for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){
      const tl=x<7&&y<7,tr=x>=sz-7&&y<7,bl=x<7&&y>=sz-7;
      if(tl||tr||bl){const fx=tl?0:tr?sz-7:0,fy=tl?0:tr?0:sz-7,lx=x-fx,ly=y-fy;a.push({x,y,on:(lx===0||lx===6||ly===0||ly===6)||(lx>=2&&lx<=4&&ly>=2&&ly<=4)})}
      else a.push({x,y,on:r()>.48})
    }
    return{a,sz};
  },[data]);
  const cs=size/(m.sz+2);
  return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:8}}>
    <rect width={size} height={size} fill={bg} rx={8}/>
    {m.a.filter(v=>v.on).map((v,i)=><rect key={i} x={(v.x+1)*cs} y={(v.y+1)*cs} width={cs-.4} height={cs-.4} fill={fg} rx={.8}/>)}
    <rect x={size/2-14} y={size/2-14} width={28} height={28} fill={bg} rx={6}/>
    <text x={size/2} y={size/2+5} textAnchor="middle" fontSize="14">{logo||"🔥"}</text>
  </svg>);
};

// ─── MENU DATA ──────────────────────────────────────────────────────────────
const CATS=[{id:"all",n:"Semua",e:"🍽️"},{id:"indomie",n:"Indomie",e:"🍜"},{id:"nasi",n:"Nasi",e:"🍚"},{id:"gorengan",n:"Gorengan",e:"🍤"},{id:"minuman",n:"Minuman",e:"🥤"},{id:"snack",n:"Snack",e:"🍢"},{id:"extra",n:"Topping",e:"➕"}];
const MENU=[
{id:1,n:"Indomie Goreng",p:8000,c:"indomie",e:"🍜"},{id:2,n:"Indomie Rebus",p:8000,c:"indomie",e:"🍜"},
{id:3,n:"Indomie Goreng Telur",p:12000,c:"indomie",e:"🍳"},{id:4,n:"Indomie Rebus Telur",p:12000,c:"indomie",e:"🍳"},
{id:5,n:"Indomie Double",p:14000,c:"indomie",e:"🍜"},{id:6,n:"Indomie Nyemek",p:10000,c:"indomie",e:"🍜"},
{id:7,n:"Indomie Seblak",p:13000,c:"indomie",e:"🌶️"},{id:8,n:"Mie Goreng Jawa",p:15000,c:"indomie",e:"🍝"},
{id:9,n:"Nasi Goreng",p:15000,c:"nasi",e:"🍛"},{id:10,n:"Nasi Telur",p:10000,c:"nasi",e:"🍚"},
{id:11,n:"Nasi Putih",p:5000,c:"nasi",e:"🍚"},{id:12,n:"Nasi Uduk",p:8000,c:"nasi",e:"🍚"},
{id:13,n:"Tempe Goreng",p:3000,c:"gorengan",e:"🟫"},{id:14,n:"Tahu Goreng",p:3000,c:"gorengan",e:"🟨"},
{id:15,n:"Bakwan",p:3000,c:"gorengan",e:"🍤"},{id:16,n:"Mendoan",p:4000,c:"gorengan",e:"🟫"},
{id:17,n:"Es Teh Manis",p:5000,c:"minuman",e:"🧊"},{id:18,n:"Teh Anget",p:4000,c:"minuman",e:"☕"},
{id:19,n:"Es Jeruk",p:6000,c:"minuman",e:"🍊"},{id:20,n:"Kopi Hitam",p:5000,c:"minuman",e:"☕"},
{id:21,n:"Es Kopi Susu",p:10000,c:"minuman",e:"🧋"},{id:22,n:"Air Mineral",p:4000,c:"minuman",e:"💧"},
{id:23,n:"Kerupuk",p:2000,c:"snack",e:"🍘"},{id:24,n:"Sate Telur Puyuh",p:5000,c:"snack",e:"🍢"},
{id:25,n:"Telur Ceplok",p:5000,c:"extra",e:"🍳"},{id:26,n:"Kornet",p:5000,c:"extra",e:"🥫"},
{id:27,n:"Sosis",p:5000,c:"extra",e:"🌭"},{id:28,n:"Keju",p:4000,c:"extra",e:"🧀"},
];

const INIT_TABLES = Array.from({length:12},(_, i)=>({
  id:`T${i+1}`, num:i+1, name:`Meja ${i+1}`, capacity: i<4?2:i<8?4:6,
  status:"empty", // empty | occupied | ordering | served | paying | cleaning
  qrCode:`warmindo.id/table/${i+1}?token=${gid()}`,
  orders:[], currentBill:0, customerId:null, startTime:null,
}));

const INIT_CUSTOMERS=[
  {id:"c1",name:"Pak Budi",phone:"0812-1234-5678",email:"budi@gmail.com",visits:12,totalSpent:540000,lastVisit:"2026-04-07",tags:["regular","indomie lover"],notes:"Selalu pesan Indomie Goreng Telur + Es Teh",rating:4.5},
  {id:"c2",name:"Bu Siti",phone:"0813-2345-6789",email:"siti@gmail.com",visits:8,totalSpent:380000,lastVisit:"2026-04-06",tags:["regular"],notes:"Suka nasi goreng pedas",rating:4.8},
  {id:"c3",name:"Mas Agus",phone:"0857-3456-7890",email:"",visits:3,totalSpent:95000,lastVisit:"2026-04-03",tags:["new"],notes:"",rating:4.0},
  {id:"c4",name:"Mbak Rina",phone:"0878-4567-8901",email:"rina@yahoo.com",visits:25,totalSpent:1250000,lastVisit:"2026-04-08",tags:["VIP","regular"],notes:"VIP — selalu bawa keluarga weekend",rating:5.0},
  {id:"c5",name:"Pak Hendra",phone:"0819-5678-9012",email:"",visits:6,totalSpent:210000,lastVisit:"2026-04-05",tags:["regular"],notes:"Sering order GoFood juga",rating:4.2},
  {id:"c6",name:"Dek Rizky",phone:"0856-6789-0123",email:"",visits:15,totalSpent:450000,lastVisit:"2026-04-08",tags:["regular","mahasiswa"],notes:"Mahasiswa — sering nongkrong malam",rating:4.3},
];

const INIT_FEEDBACK=[
  {id:"f1",custName:"Pak Budi",rating:5,comment:"Indomienya mantap! Porsi besar, harga terjangkau.",date:"2026-04-07T12:30:00",tableNum:3},
  {id:"f2",custName:"Bu Siti",rating:5,comment:"Nasi gorengnya enak banget, bumbu pas. Pelayanan ramah.",date:"2026-04-06T19:15:00",tableNum:5},
  {id:"f3",custName:"Anonim",rating:4,comment:"Makanan enak, tapi agak lama nunggunya.",date:"2026-04-05T13:00:00",tableNum:2},
  {id:"f4",custName:"Mbak Rina",rating:5,comment:"Tempat favorit keluarga! Anak-anak suka banget.",date:"2026-04-08T11:45:00",tableNum:8},
  {id:"f5",custName:"Mas Agus",rating:4,comment:"Es kopinya lumayan, bisa ditambah varian.",date:"2026-04-03T14:20:00",tableNum:1},
  {id:"f6",custName:"Dek Rizky",rating:4,comment:"WiFi kenceng, makanan murah meriah. Top!",date:"2026-04-08T21:00:00",tableNum:10},
];

// ─── STYLES ─────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
:root{
--b0:#050810;--b1:#0A0E1A;--b2:#111728;--b3:#1A2238;--b4:#24304A;--bh:#1D2844;
--bd:#1C2640;--bd2:#283650;
--t1:#F1F5F9;--t2:#CBD5E1;--t3:#7C8BA1;--t4:#4F5D78;
--ac:#F97316;--ac2:#FB923C;--acg:rgba(249,115,22,.1);
--gn:#10B981;--gng:rgba(16,185,129,.1);--rd:#EF4444;--rdg:rgba(239,68,68,.1);
--bl:#3B82F6;--blg:rgba(59,130,246,.1);--pr:#8B5CF6;--prg:rgba(139,92,246,.1);
--yl:#FBBF24;--ylg:rgba(251,191,36,.1);--cn:#06B6D4;--cng:rgba(6,182,212,.1);
--pk:#EC4899;--pkg:rgba(236,72,153,.1);
--r1:8px;--r2:12px;--r3:16px;--r4:20px;
--f:'Outfit',sans-serif;--fm:'JetBrains Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
.app{font-family:var(--f);background:var(--b0);color:var(--t1);min-height:100vh;display:flex}
/* Sidebar */
.sb{width:200px;background:var(--b1);border-right:1px solid var(--bd);display:flex;flex-direction:column;padding:14px 0;flex-shrink:0;overflow-y:auto}.sb::-webkit-scrollbar{width:0}
.sb-logo{display:flex;align-items:center;gap:8px;padding:0 14px;margin-bottom:16px}
.sb-licon{width:34px;height:34px;background:linear-gradient(135deg,#F97316,#DC2626);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 16px rgba(249,115,22,.3)}
.sb-ltxt{font-size:14px;font-weight:800;letter-spacing:-.02em}.sb-lsub{font-size:8px;color:var(--t4);font-weight:600;letter-spacing:.06em}
.sb-sec{padding:0 8px;margin-bottom:2px}
.sb-lbl{font-size:8px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;padding:8px 8px 4px}
.sb-i{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:var(--r1);cursor:pointer;font-size:12px;font-weight:500;color:var(--t3);transition:all .15s;margin-bottom:1px}
.sb-i:hover{background:var(--b3);color:var(--t2)}.sb-i.on{background:var(--acg);color:var(--ac);font-weight:700}
.sb-i .em{font-size:15px;width:22px;text-align:center}
.sb-sp{flex:1}
.sb-ft{padding:10px 14px;border-top:1px solid var(--bd);margin-top:6px;font-size:9px;color:var(--t4);line-height:1.5}
/* Main */
.mn{flex:1;display:flex;flex-direction:column;overflow:hidden}
.hdr{height:52px;background:var(--b1);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 20px;gap:10px}
.hdr-t{font-size:16px;font-weight:800;letter-spacing:-.02em}.hdr-sp{flex:1}
.hdr-bdg{font-size:9px;color:var(--ac);background:var(--acg);padding:3px 10px;border-radius:999px;font-weight:700}
.hdr-clk{font-family:var(--fm);font-size:10px;color:var(--t3);background:var(--b2);padding:5px 10px;border-radius:var(--r1);border:1px solid var(--bd)}
.cnt{flex:1;overflow-y:auto;padding:16px 20px}.cnt::-webkit-scrollbar{width:3px}.cnt::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
/* Grid */
.g{display:grid;gap:10px;margin-bottom:14px}
.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}.g2{grid-template-columns:repeat(2,1fr)}
/* Stat */
.sc{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:14px;position:relative;overflow:hidden}
.sc-ic{width:30px;height:30px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:15px;margin-bottom:6px}
.sc-l{font-size:10px;color:var(--t4);font-weight:500;margin-bottom:3px}.sc-v{font-size:20px;font-weight:800;font-family:var(--fm);letter-spacing:-.02em}
.sc-s{font-size:9px;color:var(--t3);margin-top:3px}
/* Box */
.bx{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:16px;margin-bottom:14px}
.bx-t{font-size:13px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.bx-t .cnt-bdg{font-size:9px;color:var(--t4);background:var(--b3);padding:2px 7px;border-radius:999px;font-weight:600;margin-left:auto}
/* Table */
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{text-align:left;font-size:8px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;padding:7px 10px;border-bottom:1px solid var(--bd);background:var(--b2);position:sticky;top:0;z-index:1}
.tbl th.r{text-align:right}
.tbl td{padding:7px 10px;font-size:11px;border-bottom:1px solid var(--bd);vertical-align:middle}.tbl td.r{text-align:right;font-family:var(--fm);font-weight:600;font-size:10px}
.tbl tr:hover td{background:rgba(255,255,255,.02)}
.bdg{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:999px;font-size:9px;font-weight:600}
.b-gn{background:var(--gng);color:var(--gn)}.b-rd{background:var(--rdg);color:var(--rd)}.b-bl{background:var(--blg);color:var(--bl)}
.b-yl{background:var(--ylg);color:var(--yl)}.b-pr{background:var(--prg);color:var(--pr)}.b-ac{background:var(--acg);color:var(--ac)}
.b-cn{background:var(--cng);color:var(--cn)}.b-pk{background:var(--pkg);color:var(--pk)}
/* Buttons */
.bp{height:40px;background:linear-gradient(135deg,var(--ac),#EA580C);color:#fff;border:none;border-radius:var(--r2);font-family:var(--f);font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all .2s;box-shadow:0 4px 14px rgba(249,115,22,.25);padding:0 16px}
.bp:hover{transform:translateY(-1px)}.bp:disabled{opacity:.4;cursor:not-allowed;transform:none}
.bs{height:32px;background:var(--b2);color:var(--t1);border:1px solid var(--bd);border-radius:var(--r1);font-family:var(--f);font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;padding:0 10px;transition:all .15s}
.bs:hover{border-color:var(--t4)}.bs.sm{height:26px;font-size:9px;padding:0 8px}
.inp{height:32px;background:var(--b3);border:1px solid var(--bd);border-radius:var(--r1);padding:0 10px;font-family:var(--f);font-size:12px;color:var(--t1);outline:none;transition:border .2s}.inp:focus{border-color:var(--ac)}
/* Tabs */
.tabs{display:flex;gap:3px;margin-bottom:12px;flex-wrap:wrap}
.tab{padding:5px 12px;border:1px solid var(--bd);background:var(--b2);color:var(--t4);border-radius:999px;font-size:10px;font-weight:600;font-family:var(--f);cursor:pointer;transition:all .15s}
.tab:hover{border-color:var(--t4)}.tab.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}
/* Modal */
.mo{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fi .2s}
@keyframes fi{from{opacity:0}to{opacity:1}}
.ml{background:var(--b1);border:1px solid var(--bd);border-radius:var(--r4);padding:20px;width:92%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:su .3s}
.ml::-webkit-scrollbar{width:3px}.ml::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
@keyframes su{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.ml-t{font-size:16px;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.ml-x{margin-left:auto;background:none;border:none;color:var(--t4);cursor:pointer;padding:3px;border-radius:6px;font-size:18px}.ml-x:hover{background:var(--b3);color:var(--t1)}
/* Table Grid (Floor Plan) */
.floor{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.tcard{background:var(--b2);border:2px solid var(--bd);border-radius:var(--r3);padding:14px;cursor:pointer;transition:all .2s;position:relative;text-align:center}
.tcard:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
.tcard.empty{border-color:var(--bd)}.tcard.occupied{border-color:var(--ac);background:var(--acg)}.tcard.ordering{border-color:var(--bl);background:var(--blg)}
.tcard.served{border-color:var(--gn);background:var(--gng)}.tcard.paying{border-color:var(--pr);background:var(--prg)}.tcard.cleaning{border-color:var(--yl);background:var(--ylg)}
.tcard-num{font-size:28px;font-weight:900;font-family:var(--fm);margin-bottom:4px}
.tcard-name{font-size:11px;font-weight:600;margin-bottom:4px}
.tcard-cap{font-size:9px;color:var(--t4)}
.tcard-status{position:absolute;top:8px;right:8px}
.tcard-bill{font-family:var(--fm);font-size:12px;font-weight:700;color:var(--ac);margin-top:6px}
.tcard-time{font-size:9px;color:var(--t3);margin-top:2px;font-family:var(--fm)}
/* Stars */
.stars{display:inline-flex;gap:1px;font-size:12px}
/* Customer card */
.ccard{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:14px;transition:all .2s}
.ccard:hover{border-color:var(--ac);transform:translateY(-1px)}
/* Print styles */
.print-order{background:#fff;color:#111;border-radius:var(--r2);padding:16px;font-family:var(--fm);font-size:10px;margin-bottom:12px}
.print-order h3{font-family:var(--f);font-size:14px;text-align:center;margin-bottom:8px}
.print-hr{border:none;border-top:1px dashed #ccc;margin:6px 0}
.print-row{display:flex;justify-content:space-between;padding:3px 0}
.print-check{display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #eee}
.print-checkbox{width:16px;height:16px;border:2px solid #999;border-radius:3px;flex-shrink:0}
/* Feedback card */
.fcard{background:var(--b3);border-radius:var(--r2);padding:12px;margin-bottom:8px}
/* Receipt with QR */
.receipt{background:#fff;color:#111;border-radius:var(--r2);padding:18px;font-family:var(--fm);font-size:10px}
.receipt-center{text-align:center}
/* Anim */
.pe{animation:pe .3s ease}@keyframes pe{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1100px){.g4{grid-template-columns:repeat(2,1fr)}.floor{grid-template-columns:repeat(3,1fr)}}
@media(max-width:700px){.sb{width:56px}.sb-ltxt,.sb-lsub,.sb-lbl,.sb-i span:not(.em),.sb-ft{display:none}.sb-i{justify-content:center;padding:8px}.g4,.g3{grid-template-columns:repeat(2,1fr)}.floor{grid-template-columns:repeat(2,1fr)}}
`;

// ═════════════════════════════════════════════════════════════════════
// TABLE DETAIL MODAL
// ═════════════════════════════════════════════════════════════════════
const TableModal=({table,onClose,onUpdate,customers,onAddCustomer,menu})=>{
  const[tab,sTab]=useState("order");
  const[cat,sCat]=useState("all");
  const[custSearch,sCS]=useState("");
  const[showReceipt,sSR]=useState(false);
  const[showPrint,sSP]=useState(false);
  const[showQR,sSQ]=useState(false);
  const[custName,sCN]=useState("");
  const[custPhone,sCP]=useState("");

  const t=table;
  const cart=t.orders||[];
  const total=cart.reduce((s,c)=>s+c.p*c.qty,0);
  const filtered=cat==="all"?menu:menu.filter(m=>m.c===cat);
  const linkedCust=customers.find(c=>c.id===t.customerId);

  const addItem=(item)=>{
    const newOrders=[...cart];
    const ex=newOrders.find(o=>o.id===item.id);
    if(ex)ex.qty++;else newOrders.push({...item,qty:1});
    onUpdate({...t,orders:newOrders,status:t.status==="empty"?"ordering":t.status,currentBill:newOrders.reduce((s,c)=>s+c.p*c.qty,0),startTime:t.startTime||new Date().toISOString()});
  };

  const removeItem=(id)=>{
    const newOrders=cart.filter(o=>o.id!==id);
    onUpdate({...t,orders:newOrders,currentBill:newOrders.reduce((s,c)=>s+c.p*c.qty,0),status:newOrders.length===0?"empty":t.status});
  };

  const changeQty=(id,d)=>{
    const newOrders=cart.map(o=>o.id===id?{...o,qty:Math.max(1,o.qty+d)}:o);
    onUpdate({...t,orders:newOrders,currentBill:newOrders.reduce((s,c)=>s+c.p*c.qty,0)});
  };

  const markServed=()=>onUpdate({...t,status:"served"});
  const markPaying=()=>onUpdate({...t,status:"paying"});
  const clearTable=()=>onUpdate({...t,status:"empty",orders:[],currentBill:0,customerId:null,startTime:null});

  const linkCustomer=(cid)=>onUpdate({...t,customerId:cid});
  const addNewCust=()=>{
    if(!custName)return;
    const nc={id:gid(),name:custName,phone:custPhone,email:"",visits:1,totalSpent:0,lastVisit:new Date().toISOString().split("T")[0],tags:["new"],notes:"",rating:0};
    onAddCustomer(nc);
    onUpdate({...t,customerId:nc.id});
    sCN("");sCP("");
  };

  const filteredCusts=customers.filter(c=>c.name.toLowerCase().includes(custSearch.toLowerCase())||c.phone.includes(custSearch));

  return(<div className="mo" onClick={onClose}><div className="ml" onClick={e=>e.stopPropagation()} style={{maxWidth:580}}>
    <div className="ml-t">
      🪑 Meja {t.num} <span className={`bdg ${t.status==="empty"?"b-gn":t.status==="occupied"||t.status==="ordering"?"b-bl":t.status==="served"?"b-ac":t.status==="paying"?"b-pr":"b-yl"}`}>{t.status==="empty"?"Kosong":t.status==="ordering"?"Pesan":t.status==="served"?"Disajikan":t.status==="paying"?"Bayar":"Bersihkan"}</span>
      {linkedCust&&<span className="bdg b-pk" style={{marginLeft:4}}>👤 {linkedCust.name}</span>}
      <button className="ml-x" onClick={onClose}>✕</button>
    </div>

    <div className="tabs">
      {[{id:"order",l:"🛒 Order"},{id:"customer",l:"👤 Customer"},{id:"qr",l:"📱 QR Meja"},{id:"print",l:"🖨️ Cetak Order"},{id:"receipt",l:"🧾 Invoice+Feedback"}].map(x=>
        <button key={x.id} className={`tab ${tab===x.id?"on":""}`} onClick={()=>sTab(x.id)}>{x.l}</button>)}
    </div>

    {/* ORDER TAB */}
    {tab==="order"&&<>
      <div className="tabs" style={{marginBottom:8}}>
        {CATS.map(c=><button key={c.id} className={`tab ${cat===c.id?"on":""}`} onClick={()=>sCat(c.id)} style={{fontSize:9}}>{c.e} {c.n}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,maxHeight:200,overflowY:"auto",marginBottom:12}}>
        {filtered.map(m=>{
          const inCart=cart.find(o=>o.id===m.id);
          return(<div key={m.id} onClick={()=>addItem(m)} style={{background:"var(--b3)",border:"1px solid var(--bd)",borderRadius:"var(--r2)",padding:8,cursor:"pointer",textAlign:"center",transition:"all .15s",position:"relative"}}>
            {inCart&&<div style={{position:"absolute",top:4,right:4,background:"var(--ac)",color:"#fff",fontSize:9,fontWeight:800,width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{inCart.qty}</div>}
            <div style={{fontSize:20}}>{m.e}</div>
            <div style={{fontSize:9,fontWeight:600,marginTop:2}}>{m.n}</div>
            <div style={{fontSize:9,fontFamily:"var(--fm)",color:"var(--ac)",fontWeight:700}}>{rp(m.p)}</div>
          </div>)
        })}
      </div>

      {cart.length>0&&<>
        <div style={{fontSize:11,fontWeight:700,marginBottom:6}}>📋 Pesanan Meja {t.num}</div>
        {cart.map(o=><div key={o.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bd)"}}>
          <span style={{fontSize:16}}>{o.e}</span>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{o.n}</div><div style={{fontSize:9,color:"var(--t4)",fontFamily:"var(--fm)"}}>{rp(o.p)}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <button className="bs sm" onClick={()=>changeQty(o.id,-1)}>−</button>
            <span style={{fontFamily:"var(--fm)",fontSize:12,fontWeight:700,minWidth:16,textAlign:"center"}}>{o.qty}</span>
            <button className="bs sm" onClick={()=>changeQty(o.id,1)}>+</button>
            <button className="bs sm" style={{color:"var(--rd)"}} onClick={()=>removeItem(o.id)}>✕</button>
          </div>
          <div style={{fontFamily:"var(--fm)",fontSize:11,fontWeight:700,color:"var(--ac)",minWidth:70,textAlign:"right"}}>{rp(o.p*o.qty)}</div>
        </div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:16,fontWeight:800,borderTop:"2px dashed var(--bd2)",marginTop:8}}>
          <span>Total</span><span style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{rp(total)}</span>
        </div>
        <div style={{display:"flex",gap:6,marginTop:6}}>
          {t.status==="ordering"&&<button className="bp" style={{flex:1}} onClick={markServed}>🍳 Sajikan</button>}
          {t.status==="served"&&<button className="bp" style={{flex:1}} onClick={markPaying}>💳 Bayar</button>}
          {(t.status==="paying"||t.status==="served")&&<button className="bs" style={{flex:1}} onClick={()=>sTab("receipt")}>🧾 Invoice</button>}
          <button className="bs" style={{color:"var(--rd)"}} onClick={clearTable}>🗑️ Clear</button>
        </div>
      </>}
    </>}

    {/* CUSTOMER TAB */}
    {tab==="customer"&&<>
      {linkedCust?<div className="bx" style={{marginBottom:12}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{fontSize:36}}>👤</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>{linkedCust.name}</div>
            <div style={{fontSize:11,color:"var(--t3)"}}>{linkedCust.phone}</div>
            <div style={{display:"flex",gap:4,marginTop:4}}>{linkedCust.tags.map((tg,i)=><span key={i} className={`bdg ${tg==="VIP"?"b-ac":tg==="regular"?"b-gn":"b-bl"}`}>{tg}</span>)}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:800,fontFamily:"var(--fm)",color:"var(--ac)"}}>{linkedCust.visits}x</div>
            <div style={{fontSize:9,color:"var(--t4)"}}>kunjungan</div>
          </div>
        </div>
        {linkedCust.notes&&<div style={{fontSize:10,color:"var(--t3)",marginTop:8,padding:8,background:"var(--b3)",borderRadius:"var(--r1)"}}>📝 {linkedCust.notes}</div>}
        <button className="bs" style={{marginTop:8,color:"var(--rd)"}} onClick={()=>onUpdate({...t,customerId:null})}>Lepas Customer</button>
      </div>
      :<>
        <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>🔍 Cari Customer</div>
        <input className="inp" style={{width:"100%",marginBottom:8}} placeholder="Nama atau nomor HP..." value={custSearch} onChange={e=>sCS(e.target.value)}/>
        <div style={{maxHeight:160,overflowY:"auto",marginBottom:12}}>
          {filteredCusts.map(c=><div key={c.id} onClick={()=>linkCustomer(c.id)} style={{display:"flex",alignItems:"center",gap:8,padding:8,borderBottom:"1px solid var(--bd)",cursor:"pointer",borderRadius:"var(--r1)",transition:"background .15s"}}>
            <div style={{fontSize:9,fontWeight:700,color:"var(--ac)",fontFamily:"var(--fm)",minWidth:24}}>{c.visits}x</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.name}</div><div style={{fontSize:10,color:"var(--t4)"}}>{c.phone}</div></div>
            <div style={{display:"flex",gap:2}}>{c.tags.map((tg,i)=><span key={i} className={`bdg ${tg==="VIP"?"b-ac":tg==="regular"?"b-gn":"b-bl"}`}>{tg}</span>)}</div>
          </div>)}
        </div>
        <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>➕ Atau tambah baru:</div>
        <div style={{display:"flex",gap:6,marginBottom:6}}>
          <input className="inp" style={{flex:1}} placeholder="Nama" value={custName} onChange={e=>sCN(e.target.value)}/>
          <input className="inp" style={{flex:1}} placeholder="No. HP" value={custPhone} onChange={e=>sCP(e.target.value)}/>
          <button className="bs" onClick={addNewCust}>Simpan</button>
        </div>
      </>}
    </>}

    {/* QR TABLE TAB */}
    {tab==="qr"&&<div style={{textAlign:"center"}}>
      <div style={{fontSize:11,color:"var(--t3)",marginBottom:6}}>QR Code unik untuk Meja {t.num}</div>
      <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>Scan untuk Self-Order & Payment</div>
      <div style={{display:"inline-block",padding:16,background:"#fff",borderRadius:16,marginBottom:12}}>
        <QR data={t.qrCode} size={200} logo="🪑"/>
      </div>
      <div style={{fontFamily:"var(--fm)",fontSize:9,color:"var(--t4)",marginBottom:6,wordBreak:"break-all"}}>{t.qrCode}</div>
      <div style={{background:"var(--b3)",borderRadius:"var(--r2)",padding:12,marginBottom:12,textAlign:"left"}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:6}}>📱 Customer Flow via QR:</div>
        <div style={{fontSize:10,color:"var(--t3)",lineHeight:1.8}}>
          1️⃣ Customer scan QR di meja<br/>
          2️⃣ Buka halaman self-order Meja {t.num}<br/>
          3️⃣ Pilih menu → Submit order<br/>
          4️⃣ Order masuk ke dapur otomatis<br/>
          5️⃣ Bayar langsung via QRIS / E-Wallet<br/>
          6️⃣ Dapat invoice + QR feedback
        </div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button className="bp" style={{flex:1}} onClick={()=>window.print()}>🖨️ Print QR</button>
        <button className="bs" style={{flex:1}} onClick={()=>navigator.clipboard?.writeText(t.qrCode)}>📋 Copy Link</button>
      </div>
    </div>}

    {/* PRINT ORDER TAB */}
    {tab==="print"&&<>
      <div className="print-order">
        <h3>🔥 WARMINDO JAYA — Checklist Order</h3>
        <div className="print-hr"/>
        <div className="print-row"><span>Meja:</span><span style={{fontWeight:700}}>#{t.num}</span></div>
        <div className="print-row"><span>Waktu:</span><span>{t.startTime?fFull(t.startTime):fTime()}</span></div>
        {linkedCust&&<div className="print-row"><span>Customer:</span><span style={{fontWeight:700}}>{linkedCust.name}</span></div>}
        <div className="print-hr"/>
        <div style={{fontWeight:700,marginBottom:4}}>PESANAN:</div>
        {cart.map((o,i)=><div key={i} className="print-check">
          <div className="print-checkbox"/>
          <div style={{flex:1}}>{o.n}</div>
          <div style={{fontWeight:700}}>x{o.qty}</div>
        </div>)}
        <div className="print-hr"/>
        <div className="print-row" style={{fontWeight:700,fontSize:12}}><span>Total Item: {cart.reduce((s,c)=>s+c.qty,0)}</span><span>{rp(total)}</span></div>
        <div style={{textAlign:"center",marginTop:8,fontSize:9,color:"#999"}}>⏰ Dicetak: {fTime()} • Kasir: Warmindo POS</div>
      </div>
      <button className="bp" style={{width:"100%"}} onClick={()=>window.print()}>🖨️ Print Kitchen Order</button>
    </>}

    {/* RECEIPT + FEEDBACK QR TAB */}
    {tab==="receipt"&&<>
      <div className="receipt">
        <div className="receipt-center">
          <div style={{fontSize:18,fontWeight:800,fontFamily:"var(--f)"}}>🔥 WARMINDO JAYA</div>
          <div style={{fontSize:9,color:"#888"}}>Jl. Raya Ciputat No. 88</div>
          <div style={{fontSize:9,color:"#888"}}>{fDate()} {fTime()}</div>
          <div style={{fontSize:9,color:"#888"}}>Meja #{t.num} • #{gid().toUpperCase().slice(0,8)}</div>
        </div>
        <hr className="print-hr"/>
        {linkedCust&&<div style={{fontSize:10,marginBottom:4}}>Customer: <b>{linkedCust.name}</b> ({linkedCust.visits+1}x kunjungan)</div>}
        {cart.map((o,i)=><div key={i}>
          <div className="print-row"><span>{o.n}</span><span>{rp(o.p*o.qty)}</span></div>
          <div style={{fontSize:9,color:"#999",paddingLeft:4}}>{o.qty}x {rp(o.p)}</div>
        </div>)}
        <hr className="print-hr"/>
        <div className="print-row" style={{fontWeight:700,fontSize:13}}><span>TOTAL</span><span>{rp(total)}</span></div>
        <hr className="print-hr"/>

        {/* Payment QR */}
        <div className="receipt-center" style={{margin:"12px 0"}}>
          <div style={{fontSize:10,color:"#666",marginBottom:4}}>💳 Scan untuk bayar langsung</div>
          <QR data={`pay.warmindo.id/table/${t.num}/bill/${total}`} size={120} fg="#1a1a2e" logo="💳"/>
          <div style={{fontSize:8,color:"#999",marginTop:4}}>QRIS • GoPay • OVO • DANA • ShopeePay</div>
        </div>

        <hr className="print-hr"/>

        {/* Feedback QR */}
        <div className="receipt-center" style={{margin:"12px 0"}}>
          <div style={{fontSize:10,color:"#666",marginBottom:4}}>⭐ Kasih rating & testimoni:</div>
          <QR data={`feedback.warmindo.id/table/${t.num}/review`} size={100} fg="#6D28D9" logo="⭐"/>
          <div style={{fontSize:8,color:"#999",marginTop:4}}>Scan untuk kasih bintang & komentar</div>
        </div>

        <hr className="print-hr"/>
        <div className="receipt-center" style={{fontSize:9,color:"#888"}}>
          Terima kasih! Semoga berkah & kenyang 🤲<br/>
          {linkedCust&&`Kunjungan ke-${linkedCust.visits+1} • `}Follow @warmindojaya
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginTop:8}}>
        <button className="bp" style={{flex:1}} onClick={()=>window.print()}>🖨️ Print Invoice</button>
        <button className="bs" style={{flex:1,color:"var(--gn)"}} onClick={clearTable}>✅ Selesai & Clear</button>
      </div>
    </>}
  </div></div>);
};

// ═════════════════════════════════════════════════════════════════════
// SELF-ORDER PREVIEW MODAL (what customer sees)
// ═════════════════════════════════════════════════════════════════════
const SelfOrderPreview=({tableNum,onClose,menu})=>{
  const[cat,sCat]=useState("all");
  const[cart,sCart]=useState([]);
  const[step,sSt]=useState("menu"); // menu | review | pay | done
  const filtered=cat==="all"?menu:menu.filter(m=>m.c===cat);
  const total=cart.reduce((s,c)=>s+c.p*c.qty,0);

  return(<div className="mo" onClick={onClose}><div className="ml" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
    {step==="menu"&&<>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:36}}>🔥</div>
        <div style={{fontSize:16,fontWeight:800}}>Warmindo Djaya Rasa</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>Meja #{tableNum} — Self-Order</div>
      </div>
      <div className="tabs" style={{marginBottom:8}}>
        {CATS.map(c=><button key={c.id} className={`tab ${cat===c.id?"on":""}`} onClick={()=>sCat(c.id)} style={{fontSize:9}}>{c.e} {c.n}</button>)}
      </div>
      <div style={{maxHeight:250,overflowY:"auto",marginBottom:10}}>
        {filtered.map(m=>{
          const inCart=cart.find(o=>o.id===m.id);
          return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--bd)"}}>
            <span style={{fontSize:20}}>{m.e}</span>
            <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{m.n}</div><div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--ac)"}}>{rp(m.p)}</div></div>
            {inCart?<div style={{display:"flex",alignItems:"center",gap:4}}>
              <button className="bs sm" onClick={()=>sCart(p=>p.map(o=>o.id===m.id?{...o,qty:Math.max(0,o.qty-1)}:o).filter(o=>o.qty>0))}>−</button>
              <span style={{fontFamily:"var(--fm)",fontWeight:700,fontSize:12,minWidth:16,textAlign:"center"}}>{inCart.qty}</span>
              <button className="bs sm" onClick={()=>sCart(p=>p.map(o=>o.id===m.id?{...o,qty:o.qty+1}:o))}>+</button>
            </div>
            :<button className="bs sm" onClick={()=>sCart(p=>[...p,{...m,qty:1}])}>+ Tambah</button>}
          </div>)
        })}
      </div>
      {cart.length>0&&<div style={{padding:10,background:"var(--acg)",borderRadius:"var(--r2)",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",fontWeight:700}}><span>{cart.reduce((s,c)=>s+c.qty,0)} item</span><span style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{rp(total)}</span></div>
      </div>}
      <button className="bp" style={{width:"100%"}} disabled={cart.length===0} onClick={()=>sSt("review")}>📋 Review Pesanan</button>
    </>}

    {step==="review"&&<>
      <div className="ml-t">📋 Review Pesanan — Meja #{tableNum}<button className="ml-x" onClick={()=>sSt("menu")}>←</button></div>
      {cart.map(o=><div key={o.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--bd)"}}>
        <span style={{fontSize:18}}>{o.e}</span><div style={{flex:1,fontSize:11,fontWeight:600}}>{o.n} × {o.qty}</div>
        <div style={{fontFamily:"var(--fm)",fontSize:11,fontWeight:700,color:"var(--ac)"}}>{rp(o.p*o.qty)}</div>
      </div>)}
      <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontSize:18,fontWeight:800,borderTop:"2px dashed var(--bd2)",marginTop:8}}>
        <span>Total</span><span style={{fontFamily:"var(--fm)",color:"var(--ac)"}}>{rp(total)}</span>
      </div>
      <button className="bp" style={{width:"100%"}} onClick={()=>sSt("pay")}>💳 Bayar Sekarang</button>
    </>}

    {step==="pay"&&<>
      <div className="ml-t">💳 Pembayaran<button className="ml-x" onClick={()=>sSt("review")}>←</button></div>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:28,fontWeight:900,fontFamily:"var(--fm)",color:"var(--ac)"}}>{rp(total)}</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>Meja #{tableNum}</div>
      </div>
      <div style={{textAlign:"center",padding:16,background:"var(--b3)",borderRadius:"var(--r3)",marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>Scan QRIS untuk bayar:</div>
        <QR data={`qris.warmindo.id/pay/${total}/${tableNum}`} size={180}/>
        <div style={{fontSize:9,color:"var(--t4)",marginTop:8}}>GoPay • OVO • DANA • ShopeePay • Bank</div>
      </div>
      <button className="bp" style={{width:"100%"}} onClick={()=>sSt("done")}>✅ Simulasi: Pembayaran Berhasil</button>
    </>}

    {step==="done"&&<>
      <div style={{textAlign:"center",padding:20}}>
        <div style={{fontSize:56,marginBottom:8}}>✅</div>
        <div style={{fontSize:20,fontWeight:800,color:"var(--gn)"}}>Pembayaran Berhasil!</div>
        <div style={{fontSize:13,color:"var(--t3)",marginBottom:16}}>{rp(total)} — Meja #{tableNum}</div>
        <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>⭐ Bantu kami jadi lebih baik:</div>
        <div style={{display:"inline-block",padding:12,background:"#fff",borderRadius:12,marginBottom:8}}>
          <QR data={`feedback.warmindo.id/table/${tableNum}`} size={120} fg="#6D28D9" logo="⭐"/>
        </div>
        <div style={{fontSize:10,color:"var(--t4)"}}>Scan untuk kasih rating & testimoni</div>
      </div>
      <button className="bp" style={{width:"100%"}} onClick={onClose}>👋 Selesai</button>
    </>}
  </div></div>);
};

// ═════════════════════════════════════════════════════════════════════
// PAGES
// ═════════════════════════════════════════════════════════════════════

const TablesPage=({tables,setTables,customers,setCustomers})=>{
  const[sel,sSel]=useState(null);
  const[selfOrder,sSO]=useState(null);
  const occupied=tables.filter(t=>t.status!=="empty").length;
  const totalBill=tables.reduce((s,t)=>s+t.currentBill,0);
  const statusColors={empty:"var(--t4)",occupied:"var(--ac)",ordering:"var(--bl)",served:"var(--gn)",paying:"var(--pr)",cleaning:"var(--yl)"};
  const statusLabels={empty:"Kosong",occupied:"Terisi",ordering:"Pesan",served:"Tersaji",paying:"Bayar",cleaning:"Bersih"};

  return(<div className="pe">
    <div className="g g4">
      <div className="sc"><div className="sc-ic" style={{background:"var(--acg)"}}>🪑</div><div className="sc-l">Total Meja</div><div className="sc-v">{tables.length}</div></div>
      <div className="sc"><div className="sc-ic" style={{background:"var(--gng)"}}>✅</div><div className="sc-l">Kosong</div><div className="sc-v" style={{color:"var(--gn)"}}>{tables.length-occupied}</div></div>
      <div className="sc"><div className="sc-ic" style={{background:"var(--blg)"}}>🔥</div><div className="sc-l">Terisi</div><div className="sc-v" style={{color:"var(--bl)"}}>{occupied}</div></div>
      <div className="sc"><div className="sc-ic" style={{background:"var(--acg)"}}>💰</div><div className="sc-l">Total Bill Aktif</div><div className="sc-v" style={{color:"var(--ac)"}}>{rp(totalBill)}</div></div>
    </div>

    {/* Legend */}
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
      {Object.entries(statusLabels).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--t3)"}}>
        <div style={{width:10,height:10,borderRadius:3,background:statusColors[k]}}/>{v}
      </div>)}
    </div>

    {/* Floor Plan */}
    <div className="floor">
      {tables.map(t=>(
        <div key={t.id} className={`tcard ${t.status}`} onClick={()=>sSel(t)}>
          <div className="tcard-status"><div style={{width:8,height:8,borderRadius:"50%",background:statusColors[t.status]}} /></div>
          <div className="tcard-num">{t.num}</div>
          <div className="tcard-name">{t.name}</div>
          <div className="tcard-cap">👤 {t.capacity} kursi</div>
          {t.currentBill>0&&<div className="tcard-bill">{rp(t.currentBill)}</div>}
          {t.startTime&&<div className="tcard-time">⏱ {fFull(t.startTime).split(" ").pop()}</div>}
          {t.orders.length>0&&<div style={{fontSize:9,color:"var(--t3)",marginTop:2}}>{t.orders.length} item</div>}
        </div>
      ))}
    </div>

    {/* Quick: Self-order preview */}
    <div className="bx">
      <div className="bx-t">📱 Preview Self-Order (Customer View)</div>
      <div style={{fontSize:11,color:"var(--t3)",marginBottom:8}}>Klik untuk simulasi apa yang dilihat customer saat scan QR di meja:</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {tables.slice(0,6).map(t=><button key={t.id} className="bs" onClick={()=>sSO(t.num)}>📱 Meja {t.num}</button>)}
      </div>
    </div>

    {sel&&<TableModal table={sel} onClose={()=>sSel(null)} onUpdate={updated=>{setTables(p=>p.map(t=>t.id===updated.id?updated:t));sSel(updated)}} customers={customers} onAddCustomer={c=>setCustomers(p=>[...p,c])} menu={MENU}/>}
    {selfOrder&&<SelfOrderPreview tableNum={selfOrder} onClose={()=>sSO(null)} menu={MENU}/>}
  </div>);
};

const CustomersPage=({customers,setCustomers,feedback})=>{
  const[search,sSr]=useState("");
  const[tab,sTab]=useState("all");
  const filtered=customers.filter(c=>{
    if(tab==="vip")return c.tags.includes("VIP");
    if(tab==="regular")return c.tags.includes("regular");
    if(tab==="new")return c.visits<=2;
    return true;
  }).filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search));
  const totalSpent=customers.reduce((s,c)=>s+c.totalSpent,0);
  const totalVisits=customers.reduce((s,c)=>s+c.visits,0);
  const returnRate=customers.filter(c=>c.visits>=2).length;

  return(<div className="pe">
    <div className="g g4">
      <div className="sc"><div className="sc-ic" style={{background:"var(--blg)"}}>👥</div><div className="sc-l">Total Customer</div><div className="sc-v">{customers.length}</div></div>
      <div className="sc"><div className="sc-ic" style={{background:"var(--gng)"}}>🔁</div><div className="sc-l">Return Customer</div><div className="sc-v" style={{color:"var(--gn)"}}>{returnRate}</div><div className="sc-s">{customers.length>0?Math.round(returnRate/customers.length*100):0}% return rate</div></div>
      <div className="sc"><div className="sc-ic" style={{background:"var(--acg)"}}>💰</div><div className="sc-l">Total Revenue</div><div className="sc-v" style={{color:"var(--ac)"}}>{rp(totalSpent)}</div></div>
      <div className="sc"><div className="sc-ic" style={{background:"var(--prg)"}}>📊</div><div className="sc-l">Total Kunjungan</div><div className="sc-v" style={{color:"var(--pr)"}}>{totalVisits}</div></div>
    </div>

    <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
      <input className="inp" style={{flex:1}} placeholder="🔍 Cari nama / HP..." value={search} onChange={e=>sSr(e.target.value)}/>
      <div className="tabs" style={{marginBottom:0}}>
        {[{id:"all",l:"Semua"},{id:"vip",l:"⭐ VIP"},{id:"regular",l:"🔁 Regular"},{id:"new",l:"🆕 Baru"}].map(x=>
          <button key={x.id} className={`tab ${tab===x.id?"on":""}`} onClick={()=>sTab(x.id)}>{x.l}</button>)}
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10,marginBottom:14}}>
      {filtered.map(c=>(
        <div key={c.id} className="ccard">
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <div style={{width:40,height:40,background:"var(--b4)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"var(--ac)",fontFamily:"var(--fm)"}}>{c.name.charAt(0)}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{c.name}</div>
              <div style={{fontSize:10,color:"var(--t4)"}}>{c.phone}{c.email?` • ${c.email}`:""}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="stars">{"⭐".repeat(Math.round(c.rating||0))}</div>
              <div style={{fontSize:9,color:"var(--t4)"}}>{c.rating||"—"}/5</div>
            </div>
          </div>
          <div style={{display:"flex",gap:3,marginBottom:6}}>{c.tags.map((tg,i)=><span key={i} className={`bdg ${tg==="VIP"?"b-ac":tg==="regular"?"b-gn":tg==="mahasiswa"?"b-pr":"b-bl"}`}>{tg}</span>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:6}}>
            <div style={{background:"var(--b3)",borderRadius:6,padding:"6px 8px",textAlign:"center"}}><div style={{fontSize:8,color:"var(--t4)"}}>Kunjungan</div><div style={{fontSize:14,fontWeight:800,fontFamily:"var(--fm)",color:"var(--bl)"}}>{c.visits}x</div></div>
            <div style={{background:"var(--b3)",borderRadius:6,padding:"6px 8px",textAlign:"center"}}><div style={{fontSize:8,color:"var(--t4)"}}>Total Spent</div><div style={{fontSize:11,fontWeight:700,fontFamily:"var(--fm)",color:"var(--gn)"}}>{rp(c.totalSpent)}</div></div>
            <div style={{background:"var(--b3)",borderRadius:6,padding:"6px 8px",textAlign:"center"}}><div style={{fontSize:8,color:"var(--t4)"}}>Avg/Visit</div><div style={{fontSize:11,fontWeight:700,fontFamily:"var(--fm)",color:"var(--ac)"}}>{c.visits?rp(Math.round(c.totalSpent/c.visits)):"—"}</div></div>
          </div>
          {c.notes&&<div style={{fontSize:9,color:"var(--t3)",padding:"4px 6px",background:"var(--b4)",borderRadius:4}}>📝 {c.notes}</div>}
          <div style={{fontSize:9,color:"var(--t4)",marginTop:4}}>Kunjungan terakhir: {c.lastVisit}</div>
        </div>
      ))}
    </div>

    {/* Feedback Section */}
    <div className="bx">
      <div className="bx-t">⭐ Testimoni & Feedback <span className="cnt-bdg">{feedback.length} reviews</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:8}}>
        {feedback.map(f=>(
          <div key={f.id} className="fcard">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:12,fontWeight:600}}>{f.custName}</div>
              <div className="stars">{"⭐".repeat(f.rating)}</div>
            </div>
            <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.5,marginBottom:6}}>"{f.comment}"</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"var(--t4)"}}>
              <span>Meja #{f.tableNum}</span>
              <span>{fFull(f.date)}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:12}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>⭐ QR Feedback (tempel di meja/struk)</div>
        <div style={{display:"inline-block",padding:12,background:"#fff",borderRadius:12}}>
          <QR data="feedback.warmindo.id/review" size={140} fg="#6D28D9" logo="⭐"/>
        </div>
        <div style={{fontSize:9,color:"var(--t4)",marginTop:4}}>feedback.warmindo.id/review</div>
      </div>
    </div>
  </div>);
};

const QRManagerPage=({tables})=>{
  return(<div className="pe">
    <div className="bx">
      <div className="bx-t">📱 QR Code per Meja <span className="cnt-bdg">{tables.length} meja</span></div>
      <div style={{fontSize:11,color:"var(--t3)",marginBottom:12}}>Print dan tempel di setiap meja. Customer scan → self-order → bayar langsung.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        {tables.map(t=>(
          <div key={t.id} style={{background:"var(--b3)",borderRadius:"var(--r3)",padding:14,textAlign:"center"}}>
            <div style={{display:"inline-block",padding:10,background:"#fff",borderRadius:10,marginBottom:8}}>
              <QR data={t.qrCode} size={130} logo="🪑"/>
            </div>
            <div style={{fontSize:14,fontWeight:800}}>Meja {t.num}</div>
            <div style={{fontSize:10,color:"var(--t4)"}}>{t.capacity} kursi</div>
            <div style={{fontSize:8,fontFamily:"var(--fm)",color:"var(--t4)",marginTop:4,wordBreak:"break-all"}}>{t.qrCode}</div>
            <button className="bs sm" style={{width:"100%",marginTop:6}} onClick={()=>window.print()}>🖨️ Print</button>
          </div>
        ))}
      </div>
    </div>

    <div className="g g2">
      <div className="bx">
        <div className="bx-t">💳 QR Payment (Universal)</div>
        <div style={{textAlign:"center"}}>
          <div style={{display:"inline-block",padding:14,background:"#fff",borderRadius:14,marginBottom:8}}>
            <QR data="qris.warmindo.id/pay" size={180}/>
          </div>
          <div style={{fontSize:11,fontWeight:600}}>QRIS Universal</div>
          <div style={{fontSize:9,color:"var(--t4)"}}>NMID: ID10240388291</div>
          <div style={{fontSize:9,color:"var(--t4)",marginTop:4}}>GoPay • OVO • DANA • ShopeePay • Bank</div>
        </div>
      </div>
      <div className="bx">
        <div className="bx-t">⭐ QR Feedback (Global)</div>
        <div style={{textAlign:"center"}}>
          <div style={{display:"inline-block",padding:14,background:"#fff",borderRadius:14,marginBottom:8}}>
            <QR data="feedback.warmindo.id/review" size={180} fg="#6D28D9" logo="⭐"/>
          </div>
          <div style={{fontSize:11,fontWeight:600}}>Scan untuk Review</div>
          <div style={{fontSize:9,color:"var(--t4)"}}>Keluar di invoice & tempel di meja</div>
          <div style={{fontSize:9,color:"var(--t4)",marginTop:4}}>feedback.warmindo.id/review</div>
        </div>
      </div>
    </div>
  </div>);
};

// ═════════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════════
export default function WarmindoPOS(){
  const[pg,sPg]=useState("tables");
  const[tables,setTables]=useLS("w5_tables",INIT_TABLES);
  const[customers,setCustomers]=useLS("w5_custs",INIT_CUSTOMERS);
  const[feedback]=useLS("w5_fb",INIT_FEEDBACK);
  const[time,sT]=useState(new Date());
  useEffect(()=>{const i=setInterval(()=>sT(new Date()),1000);return()=>clearInterval(i)},[]);

  const nav=[
    {id:"tables",em:"🪑",l:"Meja & Order"},
    {id:"customers",em:"👥",l:"Customer CRM"},
    {id:"qr",em:"📱",l:"QR Manager"},
  ];
  const titles={tables:"Meja & Order",customers:"Customer Database",qr:"QR Code Manager"};

  return(<><style>{CSS}</style><div className="app">
    <nav className="sb">
      <div className="sb-logo"><div className="sb-licon">🔥</div><div><div className="sb-ltxt">Warmindo</div><div className="sb-lsub">TABLE + CRM</div></div></div>
      <div className="sb-sec"><div className="sb-lbl">Menu</div>
        {nav.map(n=><div key={n.id} className={`sb-i ${pg===n.id?"on":""}`} onClick={()=>sPg(n.id)}><span className="em">{n.em}</span><span>{n.l}</span></div>)}
      </div>
      <div className="sb-sp"/>
      <div className="sb-ft">🔥 Warmindo POS v5<br/>Table Management + CRM<br/>QR Self-Order + Payment<br/>Kitchen Print + Feedback</div>
    </nav>
    <div className="mn">
      <header className="hdr">
        <div className="hdr-t">{titles[pg]}</div>
        <div className="hdr-bdg">v5 TABLE+CRM</div>
        <div className="hdr-sp"/>
        <div className="hdr-clk">{time.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
      </header>
      <div className="cnt">
        {pg==="tables"&&<TablesPage tables={tables} setTables={setTables} customers={customers} setCustomers={setCustomers}/>}
        {pg==="customers"&&<CustomersPage customers={customers} setCustomers={setCustomers} feedback={feedback}/>}
        {pg==="qr"&&<QRManagerPage tables={tables}/>}
      </div>
    </div>
  </div></>);
}
