window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邮资助手</title>
    
    <link rel="apple-touch-icon" href="china_post_logo.png">
    <link rel="icon" href="china_post_logo.png">

    <style>
        :root { --primary: #1e7e34; --bg: #f8f9fa; }
        body { font-family: -apple-system, sans-serif; background: var(--bg); display: flex; justify-content: center; padding: 20px; margin: 0; }
        .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 450px; }
        h3 { text-align: center; color: var(--primary); margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 22px; }
        .row { margin-bottom: 15px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; color: #666; }
        select, input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 16px; background-color: #fff; }
        .result-box { background: #e9f7ef; padding: 15px; border-radius: 8px; display: none; margin-top: 15px; border-left: 5px solid var(--primary); }
        .res-item { display: flex; justify-content: space-between; margin: 8px 0; border-bottom: 1px dashed #ccc; padding-bottom: 4px; }
        .val { font-weight: bold; color: #333; }
        .highlight { color: #d35400; font-size: 1.2em; }
        .tip { font-size: 12px; color: #888; margin-top: 10px; line-height: 1.5; }
        .warning { color: #d35400; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>

<div class="card">
    <h3>邮资助手</h3>

    <div class="row">
        <label>寄出省份:</label>
        <select id="fromProv" onchange="calc()"></select>
    </div>
    <div class="row">
        <label>寄达省份:</label>
        <select id="toProv" onchange="calc()"></select>
    </div>
    <div class="row">
        <label>包裹实际重量 (克):</label>
        <input type="number" id="weight" placeholder="请输入重量..." oninput="calc()">
    </div>
    
    <div class="row">
        <label>包裹尺寸 (长×宽×高 cm):</label>
        <div class="grid-3">
            <input type="number" id="len" placeholder="长" oninput="calc()">
            <input type="number" id="width" placeholder="宽" oninput="calc()">
            <input type="number" id="height" placeholder="高" oninput="calc()">
        </div>
    </div>

    <div id="result" class="result-box">
        <div id="volWarning" class="warning" style="display:none;">⚠️ 单边超50cm，已启用计泡逻辑</div>
        <div class="res-item"><span>计费重量:</span> <span id="resBillWeight" class="val">-</span></div>
        <div class="res-item"><span>资费档位:</span> <span id="resZone" class="val">-</span></div>
        <div class="res-item"><span>预估邮费:</span> <span class="val">¥ <span id="resFee">0</span></span></div>
        <div style="margin: 10px 0; border-top: 1px solid #ddd; padding-top: 10px;">
            <div class="res-item"><span>3元邮票:</span> <span id="resS3" class="highlight">0</span> 张</div>
            <div class="res-item"><span>5.4元邮票:</span> <span id="resS54" class="highlight">0</span> 张</div>
        </div>
        <div class="res-item"><span>总成本:</span> <span id="resCost" class="val" style="color:var(--primary)">¥ 0</span></div>
        <div class="res-item" style="color:#c0392b"><span>保价金额:</span> <span>¥ <span id="resIns" class="val" style="color:#c0392b">0</span></span></div>
    </div>
    <div class="tip">
        1. 计泡：单边 > 50cm 且体积重 > 实际重时按体积重计。<br>
        2. 体积重量（kg）= 长×宽×高 ÷ 6000。<br>
        3. 规则：首重 1kg 起计，计费重量不满 1kg 按 1kg 计。
    </div>
</div>

<script>
const provincesOrder = ["北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江","上海","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"];

const fullData = {
    "安徽": {2:["河南","湖北","江苏","江西","山东","上海","浙江"], 3:["福建","河北","湖南","山西","陕西","天津"], 4:["北京","重庆","甘肃","广东","广西","贵州","海南","吉林","辽宁","内蒙古","宁夏","青海","四川"], 5:["黑龙江","云南"], 6:["西藏","新疆"]},
    "北京": {2:["河北","内蒙古","山东","天津"], 3:["河南","吉林","江苏","辽宁","山西"], 4:["安徽","重庆","福建","甘肃","黑龙江","湖北","湖南","江西","宁夏","青海","陕西","上海","四川","浙江"], 5:["广东","广西","贵州","海南","云南"], 6:["西藏","新疆"]},
    "重庆": {2:["贵州","湖北","湖南","陕西","四川"], 3:["广西","云南"], 4:["安徽","北京","福建","甘肃","广东","海南","河北","河南","江苏","江西","内蒙古","宁夏","青海","山东","山西","上海","天津","浙江"], 5:["黑龙江","吉林","辽宁","西藏"], 6:["新疆"]},
    "福建": {2:["广东","江西","浙江"], 3:["安徽","湖北","湖南","江苏","上海"], 4:["北京","重庆","广西","贵州","海南","河北","河南","山东","山西","陕西","四川","天津"], 5:["甘肃","黑龙江","吉林","辽宁","内蒙古","宁夏","青海","云南"], 6:["西藏","新疆"]},
    "甘肃": {2:["内蒙古","宁夏","青海","陕西","四川","新疆"], 3:["山西"], 4:["安徽","北京","重庆","贵州","河北","河南","湖北","湖南","江苏","江西","山东","上海","天津","云南","浙江"], 5:["福建","广东","广西","海南","黑龙江","吉林","辽宁","西藏"]},
    "广东": {2:["福建","广西","海南","湖南","江西"], 3:["湖北"], 4:["安徽","重庆","贵州","河北","河南","江苏","山东","山西","陕西","上海","四川","云南","浙江"], 5:["北京","甘肃","辽宁","内蒙古","宁夏","青海","天津"], 6:["黑龙江","吉林","西藏","新疆"]},
    "广西": {2:["广东","贵州","海南","湖南","云南"], 3:["重庆"], 4:["安徽","福建","河南","湖北","江苏","江西","陕西","上海","四川","浙江"], 5:["北京","甘肃","河北","辽宁","内蒙古","宁夏","青海","山东","山西","天津"], 6:["黑龙江","吉林","西藏","新疆"]},
    "贵州": {2:["重庆","广西","湖南","四川","云南"], 4:["安徽","福建","甘肃","广东","海南","河北","河南","湖北","江苏","江西","宁夏","青海","山东","山西","陕西","上海","浙江"], 5:["北京","辽宁","内蒙古","天津","西藏"], 6:["黑龙江","吉林","新疆"]},
    "海南": {2:["广东","广西"], 4:["安徽","重庆","福建","贵州","湖北","湖南","江苏","江西","四川","云南","浙江"], 5:["北京","甘肃","河北","河南","内蒙古","宁夏","青海","山东","山西","陕西","上海","天津"], 6:["黑龙江","吉林","辽宁","西藏","新疆"]},
    "河北": {2:["北京","河南","辽宁","内蒙古","山东","山西","天津"], 3:["安徽","湖北","江苏","宁夏","陕西"], 4:["重庆","福建","甘肃","广东","贵州","黑龙江","湖南","吉林","江西","青海","上海","四川","浙江"], 5:["广西","海南","新疆","云南"], 6:["西藏"]},
    "河南": {2:["安徽","河北","湖北","山东","山西","陕西"], 3:["北京","湖南","江苏","江西","内蒙古","上海","天津","浙江"], 4:["重庆","福建","甘肃","广东","广西","贵州","黑龙江","吉林","辽宁","宁夏","青海","四川"], 5:["海南","云南"], 6:["西藏","新疆"]},
    "黑龙江": {2:["吉林","内蒙古"], 3:["辽宁"], 4:["北京","河北","河南","山东","山西","天津"], 5:["安徽","重庆","福建","甘肃","湖北","湖南","江苏","江西","宁夏","青海","陕西","上海","浙江"], 6:["广东","广西","贵州","海南","四川","西藏","新疆","云南"]},
    "湖北": {2:["安徽","重庆","河南","湖南","江西","陕西"], 3:["福建","广东","河北","江苏","山东","山西","上海","浙江"], 4:["北京","甘肃","广西","贵州","海南","辽宁","内蒙古","宁夏","青海","四川","天津","云南"], 5:["黑龙江","吉林"], 6:["西藏","新疆"]},
    "湖南": {2:["重庆","广东","广西","贵州","湖北","江西"], 3:["安徽","福建","河南","江苏","陕西","浙江"], 4:["北京","甘肃","海南","河北","内蒙古","宁夏","青海","山东","山西","上海","四川","天津","云南"], 5:["黑龙江","吉林","辽宁"], 6:["西藏","新疆"]},
    "吉林": {2:["黑龙江","辽宁","内蒙古"], 3:["北京","天津"], 4:["安徽","河北","河南","江苏","山东","山西","上海"], 5:["重庆","福建","甘肃","湖北","湖南","江西","宁夏","青海","陕西","四川","浙江"], 6:["广东","广西","贵州","海南","西藏","新疆","云南"]},
    "江苏": {2:["安徽","山东","上海","浙江"], 3:["北京","福建","河北","河南","湖北","湖南","江西","天津"], 4:["重庆","甘肃","广东","广西","贵州","海南","吉林","辽宁","内蒙古","宁夏","青海","山西","陕西","四川"], 5:["黑龙江","云南"], 6:["西藏","新疆"]},
    "江西": {2:["安徽","福建","广东","湖北","湖南","浙江"], 3:["河南","江苏","上海"], 4:["北京","重庆","甘肃","广西","贵州","海南","河北","内蒙古","宁夏","青海","山东","山西","陕西","四川","天津","云南"], 5:["黑龙江","吉林","辽宁"], 6:["西藏","新疆"]},
    "辽宁": {2:["河北","吉林","内蒙古"], 3:["北京","黑龙江","山东","天津"], 4:["安徽","河南","湖北","江苏","宁夏","山西","陕西","上海","浙江"], 5:["重庆","福建","甘肃","广东","广西","贵州","湖南","江西","青海","四川"], 6:["海南","西藏","新疆","云南"]},
    "内蒙古": {2:["北京","甘肃","河北","黑龙江","吉林","辽宁","宁夏","山西","陕西"], 3:["河南","山东","天津"], 4:["安徽","重庆","湖北","湖南","江苏","江西","青海","上海","四川","浙江"], 5:["福建","广东","广西","贵州","海南","新疆","云南"], 6:["西藏"]},
    "宁夏": {2:["甘肃","内蒙古","陕西"], 3:["河北","青海","山西"], 4:["安徽","北京","重庆","贵州","河南","湖北","湖南","江苏","江西","辽宁","山东","上海","四川","天津","浙江"], 5:["福建","广东","广西","海南","黑龙江","吉林","西藏","新疆","云南"], 6:[]},
    "青海": {2:["甘肃","四川","西藏","新疆"], 3:["宁夏","陕西"], 4:["安徽","北京","重庆","贵州","河北","河南","湖北","湖南","江苏","江西","内蒙古","山东","山西","天津","云南"], 5:["福建","广东","广西","海南","黑龙江","吉林","辽宁","上海","浙江"], 6:[]},
    "山东": {2:["安徽","北京","河北","河南","江苏","天津"], 3:["湖北","辽宁","内蒙古","山西","陕西","上海","浙江"], 4:["重庆","福建","甘肃","广东","贵州","黑龙江","湖南","吉林","江西","宁夏","青海","四川"], 5:["广西","海南","云南"], 6:["西藏","新疆"]},
    "山西": {2:["河北","河南","内蒙古","陕西"], 3:["安徽","北京","甘肃","湖北","宁夏","山东","天津"], 4:["重庆","福建","广东","贵州","黑龙江","湖南","吉林","江苏","江西","辽宁","青海","上海","四川","浙江"], 5:["广西","海南","新疆","云南"], 6:["西藏"]},
    "陕西": {2:["重庆","甘肃","河南","湖北","内蒙古","宁夏","山西","四川"], 3:["安徽","河北","湖南","青海","山东"], 4:["北京","福建","广东","广西","贵州","江苏","江西","辽宁","上海","天津","云南","浙江"], 5:["海南","黑龙江","吉林","西藏","新疆"], 6:[]},
    "上海": {1:["上海"], 2:["安徽","江苏","浙江"], 3:["福建","河南","湖北","江西","山东"], 4:["北京","重庆","甘肃","广东","广西","贵州","河北","湖南","吉林","辽宁","内蒙古","宁夏","山西","陕西","四川","天津"], 5:["海南","黑龙江","青海","云南"], 6:["西藏","新疆"]},
    "四川": {2:["重庆","甘肃","贵州","青海","陕西","西藏","云南"], 4:["安徽","北京","福建","广东","广西","海南","河北","河南","湖北","湖南","江苏","江西","内蒙古","宁夏","山东","山西","上海","天津","浙江"], 5:["吉林","辽宁","新疆"], 6:["黑龙江"]},
    "天津": {2:["北京","河北","山东"], 3:["安徽","河南","吉林","江苏","辽宁","内蒙古","山西"], 4:["重庆","福建","甘肃","黑龙江","湖北","湖南","江西","宁夏","青海","陕西","上海","四川","浙江"], 5:["广东","广西","贵州","海南","云南"], 6:["西藏","新疆"]},
    "西藏": {2:["青海","四川","新疆","云南"], 5:["重庆","甘肃","贵州","宁夏","陕西"], 6:["安徽","北京","福建","广东","广西","海南","河北","河南","黑龙江","湖北","湖南","吉林","江苏","江西","辽宁","内蒙古","山东","山西","上海","天津","浙江"]},
    "新疆": {2:["甘肃","青海","西藏"], 5:["河北","内蒙古","宁夏","山西","陕西","四川"], 6:["安徽","北京","重庆","福建","广东","广西","贵州","海南","河南","黑龙江","湖北","湖南","吉林","江苏","江西","辽宁","山东","上海","天津","云南","浙江"]},
    "云南": {2:["广西","贵州","四川","西藏"], 3:["重庆"], 4:["甘肃","广东","海南","湖北","湖南","江西","青海","陕西"], 5:["安徽","北京","福建","河北","河南","江苏","内蒙古","宁夏","山东","山西","上海","天津","浙江"], 6:["黑龙江","吉林","辽宁","新疆"]},
    "浙江": {2:["安徽","福建","江苏","江西","上海"], 3:["河南","湖北","湖南","山东"], 4:["北京","重庆","甘肃","广东","广西","贵州","海南","河北","辽宁","内蒙古","宁夏","山西","陕西","四川","天津"], 5:["黑龙江","吉林","青海","云南"], 6:["西藏","新疆"]}
};

// 最新资费标准
// 档位: { 重量区间: { 首重, 续重 } }
const priceTable = {
    1: { low: {f: 5.0, n: 1.0}, mid: {f: 5.0, n: 2.0}, high: {f: 5.0, n: 3.0} },
    2: { low: {f: 6.0, n: 1.5}, mid: {f: 6.0, n: 2.0}, high: {f: 6.0, n: 3.0} },
    3: { low: {f: 7.0, n: 2.0}, mid: {f: 7.0, n: 2.0}, high: {f: 7.0, n: 3.0} },
    4: { low: {f: 8.0, n: 3.0}, mid: {f: 8.0, n: 3.0}, high: {f: 8.0, n: 4.0} },
    5: { low: {f: 9.0, n: 4.0}, mid: {f: 9.0, n: 4.0}, high: {f: 9.0, n: 5.0} },
    6: { low: {f: 10.0, n: 5.0}, mid: {f: 10.0, n: 7.0}, high: {f: 10.0, n: 8.0} }
};

const fromSel = document.getElementById('fromProv');
const toSel = document.getElementById('toProv');
provincesOrder.forEach(p => {
    fromSel.add(new Option(p, p));
    toSel.add(new Option(p, p));
});

function calc() {
    const f = fromSel.value;
    const t = toSel.value;
    const wReal = parseFloat(document.getElementById('weight').value) || 0;
    const L = parseFloat(document.getElementById('len').value) || 0;
    const W = parseFloat(document.getElementById('width').value) || 0;
    const H = parseFloat(document.getElementById('height').value) || 0;

    if (!f || !t || wReal <= 0) return;

    // 1. 计泡逻辑不变
    let billWeightG = wReal;
    const isVolActive = (L > 50 || W > 50 || H > 50);
    const wVolG = (L * W * H) / 6; // 体积重量 (g)
    
    if (isVolActive && wVolG > wReal) {
        billWeightG = wVolG;
        document.getElementById('volWarning').style.display = 'block';
    } else {
        document.getElementById('volWarning').style.display = 'none';
    }

    const billWeightKg = billWeightG / 1000;

    // 2. 档位判定不变
    let zone = 1;
    if (f !== t) {
        zone = 4;
        if(fullData[f]) {
            for (let z in fullData[f]) {
                if (fullData[f][z].includes(t)) { zone = parseInt(z); break; }
            }
        }
    } else {
        zone = ["新疆","西藏","内蒙古","青海"].includes(f) ? 2 : 1;
    }

    // 3. 应用最新阶梯计费逻辑
    let pr;
    if (billWeightKg <= 10) {
        pr = priceTable[zone].low;
    } else if (billWeightKg <= 20) {
        pr = priceTable[zone].mid;
    } else {
        pr = priceTable[zone].high;
    }

    const totalFee = pr.f + Math.max(0, Math.ceil((billWeightG - 1000) / 1000)) * pr.n;

    // 4. 邮票组合方案
    let minCost = Infinity, b3 = 0, b54 = 0, bFace = 0;
    for (let s3 = 0; s3 <= Math.ceil(totalFee / 3) + 1; s3++) {
        for (let s54 = 0; s54 <= Math.ceil(totalFee / 5.4) + 1; s54++) {
            let face = (s3 * 30 + s54 * 54) / 10;
            if (face >= totalFee) {
                let cost = s3 * 0.55 + s54 * 0.65;
                if (cost < minCost - 0.001) { minCost = cost; b3 = s3; b54 = s54; bFace = face; }
            }
        }
    }

    document.getElementById('resBillWeight').innerText = billWeightKg.toFixed(2) + " kg";
    document.getElementById('resZone').innerText = zone + " 档";
    document.getElementById('resFee').innerText = totalFee.toFixed(1);
    document.getElementById('resS3').innerText = b3;
    document.getElementById('resS54').innerText = b54;
    document.getElementById('resCost').innerText = "¥ " + minCost.toFixed(2);
    document.getElementById('resIns').innerText = Math.round((bFace - totalFee) * 100);
    document.getElementById('result').style.display = 'block';
}
</script>
</body>
</html>