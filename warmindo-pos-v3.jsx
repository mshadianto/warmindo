import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// WARMINDO POS v3.0 — ENTERPRISE
// Multi-Cabang • QRIS • Payment Komplit • Karyawan • CCTV • Inventori
// ═══════════════════════════════════════════════════════════════════════════

// ─── DATA ──────────────────────────────────────────────────────────────────
const CATEGORIES=[{id:"all",name:"Semua",icon:"🍽️"},{id:"indomie",name:"Indomie",icon:"🍜"},{id:"nasi",name:"Nasi",icon:"🍚"},{id:"gorengan",name:"Gorengan",icon:"🍤"},{id:"minuman",name:"Minuman",icon:"🥤"},{id:"snack",name:"Snack",icon:"🍢"},{id:"extra",name:"Topping",icon:"➕"}];

const PRODUCTS=[
{id:1,name:"Indomie Goreng",price:8000,cat:"indomie",stock:50,img:"🍜"},
{id:2,name:"Indomie Rebus",price:8000,cat:"indomie",stock:50,img:"🍜"},
{id:3,name:"Indomie Goreng Telur",price:12000,cat:"indomie",stock:40,img:"🍳"},
{id:4,name:"Indomie Rebus Telur",price:12000,cat:"indomie",stock:40,img:"🍳"},
{id:5,name:"Indomie Double",price:14000,cat:"indomie",stock:30,img:"🍜"},
{id:6,name:"Indomie Nyemek",price:10000,cat:"indomie",stock:35,img:"🍜"},
{id:7,name:"Indomie Seblak",price:13000,cat:"indomie",stock:25,img:"🌶️"},
{id:8,name:"Mie Goreng Jawa",price:15000,cat:"indomie",stock:20,img:"🍝"},
{id:9,name:"Nasi Goreng",price:15000,cat:"nasi",stock:30,img:"🍛"},
{id:10,name:"Nasi Telur",price:10000,cat:"nasi",stock:40,img:"🍚"},
{id:11,name:"Nasi Putih",price:5000,cat:"nasi",stock:60,img:"🍚"},
{id:12,name:"Nasi Uduk",price:8000,cat:"nasi",stock:25,img:"🍚"},
{id:13,name:"Nasi Kuning",price:10000,cat:"nasi",stock:20,img:"🍛"},
{id:14,name:"Tempe Goreng",price:3000,cat:"gorengan",stock:40,img:"🟫"},
{id:15,name:"Tahu Goreng",price:3000,cat:"gorengan",stock:40,img:"🟨"},
{id:16,name:"Bakwan",price:3000,cat:"gorengan",stock:30,img:"🍤"},
{id:17,name:"Pisang Goreng",price:4000,cat:"gorengan",stock:25,img:"🍌"},
{id:18,name:"Mendoan",price:4000,cat:"gorengan",stock:30,img:"🟫"},
{id:19,name:"Es Teh Manis",price:5000,cat:"minuman",stock:80,img:"🧊"},
{id:20,name:"Teh Anget",price:4000,cat:"minuman",stock:80,img:"☕"},
{id:21,name:"Es Jeruk",price:6000,cat:"minuman",stock:50,img:"🍊"},
{id:22,name:"Kopi Hitam",price:5000,cat:"minuman",stock:60,img:"☕"},
{id:23,name:"Es Kopi Susu",price:10000,cat:"minuman",stock:40,img:"🧋"},
{id:24,name:"Air Mineral",price:4000,cat:"minuman",stock:100,img:"💧"},
{id:25,name:"Susu Coklat",price:8000,cat:"minuman",stock:30,img:"🥛"},
{id:26,name:"Kerupuk",price:2000,cat:"snack",stock:60,img:"🍘"},
{id:27,name:"Sate Telur Puyuh",price:5000,cat:"snack",stock:30,img:"🍢"},
{id:28,name:"Otak-otak",price:4000,cat:"snack",stock:25,img:"🍢"},
{id:29,name:"Telur Ceplok",price:5000,cat:"extra",stock:50,img:"🍳"},
{id:30,name:"Kornet",price:5000,cat:"extra",stock:30,img:"🥫"},
{id:31,name:"Sosis",price:5000,cat:"extra",stock:30,img:"🌭"},
{id:32,name:"Keju",price:4000,cat:"extra",stock:20,img:"🧀"},
];

const BRANCHES=[
{id:"hq",name:"Warmindo Pusat",address:"Jl. Raya Ciputat No. 88",city:"Tangerang Selatan",phone:"0812-3456-7890",isHQ:true,active:true},
{id:"br1",name:"Cabang Pamulang",address:"Jl. Pamulang Raya No. 12",city:"Tangerang Selatan",phone:"0813-1111-2222",isHQ:false,active:true},
{id:"br2",name:"Cabang Depok",address:"Jl. Margonda No. 45",city:"Depok",phone:"0814-3333-4444",isHQ:false,active:true},
];

const ORDER_TYPES=[
{id:"dine_in",label:"Dine In",icon:"🪑"},{id:"take_away",label:"Bungkus",icon:"📦"},
{id:"gofood",label:"GoFood",icon:"🟢"},{id:"grab",label:"GrabFood",icon:"🟠"},{id:"shopee",label:"ShopeeFood",icon:"🔴"},
];

const PAYMENT_METHODS=[
{id:"cash",label:"Tunai",icon:"💵",group:"cash"},
{id:"qris",label:"QRIS",icon:"📱",group:"digital"},
{id:"gopay",label:"GoPay",icon:"🟢",group:"ewallet"},
{id:"ovo",label:"OVO",icon:"🟣",group:"ewallet"},
{id:"dana",label:"DANA",icon:"🔵",group:"ewallet"},
{id:"shopeepay",label:"ShopeePay",icon:"🔴",group:"ewallet"},
{id:"bca",label:"BCA",icon:"🏦",group:"bank"},
{id:"bri",label:"BRI",icon:"🏦",group:"bank"},
{id:"mandiri",label:"Mandiri",icon:"🏦",group:"bank"},
{id:"bsi",label:"BSI",icon:"🏦",group:"bank"},
{id:"gofood_pay",label:"Via GoFood",icon:"🟢",group:"platform"},
{id:"grab_pay",label:"Via GrabFood",icon:"🟠",group:"platform"},
];
const PAY_GROUPS=[{id:"cash",label:"Tunai"},{id:"digital",label:"QRIS"},{id:"ewallet",label:"E-Wallet"},{id:"bank",label:"Transfer"},{id:"platform",label:"Platform"}];

const INIT_EMPLOYEES=[
{id:"e1",name:"Ahmad Rizki",role:"Kasir",phone:"0812-1111-0001",branch:"hq",salary:2500000,photo:"👨‍🍳",status:"active",joinDate:"2024-03-15"},
{id:"e2",name:"Siti Nurhaliza",role:"Koki",phone:"0812-1111-0002",branch:"hq",salary:2800000,photo:"👩‍🍳",status:"active",joinDate:"2024-01-10"},
{id:"e3",name:"Budi Santoso",role:"Kasir",phone:"0812-1111-0003",branch:"br1",salary:2500000,photo:"👨",status:"active",joinDate:"2024-06-01"},
{id:"e4",name:"Dewi Lestari",role:"Koki",phone:"0812-1111-0004",branch:"br1",salary:2800000,photo:"👩‍🍳",status:"active",joinDate:"2024-02-20"},
{id:"e5",name:"Rudi Hermawan",role:"Kasir",phone:"0812-1111-0005",branch:"br2",salary:2500000,photo:"👨",status:"active",joinDate:"2024-05-05"},
{id:"e6",name:"Rina Wati",role:"Pelayan",phone:"0812-1111-0006",branch:"hq",salary:2200000,photo:"👩",status:"active",joinDate:"2024-07-01"},
{id:"e7",name:"Joko Widodo",role:"Koki",phone:"0812-1111-0007",branch:"br2",salary:2800000,photo:"👨‍🍳",status:"active",joinDate:"2024-04-12"},
{id:"e8",name:"Maya Sari",role:"Pelayan",phone:"0812-1111-0008",branch:"br1",salary:2200000,photo:"👩",status:"active",joinDate:"2025-01-15"},
];

const INIT_ATTENDANCE=[
{empId:"e1",date:"2026-04-08",clockIn:"07:55",clockOut:"16:02",status:"hadir",note:""},
{empId:"e2",date:"2026-04-08",clockIn:"06:30",clockOut:"15:05",status:"hadir",note:""},
{empId:"e3",date:"2026-04-08",clockIn:"08:12",clockOut:null,status:"terlambat",note:"Macet"},
{empId:"e4",date:"2026-04-08",clockIn:"07:00",clockOut:"15:30",status:"hadir",note:""},
{empId:"e5",date:"2026-04-08",clockIn:null,clockOut:null,status:"izin",note:"Sakit"},
{empId:"e6",date:"2026-04-08",clockIn:"07:58",clockOut:null,status:"hadir",note:""},
{empId:"e7",date:"2026-04-08",clockIn:"07:45",clockOut:null,status:"hadir",note:""},
{empId:"e8",date:"2026-04-08",clockIn:null,clockOut:null,status:"alpha",note:""},
{empId:"e1",date:"2026-04-07",clockIn:"07:50",clockOut:"16:00",status:"hadir",note:""},
{empId:"e2",date:"2026-04-07",clockIn:"06:28",clockOut:"15:10",status:"hadir",note:""},
{empId:"e3",date:"2026-04-07",clockIn:"07:55",clockOut:"16:05",status:"hadir",note:""},
{empId:"e5",date:"2026-04-07",clockIn:"08:00",clockOut:"16:00",status:"hadir",note:""},
];

const INIT_PERF=[
{empId:"e1",month:"2026-04",ordersHandled:342,rating:4.6,complaints:1,punctuality:95,speed:88},
{empId:"e2",month:"2026-04",ordersHandled:280,rating:4.8,complaints:0,punctuality:100,speed:92},
{empId:"e3",month:"2026-04",ordersHandled:198,rating:4.2,complaints:3,punctuality:78,speed:75},
{empId:"e4",month:"2026-04",ordersHandled:265,rating:4.7,complaints:0,punctuality:98,speed:90},
{empId:"e5",month:"2026-04",ordersHandled:150,rating:3.9,complaints:5,punctuality:60,speed:70},
{empId:"e6",month:"2026-04",ordersHandled:310,rating:4.5,complaints:2,punctuality:92,speed:85},
{empId:"e7",month:"2026-04",ordersHandled:245,rating:4.4,complaints:1,punctuality:96,speed:87},
{empId:"e8",month:"2026-04",ordersHandled:95,rating:3.5,complaints:4,punctuality:55,speed:60},
];

const INIT_CCTV=[
{id:"cam1",name:"Kasir Utama",location:"Depan Kasir",branch:"hq",status:"online",ip:"192.168.1.101",lastMotion:"2 menit lalu"},
{id:"cam2",name:"Dapur",location:"Area Masak",branch:"hq",status:"online",ip:"192.168.1.102",lastMotion:"30 detik lalu"},
{id:"cam3",name:"Ruang Makan",location:"Area Pelanggan",branch:"hq",status:"online",ip:"192.168.1.103",lastMotion:"1 menit lalu"},
{id:"cam4",name:"Pintu Belakang",location:"Gudang",branch:"hq",status:"offline",ip:"192.168.1.104",lastMotion:"3 jam lalu"},
{id:"cam5",name:"Kasir Pamulang",location:"Depan Kasir",branch:"br1",status:"online",ip:"192.168.2.101",lastMotion:"45 detik lalu"},
{id:"cam6",name:"Dapur Pamulang",location:"Area Masak",branch:"br1",status:"online",ip:"192.168.2.102",lastMotion:"1 menit lalu"},
{id:"cam7",name:"Kasir Depok",location:"Depan Kasir",branch:"br2",status:"online",ip:"192.168.3.101",lastMotion:"2 menit lalu"},
{id:"cam8",name:"Dapur Depok",location:"Area Masak",branch:"br2",status:"recording",ip:"192.168.3.102",lastMotion:"10 detik lalu"},
];

const INV_CATEGORIES=[{id:"makan",name:"Alat Makan",icon:"🍽️"},{id:"masak",name:"Alat Masak",icon:"🍳"},{id:"kebersihan",name:"Kebersihan",icon:"🧹"},{id:"kemasan",name:"Kemasan",icon:"📦"},{id:"lainnya",name:"Lainnya",icon:"📎"}];

const INIT_INVENTORY=[
{id:"inv1",name:"Piring Melamin",cat:"makan",qty:120,minQty:30,unit:"pcs",price:15000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv2",name:"Mangkok Melamin",cat:"makan",qty:80,minQty:20,unit:"pcs",price:12000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv3",name:"Sendok Stainless",cat:"makan",qty:150,minQty:40,unit:"pcs",price:5000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv4",name:"Garpu Stainless",cat:"makan",qty:100,minQty:30,unit:"pcs",price:5000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv5",name:"Gelas Kaca",cat:"makan",qty:60,minQty:20,unit:"pcs",price:8000,condition:"baik",lastCheck:"2026-04-06"},
{id:"inv6",name:"Gelas Plastik",cat:"makan",qty:200,minQty:50,unit:"pcs",price:2000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv7",name:"Sumpit",cat:"makan",qty:80,minQty:20,unit:"pasang",price:3000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv8",name:"Wajan Besar",cat:"masak",qty:4,minQty:2,unit:"pcs",price:250000,condition:"baik",lastCheck:"2026-04-05"},
{id:"inv9",name:"Panci Rebus",cat:"masak",qty:6,minQty:2,unit:"pcs",price:180000,condition:"baik",lastCheck:"2026-04-05"},
{id:"inv10",name:"Kompor Gas 2 Tungku",cat:"masak",qty:3,minQty:1,unit:"unit",price:450000,condition:"baik",lastCheck:"2026-04-01"},
{id:"inv11",name:"Spatula",cat:"masak",qty:8,minQty:3,unit:"pcs",price:25000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv12",name:"Talenan",cat:"masak",qty:5,minQty:2,unit:"pcs",price:35000,condition:"aus",lastCheck:"2026-04-06"},
{id:"inv13",name:"Pisau Dapur",cat:"masak",qty:6,minQty:2,unit:"pcs",price:45000,condition:"baik",lastCheck:"2026-04-06"},
{id:"inv14",name:"Sapu",cat:"kebersihan",qty:4,minQty:2,unit:"pcs",price:25000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv15",name:"Pel Lantai",cat:"kebersihan",qty:3,minQty:2,unit:"pcs",price:35000,condition:"aus",lastCheck:"2026-04-06"},
{id:"inv16",name:"Sabun Cuci Piring",cat:"kebersihan",qty:8,minQty:3,unit:"liter",price:15000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv17",name:"Lap Meja",cat:"kebersihan",qty:15,minQty:5,unit:"pcs",price:8000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv18",name:"Styrofoam Box",cat:"kemasan",qty:200,minQty:50,unit:"pcs",price:1500,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv19",name:"Plastik Kresek",cat:"kemasan",qty:500,minQty:100,unit:"pcs",price:300,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv20",name:"Cup Plastik + Tutup",cat:"kemasan",qty:300,minQty:80,unit:"pcs",price:1000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv21",name:"Sedotan",cat:"kemasan",qty:400,minQty:100,unit:"pcs",price:200,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv22",name:"Tisu Meja",cat:"kemasan",qty:50,minQty:15,unit:"pak",price:5000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv23",name:"Gas LPG 3kg",cat:"lainnya",qty:8,minQty:3,unit:"tabung",price:22000,condition:"baik",lastCheck:"2026-04-07"},
{id:"inv24",name:"Meja Lipat",cat:"lainnya",qty:10,minQty:4,unit:"pcs",price:350000,condition:"baik",lastCheck:"2026-04-01"},
{id:"inv25",name:"Kursi Plastik",cat:"lainnya",qty:40,minQty:15,unit:"pcs",price:55000,condition:"baik",lastCheck:"2026-04-01"},
];

// ─── UTILS ─────────────────────────────────────────────────────────────────
const rp=n=>"Rp"+(n||0).toLocaleString("id-ID");
const fT=d=>new Date(d).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
const fD=d=>new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
const gid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const tKey=()=>new Date().toISOString().split("T")[0];
const _useLS=(k,i)=>{const[v,s]=useState(()=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):i}catch{return i}});useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},[k,v]);return[v,s]};
const useLS=window.WDB?window.WDB.useDB:_useLS;
const useOrders=window.WDB?window.WDB.useOrders:_useLS;

// ─── QR Generator ──────────────────────────────────────────────────────────
const QRCode=({data,size=200})=>{
  const mods=useMemo(()=>{
    const sz=25,arr=[];let seed=0;
    for(let i=0;i<(data||"W").length;i++)seed=((seed<<5)-seed+(data||"W").charCodeAt(i))|0;
    const rng=()=>{seed=(seed*16807)%2147483647;return(seed&0x7fffffff)/0x7fffffff};
    for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){
      const tl=x<7&&y<7,tr=x>=sz-7&&y<7,bl=x<7&&y>=sz-7;
      if(tl||tr||bl){const fx=tl?0:tr?sz-7:0,fy=tl?0:tr?0:sz-7,lx=x-fx,ly=y-fy;const isO=lx===0||lx===6||ly===0||ly===6;const isI=lx>=2&&lx<=4&&ly>=2&&ly<=4;arr.push({x,y,on:isO||isI})}
      else arr.push({x,y,on:rng()>.5})}
    return{mods:arr,sz}
  },[data]);
  const cs=size/(mods.sz+2);
  return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:12}}><rect width={size} height={size} fill="#FFF" rx={12}/>{mods.mods.filter(m=>m.on).map((m,i)=><rect key={i} x={(m.x+1)*cs} y={(m.y+1)*cs} width={cs-.5} height={cs-.5} fill="#000" rx={1}/>)}<rect x={size/2-16} y={size/2-16} width={32} height={32} fill="#FFF" rx={7}/><text x={size/2} y={size/2+6} textAnchor="middle" fontSize="18">🔥</text></svg>)
};

// ─── STYLES (comprehensive) ────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
:root{
--b0:#06080F;--b1:#0C1017;--b2:#131924;--b3:#1B2333;--b4:#243044;--bh:#1F2A3E;
--bd:#1E293B;--bd2:#2A3550;
--t1:#F8FAFC;--t2:#CBD5E1;--t3:#64748B;--t4:#475569;
--ac:#F97316;--ac2:#FB923C;--acg:rgba(249,115,22,.12);
--gn:#22C55E;--gng:rgba(34,197,94,.12);
--rd:#EF4444;--rdg:rgba(239,68,68,.12);
--bl:#3B82F6;--blg:rgba(59,130,246,.12);
--pr:#8B5CF6;--prg:rgba(139,92,246,.12);
--yl:#F59E0B;--ylg:rgba(245,158,11,.12);
--cn:#06B6D4;--cng:rgba(6,182,212,.12);
--r1:8px;--r2:12px;--r3:16px;--r4:20px;
--f:'DM Sans',sans-serif;--fm:'Space Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
.W{font-family:var(--f);background:var(--b0);color:var(--t1);min-height:100vh;display:flex;overflow:hidden}
/* Sidebar */
.S{width:64px;background:var(--b1);border-right:1px solid var(--bd);display:flex;flex-direction:column;align-items:center;padding:10px 0;gap:1px;flex-shrink:0;z-index:100;overflow-y:auto;overflow-x:hidden}
.S::-webkit-scrollbar{width:0}
.S-logo{width:40px;height:40px;background:linear-gradient(135deg,#F97316,#DC2626);border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;box-shadow:0 4px 20px rgba(249,115,22,.35);flex-shrink:0}
.S-btn{width:42px;height:42px;border:none;background:transparent;color:var(--t4);border-radius:var(--r2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;position:relative;flex-shrink:0}
.S-btn:hover{background:var(--b3);color:var(--t3)}
.S-btn.on{background:var(--acg);color:var(--ac)}
.S-btn.on::after{content:'';position:absolute;left:-8px;width:3px;height:18px;background:var(--ac);border-radius:0 3px 3px 0}
.S-bdg{position:absolute;top:1px;right:1px;background:var(--rd);color:#fff;font-size:8px;font-weight:800;min-width:15px;height:15px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 3px}
.S-sp{flex:1}
.S-lbl{font-size:8px;color:var(--t4);margin-top:-2px;text-align:center;width:100%;font-weight:600}
/* Main */
.M{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
/* Topbar */
.T{height:56px;background:var(--b1);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 18px;gap:10px;flex-shrink:0}
.T-t{font-size:16px;font-weight:800;letter-spacing:-.02em}
.T-sub{font-size:10px;color:var(--t4);font-weight:500}
.T-sp{flex:1}
.T-clk{font-family:var(--fm);font-size:11px;color:var(--t3);background:var(--b2);padding:5px 10px;border-radius:var(--r1);border:1px solid var(--bd)}
.T-br{display:flex;align-items:center;gap:6px;padding:5px 12px;background:var(--b2);border:1px solid var(--bd);border-radius:var(--r1);cursor:pointer;color:var(--t2);font-size:12px;font-weight:600;transition:all .15s}
.T-br:hover{border-color:var(--ac);color:var(--ac)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--gn);flex-shrink:0}
.T-u{display:flex;align-items:center;gap:6px;padding:5px 10px;background:var(--b2);border-radius:var(--r1);border:1px solid var(--bd)}
.T-av{width:24px;height:24px;background:linear-gradient(135deg,var(--ac),#DC2626);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
/* Search */
.SB{position:relative;flex:1;max-width:320px}
.SB input{width:100%;height:36px;background:var(--b2);border:1px solid var(--bd);border-radius:var(--r1);padding:0 12px 0 34px;font-family:var(--f);font-size:12px;color:var(--t1);outline:none;transition:border .2s}
.SB input::placeholder{color:var(--t4)}
.SB input:focus{border-color:var(--ac)}
.SB-i{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--t4);pointer-events:none}
/* Layout */
.PB{flex:1;display:flex;overflow:hidden}
/* Scroll page */
.pg{flex:1;overflow-y:auto;padding:14px 18px}
.pg::-webkit-scrollbar{width:3px}
.pg::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
.pg-t{font-size:17px;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:8px;letter-spacing:-.02em}
/* Cards */
.SG{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:14px}
.SC{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:14px;display:flex;flex-direction:column;gap:5px}
.SC-ib{width:32px;height:32px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:2px}
.SC-l{font-size:11px;color:var(--t4);font-weight:500}
.SC-v{font-size:20px;font-weight:800;font-family:var(--fm)}
/* Tables */
.TBL{width:100%;border-collapse:separate;border-spacing:0}
.TBL th{text-align:left;font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.06em;padding:8px 12px;border-bottom:1px solid var(--bd);background:var(--b0);position:sticky;top:0;z-index:1}
.TBL td{padding:8px 12px;font-size:12px;border-bottom:1px solid var(--bd);vertical-align:middle}
.TBL tr:hover td{background:var(--b2)}
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600}
.b-gn{background:var(--gng);color:var(--gn)}.b-bl{background:var(--blg);color:var(--bl)}.b-yl{background:var(--ylg);color:var(--yl)}.b-pr{background:var(--prg);color:var(--pr)}.b-rd{background:var(--rdg);color:var(--rd)}.b-cn{background:var(--cng);color:var(--cn)}
/* Buttons */
.bp{width:100%;height:44px;background:linear-gradient(135deg,var(--ac),#EA580C);color:#fff;border:none;border-radius:var(--r2);font-family:var(--f);font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;box-shadow:0 4px 16px rgba(249,115,22,.3)}
.bp:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(249,115,22,.4)}.bp:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.bs{height:36px;background:var(--b2);color:var(--t1);border:1px solid var(--bd);border-radius:var(--r2);font-family:var(--f);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px;padding:0 12px}
.bs:hover{border-color:var(--t4)}
.ab{display:inline-flex;align-items:center;gap:4px;padding:7px 14px;background:var(--ac);color:#fff;border:none;border-radius:var(--r2);font-family:var(--f);font-size:11px;font-weight:700;cursor:pointer;transition:all .2s}
.ab:hover{background:var(--ac2)}
/* Modal */
.MO{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fi .2s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.ML{background:var(--b1);border:1px solid var(--bd);border-radius:var(--r4);padding:22px;width:92%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:su .3s ease}
.ML::-webkit-scrollbar{width:3px}.ML::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
@keyframes su{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.ML-t{font-size:17px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.ML-x{margin-left:auto;background:none;border:none;color:var(--t4);cursor:pointer;padding:4px;border-radius:8px}
.ML-x:hover{background:var(--b3);color:var(--t1)}
/* POS specific */
.PP{flex:1;display:flex;flex-direction:column;overflow:hidden;padding:14px 18px;gap:10px}
.PC{width:350px;background:var(--b1);border-left:1px solid var(--bd);display:flex;flex-direction:column;flex-shrink:0}
.cats{display:flex;gap:5px;overflow-x:auto;flex-shrink:0}.cats::-webkit-scrollbar{height:0}
.cat{display:flex;align-items:center;gap:4px;padding:6px 12px;border:1px solid var(--bd);background:var(--b2);color:var(--t3);border-radius:999px;cursor:pointer;font-family:var(--f);font-size:11px;font-weight:600;white-space:nowrap;transition:all .2s}
.cat:hover{border-color:var(--t4)}.cat.on{background:var(--ac);border-color:var(--ac);color:#fff}
.PGr{display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:8px;overflow-y:auto;flex:1;padding-right:4px}
.PGr::-webkit-scrollbar{width:3px}.PGr::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:3px}
.pd{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r2);padding:10px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;gap:4px;position:relative}
.pd:hover{border-color:var(--ac);background:var(--bh);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.3)}
.pd.off{opacity:.3;pointer-events:none}
.pd-e{font-size:28px;text-align:center;padding:4px 0}.pd-n{font-size:11px;font-weight:600;line-height:1.3}.pd-p{font-family:var(--fm);font-size:12px;color:var(--ac);font-weight:700}.pd-s{font-size:9px;color:var(--t4)}
.pd-q{position:absolute;top:5px;right:5px;background:var(--ac);color:#fff;font-size:10px;font-weight:800;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center}
/* Cart */
.CH{padding:12px 16px;border-bottom:1px solid var(--bd)}
.CH-r{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.CH-t{font-size:14px;font-weight:800}.CH-c{font-size:10px;color:var(--ac);background:var(--acg);padding:2px 7px;border-radius:999px;font-weight:700}
.CH-clr{background:none;border:none;color:var(--rd);font-size:10px;font-family:var(--f);font-weight:600;cursor:pointer;padding:3px 6px;border-radius:5px}.CH-clr:hover{background:var(--rdg)}
.OT{display:flex;gap:3px}
.OT-b{flex:1;padding:4px 2px;background:var(--b2);border:1px solid var(--bd);border-radius:var(--r1);color:var(--t4);font-size:8px;font-family:var(--f);font-weight:600;cursor:pointer;text-align:center;transition:all .2s}
.OT-b.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}
.OT-i{font-size:12px;display:block;margin-bottom:1px}
.CI{flex:1;overflow-y:auto;padding:8px 16px}.CI::-webkit-scrollbar{width:2px}.CI::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:2px}
.ce{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;color:var(--t4);font-size:12px}
.ci{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--bd);animation:fsi .2s ease}
@keyframes fsi{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}
.ci-i{flex:1;min-width:0}.ci-n{font-size:11px;font-weight:600;margin-bottom:1px}.ci-p{font-size:10px;color:var(--t4);font-family:var(--fm)}
.ci-st{font-size:11px;font-weight:700;color:var(--ac);font-family:var(--fm);white-space:nowrap}
.ci-ctr{display:flex;align-items:center;gap:5px;margin-top:4px}
.qb{width:24px;height:24px;border-radius:50%;border:1px solid var(--bd);background:var(--b4);color:var(--t1);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;font-size:12px}
.qb:hover{border-color:var(--ac);color:var(--ac)}.qb.dng:hover{border-color:var(--rd);color:var(--rd)}
.qv{font-size:12px;font-weight:700;font-family:var(--fm);min-width:16px;text-align:center}
.ci-note{font-size:9px;color:var(--yl);font-style:italic;margin-top:2px;padding:2px 5px;background:var(--ylg);border-radius:3px}
.CF{padding:12px 16px;border-top:1px solid var(--bd)}
.CF-t{display:flex;justify-content:space-between;font-size:16px;font-weight:800;margin:8px 0 12px;padding-top:8px;border-top:2px dashed var(--bd2)}
.CF-ta{font-family:var(--fm);color:var(--ac)}
/* Payment Modal */
.PGt{display:flex;gap:3px;margin-bottom:12px;overflow-x:auto}.PGt::-webkit-scrollbar{height:0}
.PGtb{padding:5px 10px;border:1px solid var(--bd);background:var(--b2);color:var(--t4);border-radius:999px;font-size:10px;font-weight:600;font-family:var(--f);cursor:pointer;white-space:nowrap;transition:all .15s}
.PGtb.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}
.PM{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:14px}
.PM-b{padding:8px 4px;background:var(--b2);border:2px solid var(--bd);border-radius:var(--r2);color:var(--t3);font-size:10px;font-weight:600;font-family:var(--f);cursor:pointer;text-align:center;transition:all .2s}
.PM-b:hover{border-color:var(--t4)}.PM-b.on{border-color:var(--ac);background:var(--acg);color:var(--ac)}
.PM-i{font-size:20px;display:block;margin-bottom:2px}
.PI{width:100%;height:44px;background:var(--b2);border:1px solid var(--bd);border-radius:var(--r2);padding:0 12px;font-family:var(--fm);font-size:15px;font-weight:700;color:var(--t1);outline:none;margin-bottom:8px;text-align:right}.PI:focus{border-color:var(--ac)}
.QC{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap}
.QC button{flex:1;min-width:60px;padding:6px;background:var(--b2);border:1px solid var(--bd);border-radius:var(--r1);color:var(--t3);font-family:var(--fm);font-size:10px;font-weight:600;cursor:pointer;transition:all .15s}
.QC button:hover{border-color:var(--ac);color:var(--ac)}
.chg{text-align:center;padding:12px;background:var(--gng);border-radius:var(--r2);margin-bottom:12px}
.chg-a{font-size:24px;font-weight:800;color:var(--gn);font-family:var(--fm)}
/* Receipt */
.RB{background:#FFF;color:#111;border-radius:var(--r2);padding:18px;font-size:10px;margin-bottom:12px;font-family:var(--fm)}
.RB-sn{font-size:15px;font-weight:800;font-family:var(--f)}.RB-hr{border:none;border-top:1px dashed #CCC;margin:6px 0}
.RB-row{display:flex;justify-content:space-between;padding:2px 0}.RB-tr{font-weight:700;font-size:12px}
/* Branch cards */
.br-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin-bottom:16px}
.br-card{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:16px;transition:all .2s;cursor:pointer;position:relative}
.br-card:hover{border-color:var(--ac);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.3)}
.br-card.sel{border-color:var(--ac);box-shadow:0 0 0 2px var(--acg)}
/* Charts */
.ch-box{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:16px;margin-bottom:14px}
.ch-t{font-size:13px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.bars{display:flex;align-items:flex-end;gap:5px;height:130px;padding-top:14px}
.bar-c{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
.bar{width:100%;border-radius:4px 4px 0 0;transition:height .5s ease;min-height:2px}
.bar-l{font-size:8px;color:var(--t4);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar-v{font-size:8px;color:var(--t3);font-family:var(--fm);font-weight:700}
/* Settings */
.set-sec{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:16px;margin-bottom:12px}
.set-st{font-size:13px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.set-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd);gap:10px}.set-row:last-child{border-bottom:none}
.set-lbl{font-size:12px;color:var(--t3)}
.inp{height:32px;background:var(--b3);border:1px solid var(--bd);border-radius:var(--r1);padding:0 10px;font-family:var(--f);font-size:12px;color:var(--t1);outline:none;transition:border .2s}
.inp:focus{border-color:var(--ac)}
/* CCTV */
.cctv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.cctv-card{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);overflow:hidden;transition:all .2s}
.cctv-card:hover{border-color:var(--ac);box-shadow:0 6px 20px rgba(0,0,0,.3)}
.cctv-screen{height:140px;background:var(--b0);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.cctv-noise{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.02) 2px,rgba(255,255,255,.02) 4px);animation:scanline 8s linear infinite}
@keyframes scanline{0%{transform:translateY(0)}100%{transform:translateY(100%)}}
.cctv-overlay{position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:4px}
.cctv-rec{width:8px;height:8px;border-radius:50%;animation:blink 1s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.cctv-time{position:absolute;top:8px;right:8px;font-family:var(--fm);font-size:9px;color:rgba(255,255,255,.6)}
.cctv-label{position:absolute;bottom:8px;left:8px;font-size:10px;font-weight:600;color:rgba(255,255,255,.8);text-shadow:0 1px 3px rgba(0,0,0,.8)}
.cctv-info{padding:10px 12px}
.cctv-name{font-size:12px;font-weight:700;margin-bottom:2px}
/* Employee cards */
.emp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-bottom:16px}
.emp-card{background:var(--b2);border:1px solid var(--bd);border-radius:var(--r3);padding:14px;transition:all .2s;position:relative}
.emp-card:hover{border-color:var(--ac);transform:translateY(-1px)}
/* KPI ring */
.kpi-ring{position:relative;width:48px;height:48px;flex-shrink:0}
.kpi-ring svg{transform:rotate(-90deg)}
.kpi-val{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;font-family:var(--fm)}
/* Tabs */
.tabs{display:flex;gap:3px;margin-bottom:14px;overflow-x:auto;flex-shrink:0}.tabs::-webkit-scrollbar{height:0}
.tab{padding:6px 14px;border:1px solid var(--bd);background:var(--b2);color:var(--t4);border-radius:999px;font-size:11px;font-weight:600;font-family:var(--f);cursor:pointer;white-space:nowrap;transition:all .15s}
.tab:hover{border-color:var(--t4)}.tab.on{background:var(--acg);border-color:var(--ac);color:var(--ac)}
/* Inv condition */
.cond-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:4px}
/* Dropdown */
.dd{position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--b2);border:1px solid var(--bd);border-radius:var(--r2);box-shadow:0 12px 40px rgba(0,0,0,.5);z-index:500;overflow:hidden;animation:su .2s ease}
.dd-i{padding:8px 12px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:6px;transition:background .15s;border-bottom:1px solid var(--bd)}.dd-i:last-child{border-bottom:none}.dd-i:hover{background:var(--b3)}.dd-i.on{background:var(--acg);color:var(--ac)}
/* Animation */
.pe{animation:pe .3s ease}@keyframes pe{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
/* Progress bar */
.prog{height:6px;background:var(--b4);border-radius:3px;overflow:hidden;flex:1}
.prog-fill{height:100%;border-radius:3px;transition:width .5s ease}
@media(max-width:900px){.PC{width:280px}.PGr{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))}}
@media(max-width:700px){.S{width:50px}.PC{position:fixed;right:0;top:0;bottom:0;width:100%;max-width:350px;z-index:200;box-shadow:0 0 60px rgba(0,0,0,.7)}}
`;

// ─── ICONS ─────────────────────────────────────────────────────────────────
const Ic=({d,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const IX={
  search:s=><Ic s={s} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>,
  plus:s=><Ic s={s} d="M12 5v14M5 12h14"/>,
  minus:s=><Ic s={s} d="M5 12h14"/>,
  trash:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  check:s=><Ic s={s} d="M20 6L9 17l-5-5"/>,
  x:s=><Ic s={s} d="M18 6L6 18M6 6l12 12"/>,
  chev:s=><Ic s={s} d="M6 9l6 6 6-6"/>,
  copy:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  printer:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  cam:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  user:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  users:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  clock:s=><Ic s={s} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"/>,
  bldg:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
  cart:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  chart:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  box:s=><Ic s={s} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>,
  gear:s=><Ic s={s} d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>,
  clip:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  alert:s=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// ─── KPI Ring ──────────────────────────────────────────────────────────────
const KPIRing=({value,max=100,color="var(--ac)",size=48})=>{
  const r=18,circ=2*Math.PI*r,pct=Math.min(value/max,1);
  return(<div className="kpi-ring" style={{width:size,height:size}}>
    <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="24" r={r} fill="none" stroke="var(--b4)" strokeWidth="4"/><circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s ease"}}/></svg>
    <div className="kpi-val" style={{color}}>{Math.round(value)}</div>
  </div>)
};

const ProgressBar=({value,max=100,color="var(--ac)"})=>(
  <div className="prog"><div className="prog-fill" style={{width:`${Math.min(value/max*100,100)}%`,background:color}}/></div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
const Sidebar=({pg,go,cn})=>{
  const n=[
    {id:"pos",icon:"cart",t:"Kasir"},
    {id:"history",icon:"clock",t:"Riwayat"},
    {id:"products",icon:"box",t:"Produk"},
    {id:"employees",icon:"users",t:"Karyawan"},
    {id:"cctv",icon:"cam",t:"CCTV"},
    {id:"inventory",icon:"clip",t:"Inventori"},
    {id:"branches",icon:"bldg",t:"Cabang"},
    {id:"reports",icon:"chart",t:"Laporan"},
    {id:"settings",icon:"gear",t:"Setting"},
  ];
  return(<nav className="S"><div className="S-logo">🔥</div>
    {n.map(i=><div key={i.id} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <button className={`S-btn ${pg===i.id?"on":""}`} onClick={()=>go(i.id)} title={i.t}>
        {IX[i.icon]?.(18)}{i.id==="pos"&&cn>0&&<span className="S-bdg">{cn}</span>}
      </button><div className="S-lbl">{i.t}</div>
    </div>)}
    <div className="S-sp"/>
  </nav>)
};

// ═══════════════════════════════════════════════════════════════════════════
// TOPBAR + BRANCH SWITCHER
// ═══════════════════════════════════════════════════════════════════════════
const BranchSw=({brs,cur,set})=>{
  const[o,setO]=useState(false);const ref=useRef();
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setO(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[]);
  const c=brs.find(b=>b.id===cur)||brs[0];
  return(<div ref={ref} style={{position:"relative"}}><div className="T-br" onClick={()=>setO(!o)}><span className="dot" style={{background:c.active?"var(--gn)":"var(--rd)"}}/>{c.name}{IX.chev(12)}</div>
    {o&&<div className="dd" style={{minWidth:240}}>{brs.map(b=><div key={b.id} className={`dd-i ${b.id===cur?"on":""}`} onClick={()=>{set(b.id);setO(false)}}><span className="dot" style={{background:b.active?"var(--gn)":"var(--rd)"}}/><div><div style={{fontWeight:600,fontSize:12}}>{b.name}</div><div style={{fontSize:10,color:"var(--t4)"}}>{b.city}</div></div>{b.isHQ&&<span style={{marginLeft:"auto",fontSize:8,color:"var(--ac)",fontWeight:700}}>PUSAT</span>}</div>)}</div>}
  </div>)
};

const TopBar=({pg,sr,setSr,brs,cb,setCb})=>{
  const[t,sT]=useState(new Date());useEffect(()=>{const i=setInterval(()=>sT(new Date()),1000);return()=>clearInterval(i)},[]);
  const titles={pos:"Kasir",history:"Riwayat",products:"Produk",employees:"Karyawan",cctv:"CCTV Monitor",inventory:"Kontrol Inventori",branches:"Cabang",reports:"Laporan",settings:"Pengaturan"};
  return(<header className="T"><div><div className="T-t">{titles[pg]}</div><div className="T-sub">Warmindo POS v3.0</div></div>
    {pg==="pos"&&<div className="SB"><span className="SB-i">{IX.search(14)}</span><input placeholder="Cari menu..." value={sr} onChange={e=>setSr(e.target.value)}/></div>}
    <div className="T-sp"/><BranchSw brs={brs} cur={cb} set={setCb}/>
    <div className="T-clk">{t.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
    <div className="T-u"><div className="T-av">K</div><div style={{fontSize:11,fontWeight:600}}>Kasir 1</div></div>
  </header>)
};

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT MODAL (full)
// ═══════════════════════════════════════════════════════════════════════════
const PayModal=({cart,ot,total,onClose,onDone,brN})=>{
  const[pg,sPg]=useState("cash");const[m,sM]=useState("cash");const[cash,sC]=useState("");const[step,sS]=useState("pay");const[txn,sT]=useState(null);const[timer,sTm]=useState(300);const[ew,sEw]=useState("wait");
  const cN=parseInt(cash.replace(/\D/g,""))||0;const chg=cN-total;
  const fM=PAYMENT_METHODS.filter(x=>x.group===pg);
  const qA=[...new Set([total,Math.ceil(total/5000)*5000,Math.ceil(total/10000)*10000,Math.ceil(total/50000)*50000,100000].filter(a=>a>=total))].slice(0,5);
  const va=useMemo(()=>(m==="bca"?"897":m==="bri"?"102":m==="mandiri"?"700":"451")+"0"+Math.floor(1e9+Math.random()*9e9),[m]);

  useEffect(()=>{if(step==="proc"&&(pg==="digital"||pg==="ewallet")){const t=setInterval(()=>sTm(v=>v<=1?0:v-1),1000);const s=setTimeout(()=>sEw("ok"),3000+Math.random()*2000);return()=>{clearInterval(t);clearTimeout(s)}}},[step,pg]);
  useEffect(()=>{if(ew==="ok"&&step==="proc")setTimeout(()=>{sT({id:gid(),items:[...cart],total,payment:m,payLabel:PAYMENT_METHODS.find(x=>x.id===m)?.label||m,cashPaid:total,change:0,orderType:ot,timestamp:new Date().toISOString(),branch:brN});sS("done")},600)},[ew,step]);

  const pay=()=>{
    if(pg==="cash"){if(cN<total)return;sT({id:gid(),items:[...cart],total,payment:m,payLabel:"Tunai",cashPaid:cN,change:cN-total,orderType:ot,timestamp:new Date().toISOString(),branch:brN});sS("done")}
    else if(pg==="bank"||pg==="platform"){sT({id:gid(),items:[...cart],total,payment:m,payLabel:PAYMENT_METHODS.find(x=>x.id===m)?.label||m,cashPaid:total,change:0,orderType:ot,timestamp:new Date().toISOString(),branch:brN});sS("done")}
    else sS("proc")
  };

  if(step==="proc")return(<div className="MO" onClick={onClose}><div className="ML" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
    {ew==="ok"?<div style={{textAlign:"center",padding:24}}><div style={{fontSize:56,marginBottom:8}}>✅</div><div style={{fontSize:18,fontWeight:800,color:"var(--gn)"}}>Pembayaran Berhasil!</div><div style={{fontSize:13,color:"var(--t3)",marginTop:4}}>{rp(total)}</div></div>
    :<><div className="ML-t">{pg==="digital"?"📱 Scan QRIS":`${PAYMENT_METHODS.find(x=>x.id===m)?.icon} ${PAYMENT_METHODS.find(x=>x.id===m)?.label}`}<button className="ML-x" onClick={onClose}>{IX.x(16)}</button></div>
      <div style={{textAlign:"center",padding:16,background:"var(--b2)",borderRadius:"var(--r3)",marginBottom:14,border:"1px solid var(--bd)"}}>
        <div style={{fontSize:10,color:"var(--t3)",marginBottom:4}}>QRIS — {brN}</div>
        <div style={{fontSize:26,fontWeight:900,color:"var(--ac)",fontFamily:"var(--fm)",marginBottom:12}}>{rp(total)}</div>
        <QRCode data={`QRIS-${m}-${total}-${Date.now()}`} size={200}/>
        <div style={{fontSize:10,color:"var(--t4)",marginTop:8}}>NMID: ID10240388291</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 12px",background:"var(--ylg)",color:"var(--yl)",fontSize:11,fontWeight:700,borderRadius:999,marginTop:8}}>⏱️ {Math.floor(timer/60).toString().padStart(2,"0")}:{(timer%60).toString().padStart(2,"0")}</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:10,fontSize:10,color:"var(--t4)"}}><span style={{padding:"3px 8px",background:"var(--b3)",borderRadius:5}}>🟢 GoPay</span><span style={{padding:"3px 8px",background:"var(--b3)",borderRadius:5}}>🟣 OVO</span><span style={{padding:"3px 8px",background:"var(--b3)",borderRadius:5}}>🔵 DANA</span><span style={{padding:"3px 8px",background:"var(--b3)",borderRadius:5}}>🔴 SPay</span></div>
      </div>
      <button className="bs" style={{width:"100%"}} onClick={()=>sEw("ok")}>✅ Simulasi: Tandai Lunas</button></>}
  </div></div>);

  if(step==="done"&&txn)return(<div className="MO" onClick={onClose}><div className="ML" onClick={e=>e.stopPropagation()} style={{maxWidth:380}}>
    <div className="RB"><div style={{textAlign:"center",marginBottom:10}}><div className="RB-sn">🔥 {brN}</div><div style={{fontSize:9,color:"#888"}}>{fD(txn.timestamp)} {fT(txn.timestamp)} • #{txn.id.toUpperCase().slice(0,10)}</div></div>
      <hr className="RB-hr"/><div style={{fontSize:9,color:"#666",marginBottom:2}}>{ORDER_TYPES.find(o=>o.id===txn.orderType)?.icon} {ORDER_TYPES.find(o=>o.id===txn.orderType)?.label}</div>
      {txn.items.map((i,idx)=><div key={idx}><div className="RB-row"><span>{i.name}</span><span>{rp(i.price*i.qty)}</span></div><div style={{fontSize:9,color:"#999"}}>  {i.qty}x {rp(i.price)}</div></div>)}
      <hr className="RB-hr"/><div className="RB-row RB-tr"><span>TOTAL</span><span>{rp(txn.total)}</span></div>
      <div className="RB-row"><span>Bayar ({txn.payLabel})</span><span>{rp(txn.cashPaid)}</span></div>
      {txn.change>0&&<div className="RB-row" style={{fontWeight:700}}><span>Kembali</span><span>{rp(txn.change)}</span></div>}
      <hr className="RB-hr"/><div style={{textAlign:"center",fontSize:9,color:"#888",marginTop:6}}>Terima kasih! Semoga berkah & kenyang 🤲</div>
    </div>
    <div style={{display:"flex",gap:6}}><button className="bs" style={{flex:1}} onClick={()=>window.print()}>{IX.printer(13)} Cetak</button><button className="bp" style={{flex:1}} onClick={()=>{onDone(txn);onClose()}}>{IX.check(14)} Selesai</button></div>
  </div></div>);

  return(<div className="MO" onClick={onClose}><div className="ML" onClick={e=>e.stopPropagation()}>
    <div className="ML-t">💳 Pembayaran<button className="ML-x" onClick={onClose}>{IX.x(16)}</button></div>
    <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:11,color:"var(--t4)"}}>Total</div><div style={{fontSize:28,fontWeight:900,fontFamily:"var(--fm)",color:"var(--ac)"}}>{rp(total)}</div></div>
    <div className="PGt">{PAY_GROUPS.map(g=><button key={g.id} className={`PGtb ${pg===g.id?"on":""}`} onClick={()=>{sPg(g.id);const f=PAYMENT_METHODS.find(x=>x.group===g.id);if(f)sM(f.id)}}>{g.label}</button>)}</div>
    <div className="PM">{fM.map(x=><button key={x.id} className={`PM-b ${m===x.id?"on":""}`} onClick={()=>sM(x.id)}><span className="PM-i">{x.icon}</span>{x.label}</button>)}</div>
    {pg==="cash"&&<><div style={{fontSize:11,fontWeight:600,marginBottom:5,color:"var(--t3)"}}>Uang Diterima</div>
      <input className="PI" type="text" placeholder="0" autoFocus value={cash?rp(parseInt(cash.replace(/\D/g,""))||0).replace("Rp","Rp "):""} onChange={e=>sC(e.target.value.replace(/\D/g,""))}/>
      <div className="QC">{qA.map(a=><button key={a} onClick={()=>sC(String(a))}>{rp(a)}</button>)}</div>
      {cN>=total&&<div className="chg"><div style={{fontSize:11,color:"var(--gn)"}}>Kembalian</div><div className="chg-a">{rp(chg)}</div></div>}</>}
    {pg==="bank"&&<div style={{padding:14,background:"var(--b2)",borderRadius:"var(--r3)",marginBottom:14,border:"1px solid var(--bd)"}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>🏦 Transfer ke {PAYMENT_METHODS.find(x=>x.id===m)?.label}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"var(--b3)",borderRadius:"var(--r1)",marginBottom:6}}><div><div style={{fontSize:10,color:"var(--t4)"}}>Virtual Account</div><div style={{fontFamily:"var(--fm)",fontSize:14,fontWeight:700}}>{va}</div></div><button className="bs" style={{height:28,fontSize:10}} onClick={()=>navigator.clipboard?.writeText(va)}>{IX.copy(12)} Salin</button></div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"var(--b3)",borderRadius:"var(--r1)"}}><div><div style={{fontSize:10,color:"var(--t4)"}}>Jumlah</div><div style={{fontFamily:"var(--fm)",fontSize:14,fontWeight:700,color:"var(--ac)"}}>{rp(total)}</div></div><button className="bs" style={{height:28,fontSize:10}} onClick={()=>navigator.clipboard?.writeText(String(total))}>{IX.copy(12)} Salin</button></div>
    </div>}
    {(pg==="digital"||pg==="ewallet"||pg==="platform")&&<div style={{textAlign:"center",padding:14,background:"var(--b2)",borderRadius:"var(--r2)",marginBottom:14,border:"1px solid var(--bd)"}}><div style={{fontSize:32,marginBottom:4}}>{PAYMENT_METHODS.find(x=>x.id===m)?.icon||"📱"}</div><div style={{fontSize:12,fontWeight:600}}>{PAYMENT_METHODS.find(x=>x.id===m)?.label}</div><div style={{fontSize:10,color:"var(--t4)",marginTop:4}}>{pg==="platform"?"Sudah dibayar via platform":"Tekan bayar untuk generate QR"}</div></div>}
    <button className="bp" disabled={pg==="cash"&&cN<total} onClick={pay}>{pg==="cash"&&cN<total?`Kurang ${rp(total-cN)}`:`✅ Bayar ${rp(total)}`}</button>
  </div></div>);
};

// ═══════════════════════════════════════════════════════════════════════════
// POS PAGE
// ═══════════════════════════════════════════════════════════════════════════
const POSPage=({prods,cart,setCart,ot,setOt,onPay,sr})=>{
  const[cat,sC]=useState("all");
  const fl=useMemo(()=>{let l=prods;if(cat!=="all")l=l.filter(p=>p.cat===cat);if(sr){const q=sr.toLowerCase();l=l.filter(p=>p.name.toLowerCase().includes(q))}return l},[prods,cat,sr]);
  const cm=useMemo(()=>{const m={};cart.forEach(c=>m[c.id]=c.qty);return m},[cart]);
  const add=useCallback(p=>setCart(prev=>{const e=prev.find(c=>c.id===p.id);return e?prev.map(c=>c.id===p.id?{...c,qty:c.qty+1}:c):[...prev,{...p,qty:1,note:""}]}),[]);
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);const tI=cart.reduce((s,c)=>s+c.qty,0);
  return(<div className="PB"><div className="PP">
    <div className="cats">{CATEGORIES.map(c=><button key={c.id} className={`cat ${cat===c.id?"on":""}`} onClick={()=>sC(c.id)}><span style={{fontSize:13}}>{c.icon}</span> {c.name}</button>)}</div>
    <div className="PGr">{fl.map(p=><div key={p.id} className={`pd ${p.stock<=0?"off":""}`} onClick={()=>p.stock>0&&add(p)}>
      {cm[p.id]>0&&<div className="pd-q">{cm[p.id]}</div>}
      <div className="pd-e">{p.img}</div><div className="pd-n">{p.name}</div><div className="pd-p">{rp(p.price)}</div><div className="pd-s">{p.stock<=0?"Habis":`Stok: ${p.stock}`}</div>
    </div>)}{fl.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:30,color:"var(--t4)"}}>🔍 Tidak ditemukan</div>}</div>
  </div>
  <div className="PC">
    <div className="CH"><div className="CH-r"><div style={{display:"flex",alignItems:"center",gap:5}}><span className="CH-t">Pesanan</span>{tI>0&&<span className="CH-c">{tI}</span>}</div>{cart.length>0&&<button className="CH-clr" onClick={()=>setCart([])}>🗑 Hapus</button>}</div>
      <div className="OT">{ORDER_TYPES.map(t=><button key={t.id} className={`OT-b ${ot===t.id?"on":""}`} onClick={()=>setOt(t.id)}><span className="OT-i">{t.icon}</span>{t.label}</button>)}</div></div>
    <div className="CI">{cart.length===0?<div className="ce"><div style={{fontSize:36,opacity:.3}}>🛒</div>Belum ada pesanan</div>
      :cart.map(i=><div key={i.id} className="ci"><div style={{fontSize:20}}>{i.img}</div><div className="ci-i"><div className="ci-n">{i.name}</div><div className="ci-p">{rp(i.price)}</div>
        <div className="ci-ctr"><button className="qb dng" onClick={()=>i.qty===1?setCart(p=>p.filter(c=>c.id!==i.id)):setCart(p=>p.map(c=>c.id===i.id?{...c,qty:c.qty-1}:c))}>{i.qty===1?"🗑":"−"}</button><span className="qv">{i.qty}</span><button className="qb" onClick={()=>setCart(p=>p.map(c=>c.id===i.id?{...c,qty:c.qty+1}:c))}>+</button>
          <button className="bs" style={{height:22,fontSize:9,padding:"0 6px"}} onClick={()=>{const n=prompt("Catatan:");if(n!==null)setCart(p=>p.map(c=>c.id===i.id?{...c,note:n}:c))}}>{i.note?"✏️":"+ note"}</button></div>
        {i.note&&<div className="ci-note">📝 {i.note}</div>}</div><div className="ci-st">{rp(i.price*i.qty)}</div></div>)}</div>
    {cart.length>0&&<div className="CF"><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--t3)"}}><span>Subtotal ({tI} item)</span><span style={{fontFamily:"var(--fm)",fontWeight:600}}>{rp(sub)}</span></div>
      <div className="CF-t"><span>Total</span><span className="CF-ta">{rp(sub)}</span></div><button className="bp" onClick={()=>onPay(sub)}>💳 Bayar — {rp(sub)}</button></div>}
  </div></div>)
};

// ═══════════════════════════════════════════════════════════════════════════
// EMPLOYEE PAGE
// ═══════════════════════════════════════════════════════════════════════════
const EmployeePage=({emps,setEmps,attendance,setAttendance,perf,branches,curBranch})=>{
  const[tab,sTab]=useState("roster");
  const[showAdd,setSA]=useState(false);
  const[form,sF]=useState({name:"",role:"Kasir",phone:"",branch:curBranch,salary:""});
  const brEmps=emps.filter(e=>e.branch===curBranch);
  const today=tKey();
  const todayAtt=attendance.filter(a=>a.date===today);

  const addEmp=()=>{if(!form.name)return;setEmps(p=>[...p,{id:gid(),name:form.name,role:form.role,phone:form.phone,branch:form.branch,salary:parseInt(form.salary)||0,photo:form.role==="Koki"?"👨‍🍳":form.role==="Kasir"?"👨":"👩",status:"active",joinDate:today}]);sF({name:"",role:"Kasir",phone:"",branch:curBranch,salary:""});setSA(false)};

  const clockIn=(eid)=>{const now=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});const isLate=parseInt(now.split(":")[0])>=8&&parseInt(now.split(":")[1])>5;setAttendance(p=>[...p.filter(a=>!(a.empId===eid&&a.date===today)),{empId:eid,date:today,clockIn:now,clockOut:null,status:isLate?"terlambat":"hadir",note:isLate?"Terlambat":""}])};
  const clockOut=(eid)=>{const now=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});setAttendance(p=>p.map(a=>a.empId===eid&&a.date===today?{...a,clockOut:now}:a))};
  const markIzin=(eid,st)=>setAttendance(p=>[...p.filter(a=>!(a.empId===eid&&a.date===today)),{empId:eid,date:today,clockIn:null,clockOut:null,status:st,note:st==="izin"?"Izin":"Sakit"}]);

  const hCount=todayAtt.filter(a=>a.status==="hadir").length;
  const lateCount=todayAtt.filter(a=>a.status==="terlambat").length;
  const izinCount=todayAtt.filter(a=>a.status==="izin"||a.status==="sakit").length;
  const alphaCount=brEmps.length-todayAtt.filter(a=>brEmps.some(e=>e.id===a.empId)).length;

  return(<div className="pg pe">
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
      <div className="pg-t" style={{margin:0}}>👥 Karyawan ({brEmps.length})</div>
      <button className="ab" onClick={()=>setSA(!showAdd)}>➕ Tambah Karyawan</button>
    </div>

    {showAdd&&<div style={{background:"var(--b2)",border:"1px solid var(--bd)",borderRadius:"var(--r3)",padding:14,marginBottom:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
      <div style={{flex:1,minWidth:140}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Nama</label><input className="inp" style={{width:"100%"}} placeholder="Nama Lengkap" value={form.name} onChange={e=>sF({...form,name:e.target.value})}/></div>
      <div style={{minWidth:100}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Jabatan</label><select className="inp" style={{width:"100%"}} value={form.role} onChange={e=>sF({...form,role:e.target.value})}><option>Kasir</option><option>Koki</option><option>Pelayan</option><option>Cleaning</option></select></div>
      <div style={{minWidth:120}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Telepon</label><input className="inp" style={{width:"100%"}} placeholder="08xx" value={form.phone} onChange={e=>sF({...form,phone:e.target.value})}/></div>
      <div style={{minWidth:100}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Gaji</label><input className="inp" style={{width:"100%"}} type="number" placeholder="2500000" value={form.salary} onChange={e=>sF({...form,salary:e.target.value})}/></div>
      <button className="ab" onClick={addEmp}>{IX.check(13)} Simpan</button>
    </div>}

    <div className="tabs">
      {[{id:"roster",l:"👥 Daftar Karyawan"},{id:"absensi",l:"📋 Absensi Hari Ini"},{id:"kinerja",l:"📊 KPI & Produktivitas"}].map(t=>
        <button key={t.id} className={`tab ${tab===t.id?"on":""}`} onClick={()=>sTab(t.id)}>{t.l}</button>)}
    </div>

    {/* Stats */}
    <div className="SG">
      <div className="SC"><div className="SC-ib" style={{background:"var(--gng)"}}>✅</div><div className="SC-l">Hadir</div><div className="SC-v" style={{color:"var(--gn)"}}>{hCount}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--ylg)"}}>⏰</div><div className="SC-l">Terlambat</div><div className="SC-v" style={{color:"var(--yl)"}}>{lateCount}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--blg)"}}>📋</div><div className="SC-l">Izin/Sakit</div><div className="SC-v" style={{color:"var(--bl)"}}>{izinCount}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--rdg)"}}>❌</div><div className="SC-l">Alpha</div><div className="SC-v" style={{color:"var(--rd)"}}>{alphaCount}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--acg)"}}>💰</div><div className="SC-l">Total Gaji/Bulan</div><div className="SC-v" style={{fontSize:16,color:"var(--ac)"}}>{rp(brEmps.reduce((s,e)=>s+e.salary,0))}</div></div>
    </div>

    {/* Roster Tab */}
    {tab==="roster"&&<div className="emp-grid">{brEmps.map(e=>{
      const att=todayAtt.find(a=>a.empId===e.id);const p=perf.find(x=>x.empId===e.id);
      return(<div key={e.id} className="emp-card">
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:32}}>{e.photo}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{e.name}</div><div style={{fontSize:11,color:"var(--t4)"}}>{e.role} • {e.phone}</div>
            <span className={`badge ${att?.status==="hadir"?"b-gn":att?.status==="terlambat"?"b-yl":att?.status==="izin"||att?.status==="sakit"?"b-bl":"b-rd"}`} style={{marginTop:3}}>{att?.status==="hadir"?"✅ Hadir":att?.status==="terlambat"?"⏰ Terlambat":att?.status==="izin"?"📋 Izin":att?.status==="sakit"?"🤒 Sakit":"❌ Belum Absen"}</span>
          </div>
          {p&&<KPIRing value={p.rating*20} color={p.rating>=4.5?"var(--gn)":p.rating>=3.5?"var(--yl)":"var(--rd)"} size={44}/>}
        </div>
        <div style={{display:"flex",gap:4,fontSize:10,color:"var(--t4)",marginBottom:6}}>
          <span>Gabung: {fD(e.joinDate)}</span><span>•</span><span>Gaji: {rp(e.salary)}</span>
        </div>
        {p&&<div style={{display:"flex",gap:8,fontSize:10}}>
          <div style={{flex:1}}><div style={{color:"var(--t4)",marginBottom:2}}>Order</div><div style={{display:"flex",alignItems:"center",gap:4}}><ProgressBar value={p.ordersHandled} max={400} color="var(--ac)"/><span style={{fontFamily:"var(--fm)",fontWeight:700,fontSize:10}}>{p.ordersHandled}</span></div></div>
          <div style={{flex:1}}><div style={{color:"var(--t4)",marginBottom:2}}>Kecepatan</div><div style={{display:"flex",alignItems:"center",gap:4}}><ProgressBar value={p.speed} color="var(--bl)"/><span style={{fontFamily:"var(--fm)",fontWeight:700,fontSize:10}}>{p.speed}%</span></div></div>
        </div>}
      </div>)
    })}</div>}

    {/* Absensi Tab */}
    {tab==="absensi"&&<div>
      <table className="TBL"><thead><tr><th></th><th>Nama</th><th>Jabatan</th><th>Clock In</th><th>Clock Out</th><th>Status</th><th>Aksi</th></tr></thead>
      <tbody>{brEmps.map(e=>{const att=todayAtt.find(a=>a.empId===e.id);return(
        <tr key={e.id}>
          <td style={{fontSize:20}}>{e.photo}</td>
          <td style={{fontWeight:600}}>{e.name}</td>
          <td><span className="badge b-bl">{e.role}</span></td>
          <td style={{fontFamily:"var(--fm)",fontSize:11}}>{att?.clockIn||"—"}</td>
          <td style={{fontFamily:"var(--fm)",fontSize:11}}>{att?.clockOut||"—"}</td>
          <td><span className={`badge ${att?.status==="hadir"?"b-gn":att?.status==="terlambat"?"b-yl":att?.status==="izin"?"b-bl":"b-rd"}`}>{att?.status||"belum absen"}</span></td>
          <td><div style={{display:"flex",gap:3}}>
            {!att?.clockIn&&att?.status!=="izin"&&att?.status!=="sakit"&&<button className="bs" style={{height:26,fontSize:9,padding:"0 8px"}} onClick={()=>clockIn(e.id)}>Clock In</button>}
            {att?.clockIn&&!att?.clockOut&&<button className="bs" style={{height:26,fontSize:9,padding:"0 8px"}} onClick={()=>clockOut(e.id)}>Clock Out</button>}
            {!att?.clockIn&&<button className="bs" style={{height:26,fontSize:9,padding:"0 6px",color:"var(--bl)"}} onClick={()=>markIzin(e.id,"izin")}>Izin</button>}
          </div></td>
        </tr>)})}</tbody></table>
    </div>}

    {/* KPI Tab */}
    {tab==="kinerja"&&<div>
      <table className="TBL"><thead><tr><th></th><th>Nama</th><th>Order Handled</th><th>Rating</th><th>Keluhan</th><th>Ketepatan Waktu</th><th>Kecepatan</th><th>Skor</th></tr></thead>
      <tbody>{brEmps.map(e=>{const p=perf.find(x=>x.empId===e.id);if(!p)return null;
        const score=Math.round((p.rating/5*30)+(p.punctuality/100*25)+(p.speed/100*25)+(Math.max(0,(10-p.complaints))/10*20));
        return(<tr key={e.id}>
          <td style={{fontSize:20}}>{e.photo}</td>
          <td style={{fontWeight:600}}>{e.name}<div style={{fontSize:10,color:"var(--t4)"}}>{e.role}</div></td>
          <td><div style={{display:"flex",alignItems:"center",gap:6}}><ProgressBar value={p.ordersHandled} max={400} color="var(--ac)"/><span style={{fontFamily:"var(--fm)",fontWeight:700,fontSize:11}}>{p.ordersHandled}</span></div></td>
          <td style={{fontFamily:"var(--fm)",fontWeight:700}}>⭐ {p.rating}</td>
          <td>{p.complaints===0?<span className="badge b-gn">0</span>:<span className={`badge ${p.complaints>=3?"b-rd":"b-yl"}`}>{p.complaints}</span>}</td>
          <td><div style={{display:"flex",alignItems:"center",gap:6}}><ProgressBar value={p.punctuality} color={p.punctuality>=90?"var(--gn)":"var(--yl)"}/><span style={{fontFamily:"var(--fm)",fontWeight:700,fontSize:11}}>{p.punctuality}%</span></div></td>
          <td><div style={{display:"flex",alignItems:"center",gap:6}}><ProgressBar value={p.speed} color="var(--bl)"/><span style={{fontFamily:"var(--fm)",fontWeight:700,fontSize:11}}>{p.speed}%</span></div></td>
          <td><KPIRing value={score} color={score>=80?"var(--gn)":score>=60?"var(--yl)":"var(--rd)"}/></td>
        </tr>)})}</tbody></table>
    </div>}
  </div>)
};

// ═══════════════════════════════════════════════════════════════════════════
// CCTV PAGE
// ═══════════════════════════════════════════════════════════════════════════
const CCTVPage=({cameras,curBranch,branches})=>{
  const[time,sT]=useState(new Date());useEffect(()=>{const i=setInterval(()=>sT(new Date()),1000);return()=>clearInterval(i)},[]);
  const brCams=cameras.filter(c=>c.branch===curBranch);
  const brName=branches.find(b=>b.id===curBranch)?.name||"";

  const patterns=[
    "radial-gradient(circle at 30% 40%, rgba(249,115,22,.08) 0%, transparent 60%)",
    "radial-gradient(circle at 70% 30%, rgba(34,197,94,.06) 0%, transparent 50%)",
    "radial-gradient(circle at 50% 60%, rgba(59,130,246,.06) 0%, transparent 55%)",
    "radial-gradient(circle at 20% 70%, rgba(139,92,246,.06) 0%, transparent 50%)",
  ];

  return(<div className="pg pe">
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <div className="pg-t" style={{margin:0}}>📹 CCTV Monitor — {brName}</div>
      <div style={{display:"flex",gap:8,fontSize:11}}>
        <span className="badge b-gn">🟢 Online: {brCams.filter(c=>c.status==="online"||c.status==="recording").length}</span>
        <span className="badge b-rd">🔴 Offline: {brCams.filter(c=>c.status==="offline").length}</span>
      </div>
    </div>

    <div className="SG" style={{marginBottom:14}}>
      <div className="SC"><div className="SC-ib" style={{background:"var(--gng)"}}>📹</div><div className="SC-l">Total Kamera</div><div className="SC-v">{cameras.length}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--gng)"}}>🟢</div><div className="SC-l">Online</div><div className="SC-v" style={{color:"var(--gn)"}}>{cameras.filter(c=>c.status!=="offline").length}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--rdg)"}}>🔴</div><div className="SC-l">Offline</div><div className="SC-v" style={{color:"var(--rd)"}}>{cameras.filter(c=>c.status==="offline").length}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--prg)"}}>🔴</div><div className="SC-l">Recording</div><div className="SC-v" style={{color:"var(--pr)"}}>{cameras.filter(c=>c.status==="recording").length}</div></div>
    </div>

    <div className="cctv-grid">
      {brCams.map((cam,i)=>(
        <div key={cam.id} className="cctv-card">
          <div className="cctv-screen" style={{background:`var(--b0)`,backgroundImage:patterns[i%patterns.length]}}>
            <div className="cctv-noise"/>
            <div className="cctv-overlay">
              <div className="cctv-rec" style={{background:cam.status==="offline"?"var(--rd)":cam.status==="recording"?"var(--rd)":"var(--gn)"}}/>
              <span style={{fontSize:9,color:"rgba(255,255,255,.7)",fontWeight:700}}>{cam.status==="offline"?"OFFLINE":cam.status==="recording"?"● REC":"LIVE"}</span>
            </div>
            <div className="cctv-time">{time.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
            <div className="cctv-label">{cam.name}</div>
            {cam.status!=="offline"&&<div style={{position:"absolute",bottom:8,right:8,fontSize:22,opacity:.3}}>
              {cam.location.includes("Kasir")?"🪑":cam.location.includes("Masak")?"🍳":cam.location.includes("Pelanggan")?"👥":"📦"}
            </div>}
          </div>
          <div className="cctv-info">
            <div className="cctv-name">{cam.name}</div>
            <div style={{fontSize:10,color:"var(--t4)",marginBottom:4}}>{cam.location} • IP: {cam.ip}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:10,color:"var(--t4)"}}>Gerakan: {cam.lastMotion}</span>
              <span className={`badge ${cam.status==="online"?"b-gn":cam.status==="recording"?"b-pr":"b-rd"}`}>{cam.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {brCams.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--t4)"}}><div style={{fontSize:48,marginBottom:8}}>📹</div>Tidak ada kamera di cabang ini</div>}

    <div className="ch-box" style={{marginTop:14}}>
      <div className="ch-t">⚠️ Log Aktivitas CCTV</div>
      <div style={{fontSize:11,color:"var(--t3)",lineHeight:1.8}}>
        <div style={{padding:"6px 0",borderBottom:"1px solid var(--bd)"}}><span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--t4)"}}>08:12</span> — <span className="badge b-yl">⚠️</span> Gerakan terdeteksi di <b>Pintu Belakang</b> di luar jam operasional</div>
        <div style={{padding:"6px 0",borderBottom:"1px solid var(--bd)"}}><span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--t4)"}}>07:45</span> — <span className="badge b-gn">✅</span> Semua kamera {brName} online</div>
        <div style={{padding:"6px 0",borderBottom:"1px solid var(--bd)"}}><span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--t4)"}}>06:30</span> — <span className="badge b-bl">📹</span> Recording dimulai untuk <b>Dapur</b></div>
        <div style={{padding:"6px 0"}}><span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--t4)"}}>00:00</span> — <span className="badge b-pr">💾</span> Backup rekaman harian selesai (24.3 GB)</div>
      </div>
    </div>
  </div>)
};

// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY PAGE
// ═══════════════════════════════════════════════════════════════════════════
const InventoryPage=({inventory,setInventory})=>{
  const[cat,sCat]=useState("all");
  const[showAdd,sSA]=useState(false);
  const[form,sF]=useState({name:"",cat:"makan",qty:"",minQty:"",unit:"pcs",price:""});

  const fl=cat==="all"?inventory:inventory.filter(i=>i.cat===cat);
  const lowStock=inventory.filter(i=>i.qty<=i.minQty);
  const totalValue=inventory.reduce((s,i)=>s+i.qty*i.price,0);
  const totalItems=inventory.reduce((s,i)=>s+i.qty,0);

  const addItem=()=>{if(!form.name)return;setInventory(p=>[...p,{id:gid(),name:form.name,cat:form.cat,qty:parseInt(form.qty)||0,minQty:parseInt(form.minQty)||5,unit:form.unit,price:parseInt(form.price)||0,condition:"baik",lastCheck:tKey()}]);sF({name:"",cat:"makan",qty:"",minQty:"",unit:"pcs",price:""});sSA(false)};
  const updQty=(id,v)=>setInventory(p=>p.map(i=>i.id===id?{...i,qty:Math.max(0,parseInt(v)||0),lastCheck:tKey()}:i));
  const updCond=(id,v)=>setInventory(p=>p.map(i=>i.id===id?{...i,condition:v}:i));

  return(<div className="pg pe">
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
      <div className="pg-t" style={{margin:0}}>📦 Kontrol Inventori ({inventory.length} item)</div>
      <button className="ab" onClick={()=>sSA(!showAdd)}>➕ Tambah Item</button>
    </div>

    {showAdd&&<div style={{background:"var(--b2)",border:"1px solid var(--bd)",borderRadius:"var(--r3)",padding:14,marginBottom:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
      <div style={{flex:1,minWidth:140}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Nama</label><input className="inp" style={{width:"100%"}} placeholder="Piring Melamin" value={form.name} onChange={e=>sF({...form,name:e.target.value})}/></div>
      <div style={{minWidth:100}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Kategori</label><select className="inp" style={{width:"100%"}} value={form.cat} onChange={e=>sF({...form,cat:e.target.value})}>{INV_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
      <div style={{minWidth:70}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Jumlah</label><input className="inp" style={{width:"100%"}} type="number" value={form.qty} onChange={e=>sF({...form,qty:e.target.value})}/></div>
      <div style={{minWidth:60}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Min</label><input className="inp" style={{width:"100%"}} type="number" value={form.minQty} onChange={e=>sF({...form,minQty:e.target.value})}/></div>
      <div style={{minWidth:60}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Satuan</label><input className="inp" style={{width:"100%"}} value={form.unit} onChange={e=>sF({...form,unit:e.target.value})}/></div>
      <div style={{minWidth:80}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Harga</label><input className="inp" style={{width:"100%"}} type="number" value={form.price} onChange={e=>sF({...form,price:e.target.value})}/></div>
      <button className="ab" onClick={addItem}>{IX.check(13)} Simpan</button>
    </div>}

    <div className="SG">
      <div className="SC"><div className="SC-ib" style={{background:"var(--acg)"}}>📦</div><div className="SC-l">Total Item</div><div className="SC-v">{totalItems.toLocaleString()}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--gng)"}}>💰</div><div className="SC-l">Nilai Aset</div><div className="SC-v" style={{fontSize:16,color:"var(--gn)"}}>{rp(totalValue)}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:lowStock.length>0?"var(--rdg)":"var(--gng)"}}>{lowStock.length>0?"⚠️":"✅"}</div><div className="SC-l">Stok Rendah</div><div className="SC-v" style={{color:lowStock.length>0?"var(--rd)":"var(--gn)"}}>{lowStock.length}</div></div>
      <div className="SC"><div className="SC-ib" style={{background:"var(--ylg)"}}>🔧</div><div className="SC-l">Perlu Ganti</div><div className="SC-v" style={{color:"var(--yl)"}}>{inventory.filter(i=>i.condition==="aus"||i.condition==="rusak").length}</div></div>
    </div>

    {lowStock.length>0&&<div style={{background:"var(--rdg)",border:"1px solid rgba(239,68,68,.2)",borderRadius:"var(--r3)",padding:12,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
      {IX.alert(18)}<div style={{fontSize:12,color:"var(--rd)"}}><b>⚠️ Stok Rendah!</b> {lowStock.map(i=>i.name).join(", ")} sudah di bawah batas minimum.</div>
    </div>}

    <div className="tabs">
      <button className={`tab ${cat==="all"?"on":""}`} onClick={()=>sCat("all")}>📦 Semua</button>
      {INV_CATEGORIES.map(c=><button key={c.id} className={`tab ${cat===c.id?"on":""}`} onClick={()=>sCat(c.id)}>{c.icon} {c.name}</button>)}
    </div>

    <table className="TBL"><thead><tr><th>Item</th><th>Kategori</th><th>Stok</th><th>Min</th><th>Satuan</th><th>Harga</th><th>Kondisi</th><th>Cek Terakhir</th></tr></thead>
    <tbody>{fl.map(i=>(
      <tr key={i.id} style={{background:i.qty<=i.minQty?"rgba(239,68,68,.04)":"transparent"}}>
        <td style={{fontWeight:600}}>{i.name}</td>
        <td><span className="badge b-bl">{INV_CATEGORIES.find(c=>c.id===i.cat)?.icon} {INV_CATEGORIES.find(c=>c.id===i.cat)?.name}</span></td>
        <td><input className="inp" type="number" value={i.qty} onChange={e=>updQty(i.id,e.target.value)} style={{width:60,height:28,textAlign:"center",fontFamily:"var(--fm)",fontSize:12,fontWeight:700,color:i.qty<=i.minQty?"var(--rd)":"var(--t1)"}}/></td>
        <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--t4)"}}>{i.minQty}</td>
        <td style={{fontSize:11,color:"var(--t3)"}}>{i.unit}</td>
        <td style={{fontFamily:"var(--fm)",fontSize:11}}>{rp(i.price)}</td>
        <td><select className="inp" value={i.condition} onChange={e=>updCond(i.id,e.target.value)} style={{width:80,height:28,fontSize:10,color:i.condition==="baik"?"var(--gn)":i.condition==="aus"?"var(--yl)":"var(--rd)"}}><option value="baik">✅ Baik</option><option value="aus">⚠️ Aus</option><option value="rusak">❌ Rusak</option></select></td>
        <td style={{fontSize:10,color:"var(--t4)"}}>{fD(i.lastCheck)}</td>
      </tr>))}</tbody></table>
  </div>)
};

// ═══════════════════════════════════════════════════════════════════════════
// OTHER PAGES (History, Products, Branches, Reports, Settings)
// ═══════════════════════════════════════════════════════════════════════════
const HistoryPage=({txns,cb,brs})=>{
  const brN=brs.find(b=>b.id===cb)?.name||"";const brT=txns.filter(t=>t.branch===brN);const s=[...brT].sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
  const tT=s.filter(t=>t.timestamp.startsWith(tKey()));const tR=tT.reduce((s,t)=>s+t.total,0);
  return(<div className="pg pe"><div className="SG">
    <div className="SC"><div className="SC-ib" style={{background:"var(--acg)"}}>🧾</div><div className="SC-l">Transaksi Hari Ini</div><div className="SC-v">{tT.length}</div></div>
    <div className="SC"><div className="SC-ib" style={{background:"var(--gng)"}}>💰</div><div className="SC-l">Pendapatan</div><div className="SC-v" style={{color:"var(--gn)"}}>{rp(tR)}</div></div>
    <div className="SC"><div className="SC-ib" style={{background:"var(--blg)"}}>📊</div><div className="SC-l">Avg / Txn</div><div className="SC-v">{tT.length?rp(Math.round(tR/tT.length)):"Rp0"}</div></div>
  </div>
  {s.length===0?<div style={{textAlign:"center",padding:40,color:"var(--t4)"}}>📋 Belum ada transaksi</div>:
  <table className="TBL"><thead><tr><th>ID</th><th>Waktu</th><th>Item</th><th>Tipe</th><th>Bayar</th><th style={{textAlign:"right"}}>Total</th></tr></thead><tbody>{s.map(t=><tr key={t.id}><td style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--t4)"}}>#{t.id.slice(0,8).toUpperCase()}</td><td><div style={{fontSize:11}}>{fD(t.timestamp)}</div><div style={{fontSize:9,color:"var(--t4)"}}>{fT(t.timestamp)}</div></td><td style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.items.map(i=>`${i.name}x${i.qty}`).join(", ")}</td><td><span className="badge b-bl">{ORDER_TYPES.find(o=>o.id===t.orderType)?.icon} {ORDER_TYPES.find(o=>o.id===t.orderType)?.label}</span></td><td><span className="badge b-gn">{t.payLabel||"Tunai"}</span></td><td style={{textAlign:"right",fontFamily:"var(--fm)",fontWeight:700}}>{rp(t.total)}</td></tr>)}</tbody></table>}
  </div>)
};

const ProductsPage=({prods,setProds})=>{
  const[sf,sSf]=useState(false);const[f,sF]=useState({name:"",price:"",cat:"indomie",stock:"",img:"🍜"});
  const add=()=>{if(!f.name||!f.price)return;setProds(p=>[...p,{id:Date.now(),name:f.name,price:parseInt(f.price),cat:f.cat,stock:parseInt(f.stock)||0,img:f.img}]);sF({name:"",price:"",cat:"indomie",stock:"",img:"🍜"});sSf(false)};
  return(<div className="pg pe"><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div className="pg-t" style={{margin:0}}>📦 Produk ({prods.length})</div><button className="ab" onClick={()=>sSf(!sf)}>➕ Tambah</button></div>
    {sf&&<div style={{background:"var(--b2)",border:"1px solid var(--bd)",borderRadius:"var(--r3)",padding:14,marginBottom:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
      <div><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Emoji</label><input className="inp" style={{width:50,fontSize:16}} value={f.img} onChange={e=>sF({...f,img:e.target.value})}/></div>
      <div style={{flex:1,minWidth:130}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Nama</label><input className="inp" style={{width:"100%"}} value={f.name} onChange={e=>sF({...f,name:e.target.value})}/></div>
      <div style={{minWidth:90}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Harga</label><input className="inp" style={{width:"100%"}} type="number" value={f.price} onChange={e=>sF({...f,price:e.target.value})}/></div>
      <div style={{minWidth:90}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Kategori</label><select className="inp" style={{width:"100%"}} value={f.cat} onChange={e=>sF({...f,cat:e.target.value})}>{CATEGORIES.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div style={{minWidth:60}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Stok</label><input className="inp" style={{width:"100%"}} type="number" value={f.stock} onChange={e=>sF({...f,stock:e.target.value})}/></div>
      <button className="ab" onClick={add}>{IX.check(13)} Simpan</button></div>}
    <table className="TBL"><thead><tr><th></th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th></th></tr></thead><tbody>{prods.map(p=><tr key={p.id}><td style={{fontSize:20}}>{p.img}</td><td style={{fontWeight:600}}>{p.name}</td><td><span className="badge b-bl">{CATEGORIES.find(c=>c.id===p.cat)?.name}</span></td><td style={{fontFamily:"var(--fm)"}}>{rp(p.price)}</td><td><input className="inp" type="number" value={p.stock} onChange={e=>setProds(pr=>pr.map(x=>x.id===p.id?{...x,stock:Math.max(0,parseInt(e.target.value)||0)}:x))} style={{width:60,height:28,textAlign:"center",fontFamily:"var(--fm)",color:p.stock<=5?"var(--rd)":"var(--t1)"}}/></td><td><button style={{background:"none",border:"none",color:"var(--rd)",cursor:"pointer"}} onClick={()=>confirm("Hapus?")&&setProds(pr=>pr.filter(x=>x.id!==p.id))}>{IX.trash(14)}</button></td></tr>)}</tbody></table>
  </div>)
};

const BranchesPage=({brs,setBrs,cb,setCb,txns})=>{
  const[sf,sSf]=useState(false);const[f,sF]=useState({name:"",address:"",city:"",phone:""});
  const add=()=>{if(!f.name)return;setBrs(p=>[...p,{id:gid(),name:f.name,address:f.address,city:f.city,phone:f.phone,isHQ:false,active:true}]);sF({name:"",address:"",city:"",phone:""});sSf(false)};
  const gR=n=>txns.filter(t=>t.branch===n&&t.timestamp.startsWith(tKey())).reduce((s,t)=>s+t.total,0);
  return(<div className="pg pe"><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div className="pg-t" style={{margin:0}}>🏪 Cabang ({brs.length})</div><button className="ab" onClick={()=>sSf(!sf)}>➕ Tambah Cabang</button></div>
    {sf&&<div style={{background:"var(--b2)",border:"1px solid var(--bd)",borderRadius:"var(--r3)",padding:14,marginBottom:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
      <div style={{flex:1,minWidth:140}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Nama</label><input className="inp" style={{width:"100%"}} value={f.name} onChange={e=>sF({...f,name:e.target.value})}/></div>
      <div style={{flex:1,minWidth:140}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Alamat</label><input className="inp" style={{width:"100%"}} value={f.address} onChange={e=>sF({...f,address:e.target.value})}/></div>
      <div style={{minWidth:100}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Kota</label><input className="inp" style={{width:"100%"}} value={f.city} onChange={e=>sF({...f,city:e.target.value})}/></div>
      <div style={{minWidth:100}}><label style={{fontSize:10,color:"var(--t4)",display:"block",marginBottom:2}}>Telp</label><input className="inp" style={{width:"100%"}} value={f.phone} onChange={e=>sF({...f,phone:e.target.value})}/></div>
      <button className="ab" onClick={add}>{IX.check(13)} Simpan</button></div>}
    <div className="br-grid">{brs.map(b=><div key={b.id} className={`br-card ${cb===b.id?"sel":""}`} onClick={()=>setCb(b.id)}>
      {b.isHQ&&<div style={{position:"absolute",top:8,right:8,background:"var(--acg)",color:"var(--ac)",fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:999}}>⭐ PUSAT</div>}
      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><span className="dot" style={{background:b.active?"var(--gn)":"var(--rd)"}}/><div style={{fontSize:14,fontWeight:700}}>{b.name}</div></div>
      <div style={{fontSize:11,color:"var(--t4)",marginBottom:6}}>{b.address}, {b.city}</div>
      <div style={{display:"flex",gap:8,fontSize:10,color:"var(--t3)"}}><span>Revenue: <b style={{color:"var(--t1)",fontFamily:"var(--fm)"}}>{rp(gR(b.name))}</b></span></div>
      <div style={{display:"flex",gap:4,marginTop:8}}><button className="bs" style={{flex:1,height:28,fontSize:10}} onClick={e=>{e.stopPropagation();setBrs(p=>p.map(x=>x.id===b.id?{...x,active:!x.active}:x))}}>{b.active?"🔴 Nonaktif":"🟢 Aktifkan"}</button>
      {!b.isHQ&&<button className="bs" style={{height:28,width:32,padding:0,color:"var(--rd)"}} onClick={e=>{e.stopPropagation();confirm("Hapus?")&&setBrs(p=>p.filter(x=>x.id!==b.id))}}>{IX.trash(12)}</button>}</div>
    </div>)}</div>
  </div>)
};

const ReportsPage=({txns,brs,cb})=>{
  const brN=brs.find(b=>b.id===cb)?.name||"";const today=tKey();
  const bT=txns.filter(t=>t.branch===brN&&t.timestamp.startsWith(today));const tR=bT.reduce((s,t)=>s+t.total,0);
  const aR=txns.filter(t=>t.timestamp.startsWith(today)).reduce((s,t)=>s+t.total,0);
  const catBD={};bT.forEach(t=>t.items.forEach(i=>{const cn=CATEGORIES.find(c=>c.id===i.cat)?.name||"?";catBD[cn]=(catBD[cn]||0)+i.price*i.qty}));
  const catE=Object.entries(catBD).sort((a,b)=>b[1]-a[1]);const maxC=Math.max(...catE.map(e=>e[1]),1);
  const iS={};bT.forEach(t=>t.items.forEach(i=>{iS[i.name]=(iS[i.name]||0)+i.qty}));
  const best=Object.entries(iS).sort((a,b)=>b[1]-a[1]).slice(0,8);const maxB=Math.max(...best.map(e=>e[1]),1);
  const pBD={};bT.forEach(t=>{const l=t.payLabel||"Tunai";pBD[l]=(pBD[l]||0)+t.total});
  return(<div className="pg pe">
    <div className="SG"><div className="SC"><div className="SC-ib" style={{background:"var(--acg)"}}>🧾</div><div className="SC-l">Transaksi</div><div className="SC-v">{bT.length}</div></div>
    <div className="SC"><div className="SC-ib" style={{background:"var(--gng)"}}>💰</div><div className="SC-l">Revenue Cabang</div><div className="SC-v" style={{color:"var(--gn)"}}>{rp(tR)}</div></div>
    <div className="SC"><div className="SC-ib" style={{background:"var(--blg)"}}>🌍</div><div className="SC-l">Revenue Global</div><div className="SC-v" style={{color:"var(--bl)"}}>{rp(aR)}</div></div>
    <div className="SC"><div className="SC-ib" style={{background:"var(--prg)"}}>📊</div><div className="SC-l">Avg Ticket</div><div className="SC-v">{bT.length?rp(Math.round(tR/bT.length)):"Rp0"}</div></div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div className="ch-box"><div className="ch-t">🏆 Terlaris</div>{best.length===0?<div style={{textAlign:"center",padding:20,color:"var(--t4)"}}>—</div>:<div className="bars">{best.map(([n,q])=><div key={n} className="bar-c"><div className="bar-v">{q}</div><div className="bar" style={{height:`${(q/maxB)*100}px`,background:"linear-gradient(180deg,var(--ac),#DC2626)"}}/><div className="bar-l">{n.length>10?n.slice(0,10)+"…":n}</div></div>)}</div>}</div>
      <div className="ch-box"><div className="ch-t">📂 Per Kategori</div>{catE.length===0?<div style={{textAlign:"center",padding:20,color:"var(--t4)"}}>—</div>:<div className="bars">{catE.map(([n,t])=><div key={n} className="bar-c"><div className="bar-v">{rp(t)}</div><div className="bar" style={{height:`${(t/maxC)*100}px`,background:"linear-gradient(180deg,#2A9D8F,#264653)"}}/><div className="bar-l">{n}</div></div>)}</div>}</div>
      <div className="ch-box" style={{gridColumn:"1/-1"}}><div className="ch-t">💳 Metode Pembayaran</div>{Object.keys(pBD).length===0?<div style={{textAlign:"center",padding:20,color:"var(--t4)"}}>—</div>:<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{Object.entries(pBD).map(([m,a])=><div key={m} style={{flex:1,minWidth:120,background:"var(--b3)",borderRadius:"var(--r2)",padding:12,textAlign:"center"}}><div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{m}</div><div style={{fontSize:16,fontWeight:800,fontFamily:"var(--fm)",color:"var(--ac)"}}>{rp(a)}</div><div style={{fontSize:9,color:"var(--t4)",marginTop:2}}>{tR>0?Math.round(a/tR*100):0}%</div></div>)}</div>}</div>
    </div>
  </div>)
};

const SettingsPage=({shopName,setShopName,brs,cb})=>{
  const[tmp,sT]=useState(shopName);const cur=brs.find(b=>b.id===cb);
  return(<div className="pg pe">
    <div className="set-sec"><div className="set-st">🏪 Usaha</div><div className="set-row"><span className="set-lbl">Nama Brand</span><div style={{display:"flex",gap:5}}><input className="inp" style={{width:180}} value={tmp} onChange={e=>sT(e.target.value)}/><button className="ab" style={{height:32}} onClick={()=>setShopName(tmp)}>Simpan</button></div></div><div className="set-row"><span className="set-lbl">Cabang Aktif</span><span style={{fontSize:12,fontWeight:600}}>{cur?.name}</span></div></div>
    <div className="set-sec"><div className="set-st">💳 Pembayaran</div><div className="set-row"><span className="set-lbl">NMID (QRIS)</span><input className="inp" style={{width:180}} defaultValue="ID10240388291"/></div><div className="set-row"><span className="set-lbl">BCA</span><input className="inp" style={{width:180}} defaultValue="897-0123456789"/></div><div className="set-row"><span className="set-lbl">BRI</span><input className="inp" style={{width:180}} defaultValue="102-0312345678"/></div><div className="set-row"><span className="set-lbl">BSI</span><input className="inp" style={{width:180}} defaultValue="451-0098765432"/></div></div>
    <div className="set-sec"><div className="set-st">🖨️ Struk</div><div className="set-row"><span className="set-lbl">Pesan Struk</span><input className="inp" style={{width:240}} defaultValue="Terima kasih! Semoga berkah 🤲"/></div></div>
    <div className="set-sec" style={{background:"var(--acg)",border:"1px solid var(--ac)"}}><div className="set-st" style={{color:"var(--ac)"}}>🔥 Warmindo POS v3.0 Enterprise</div><div style={{fontSize:11,color:"var(--t3)",lineHeight:1.7}}>Multi-Cabang • QRIS • 12 Metode Pembayaran • Manajemen Karyawan<br/>Absensi • KPI & Produktivitas • CCTV Monitoring • Kontrol Inventori<br/>GoFood • GrabFood • ShopeeFood Ready<br/><br/>Built with ❤️ untuk UMKM Indonesia</div></div>
  </div>)
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function WarmindoPOS(){
  const[pg,sPg]=useState("pos");
  const[prods,sProds]=useLS("w3_prods",PRODUCTS);
  const[txns,sTxns]=useOrders("w3_txns",[]);
  const[brs,sBrs]=useLS("w3_brs",BRANCHES);
  const[cb,sCb]=useLS("w3_cb","hq");
  const[emps,sEmps]=useLS("w3_emps",INIT_EMPLOYEES);
  const[att,sAtt]=useLS("w3_att",INIT_ATTENDANCE);
  const[perf]=useLS("w3_perf",INIT_PERF);
  const[inv,sInv]=useLS("w3_inv",INIT_INVENTORY);
  const[cctv]=useLS("w3_cctv",INIT_CCTV);
  const[cart,sCart]=useState([]);
  const[ot,sOt]=useState("dine_in");
  const[sr,sSr]=useState("");
  const[payOpen,sPO]=useState(false);
  const[payTot,sPT]=useState(0);
  const[shop,sShop]=useLS("w3_shop","Warmindo Djaya Rasa");

  const brN=brs.find(b=>b.id===cb)?.name||"Warmindo Pusat";
  const onPay=t=>{sPT(t);sPO(true)};
  const done=txn=>{sTxns(p=>[...p,txn]);if(window.WDB)window.WDB.saveOrder(txn);sProds(p=>p.map(pr=>{const ci=cart.find(c=>c.id===pr.id);return ci?{...pr,stock:Math.max(0,pr.stock-ci.qty)}:pr}));sCart([]);sOt("dine_in")};
  const cn=cart.reduce((s,c)=>s+c.qty,0);

  return(<><style>{CSS}</style><div className="W">
    <Sidebar pg={pg} go={sPg} cn={cn}/>
    <div className="M">
      <TopBar pg={pg} sr={sr} setSr={sSr} brs={brs} cb={cb} setCb={sCb}/>
      {pg==="pos"&&<POSPage prods={prods} cart={cart} setCart={sCart} ot={ot} setOt={sOt} onPay={onPay} sr={sr}/>}
      {pg==="history"&&<HistoryPage txns={txns} cb={cb} brs={brs}/>}
      {pg==="products"&&<ProductsPage prods={prods} setProds={sProds}/>}
      {pg==="employees"&&<EmployeePage emps={emps} setEmps={sEmps} attendance={att} setAttendance={sAtt} perf={perf} branches={brs} curBranch={cb}/>}
      {pg==="cctv"&&<CCTVPage cameras={cctv} curBranch={cb} branches={brs}/>}
      {pg==="inventory"&&<InventoryPage inventory={inv} setInventory={sInv}/>}
      {pg==="branches"&&<BranchesPage brs={brs} setBrs={sBrs} cb={cb} setCb={sCb} txns={txns}/>}
      {pg==="reports"&&<ReportsPage txns={txns} brs={brs} cb={cb}/>}
      {pg==="settings"&&<SettingsPage shopName={shop} setShopName={sShop} brs={brs} cb={cb}/>}
    </div>
    {payOpen&&<PayModal cart={cart} ot={ot} total={payTot} onClose={()=>sPO(false)} onDone={done} brN={brN}/>}
  </div></>)
}
