window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邮资助手</title>
    
    <link rel="apple-touch-icon" href="china_post_logo.png">
    <link rel="icon" href="china_post_logo.png">

    <style>
        :root { --primary: #1e7e34; --bg: #f8f9fa; --highlight: #e67e22; --danger: #e74c3c; }
        body { font-family: -apple-system, sans-serif; background: var(--bg); display: flex; justify-content: center; padding: 20px; margin: 0; }
        .card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 450px; }
        
        .header { display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .header img { height: 30px; margin-right: 10px; } 
        .header h2 { color: #1a1a1a; margin: 0; font-size: 22px; }

        .mode-switch { display: flex; background: #e9ecef; border-radius: 10px; padding: 5px; margin-bottom: 20px; }
        .mode-switch button { flex: 1; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: 0.3s; color: #666; background: transparent; }
        .mode-switch button.active { background: white; color: var(--primary); font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

        .row { margin-bottom: 15px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        label { display: block; margin-bottom: 8px; font-weight: bold; font-size: 14px; color: #555; }
        select, input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box; font-size: 16px; background-color: #fff; transition: 0.3s; }
        select:focus, input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(30, 126, 52, 0.1); }

        .result-box { background: #e9f7ef; padding: 20px; border-radius: 12px; display: none; margin-top: 15px; border-left: 5px solid var(--primary); border: 1px solid #d4edda; }
        .res-item { display: flex; justify-content: space-between; margin: 10px 0; border-bottom: 1px dashed #c3e6cb; padding-bottom: 8px; }
        .res-item:last-child { border-bottom: none; }
        .val { font-weight: bold; color: #333; }
        .highlight-text { color: var(--highlight); font-size: 1.1em; }
        .cost-text { color: var(--primary); }
        .ins-text { color: var(--danger); }
        .warning { color: var(--highlight); font-size: 12px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>

<div class="card">
    <div class="header">
        <img src="china_post_logo.png" alt="Logo">
        <h2>邮资助手</h2>
    </div>

    <div class="mode-switch">
        <button id="btnAuto" class="active" onclick="switchMode('auto')">查表自动算</button>
        <button id="btnManual" onclick="switchMode('manual')">直接输邮费</button>
    </div>

    <div id="sectionAuto">
        <div class="row">
            <label>寄出省份:</label>
            <select id="fromProv" onchange="runCalc()"></select>
        </div>
        <div class="row">
            <label>寄达省份:</label>
            <select id="toProv" onchange="runCalc()"></select>
        </div>
        <div class="row">
            <label>包裹实际重量 (克):</label>
            <input type="number" id="weight" placeholder="请输入克数..." oninput="runCalc()">
        </div>
        <div class="row">
            <label>尺寸 (长×宽×高 cm):</label>
            <div class="grid-3">
                <input type="number" id="len" placeholder="长" oninput="runCalc()">
                <input type="number" id="width" placeholder="宽" oninput="runCalc()">
                <input type="number" id="height" placeholder="高" oninput="runCalc()">
            </div>
        </div>
    </div>

    <div id="sectionManual" style="display:none;">
        <div class="row">
            <label>请输入柜台要求的应付金额 (元):</label>
            <input type="number" id="postageInput" step="0.1" placeholder="例如: 12.5" oninput="runCalc()">
        </div>
    </div>

    <div id="result" class="result-box">
        <div id="volWarning" class="warning" style="display:none;">⚠️ 单边超50cm，已启用计泡逻辑</div>
        <div id="resRowBill" class="res-item"><span>计费重量:</span> <span id="resBillWeight" class="val">-</span></div>
        <div class="res-item"><span>应付邮费:</span> <span class="val">¥ <span id="resFee">0</span></span></div>
        
        <div style="margin: 10px 0; border-top: 2px solid #c3e6cb; padding-top: 10px;">
            <div class="res-item"><span>3元邮票:</span> <span id="stamp3" class="val highlight-text">0</span> 张</div>
            <div class="res-item"><span>5.4元邮票:</span> <span id="stamp54" class="val highlight-text">0</span> 张</div>
            <div class="res-item"><span>贴票总面值:</span> <span id="totalFace" class="val">0</span> 元</div>
            <div class="res-item"><span>总购买成本:</span> <span id="totalCost" class="val cost-text">0</span> 元</div>
        </div>

        <div style="margin-top: 5px; padding-top: 10px; border-top: 2px solid #c3e6cb;">
            <div class="res-item"><span>可保价金额:</span> <span id="insurance" class="val ins-text">0</span> 元</div>
        </div>
    </div>
</div>

<script>
let currentMode = 'auto';
function switchMode(mode) {
    currentMode = mode;
    document.getElementById('sectionAuto').style.display = mode === 'auto' ? 'block' : 'none';
    document.getElementById('sectionManual').style.display = mode === 'manual' ? 'block' : 'none';
    document.getElementById('btnAuto').classList.toggle('active', mode === 'auto');
    document.getElementById('btnManual').classList.toggle('active', mode === 'manual');
    document.getElementById('result').style.display = 'none';
    runCalc();
}

const provincesOrder = ["北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江","上海","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"];
const fullData = {
    "上海": {1:["上海"], 2:["安徽","江苏","浙江"], 3:["福建","河南","湖北","江西","山东"], 4:["北京","重庆","甘肃","广东","广西","贵州","河北","湖南","吉林","辽宁","内蒙古","宁夏","山西","陕西","四川","天津"], 5:["海南","黑龙江","青海","云南"], 6:["西藏","新疆"]},
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
    "湖北": {2:["安徽","重庆","河南","湖南","江西","陕西"], 3:["福建","广东","河北","江苏","山东","山西","上海","浙江"], 4:["北京","甘肃","广西","贵州","海南","辽宁","内蒙古","宁夏","青海","四川","天津","云南"], 5:["黑龙江","吉江"], 6:["西藏","新疆"]},
    "湖南": {2:["重庆","广东","广西","贵州","湖北","江西"], 3:["安徽","福建","河南","江苏","陕西","浙江"], 4:["北京","甘肃","海南","河北","内蒙古","宁夏","青海","山东","山西","上海","四川","天津","云南"], 5:["黑龙江","吉林","辽宁"], 6:["西藏","新疆"]},
    "吉林": {2:["黑龙江","辽宁","内蒙古"], 3:["北京","天津"], 4:["安徽","河北","河南","江苏","山东","山西","上海"], 5:["重庆","福建","甘肃","湖北","湖南","江西","宁夏","青海","陕西","四川"], 6:["广东","广西","贵州","海南","西藏","新疆","云南"]},
    "江苏": {2:["安徽","山东","上海","浙江"], 3:["北京","福建","河北","河南","湖北","湖南","江西","天津"], 4:["重庆","甘肃","广东","广西","贵州","海南","吉林","辽宁","内蒙古","宁夏","青海","山西","陕西","四川"], 5:["黑龙江","云南"], 6:["西藏","新疆"]},
    "江西": {2:["安徽","福建","广东","湖北","湖南","浙江"], 3:["河南","江苏","上海"], 4:["北京","重庆","甘肃","广西","贵州","海南","河北","内蒙古","宁夏","青海","山东","山西","陕西","四川","天津","云南"], 5:["黑龙江","吉林","辽宁"], 6:["西藏","新疆"]},
    "辽宁": {2:["河北","吉林","内蒙古"], 3:["北京","黑龙江","山东","天津"], 4:["安徽","河南","湖北","江苏","宁夏","山西","陕西","上海","浙江"], 5:["重庆","福建","甘肃","广东","广西","贵州","湖南","江西","青海","四川"], 6:["海南","西藏","新疆","云南"]},
    "内蒙古": {2:["北京","甘肃","河北","黑龙江","吉林","辽宁","内蒙古","宁夏","山西","陕西"], 3:["河南","山东","天津"], 4:["安徽","重庆","湖北","湖南","江苏","江西","青海","上海","四川","浙江"], 5:["福建","广东","广西","贵州","海南","新疆","云南"], 6:["西藏"]},
    "宁夏": {2:["甘肃","内蒙古","陕西"], 3:["河北","青海","山西"], 4:["安徽","北京","重庆","贵州","河南","湖北","湖南","江苏","江西","辽宁","山东","上海","四川","天津","浙江"], 5:["福建","广东","广西","海南","黑龙江","吉林","西藏","新疆","云南"], 6:[]},
    "青海": {2:["甘肃","四川","西藏","新疆"], 3:["宁夏","陕西"], 4:["安徽","北京","重庆","贵州","河北","河南","湖北","湖南","江苏","江西","内蒙古","山东","山西","天津","云南"], 5:["福建","广东","广西","海南","黑龙江","吉林","辽宁","上海","浙江"], 6:[]},
    "山东": {2:["安徽","北京","河北","河南","江苏","天津"], 3:["湖北","辽宁","内蒙古","山西","陕西","上海","浙江"], 4:["重庆","福建","甘肃","广东","贵州","黑龙江","湖南","吉林","江西","宁夏","青海","四川"], 5:["广西","海南","云南"], 6:["西藏","新疆"]},
    "山西": {2:["河北","河南","内蒙古","陕西"], 3:["安徽","北京","甘肃","湖北","宁夏","山东","天津"], 4:["重庆","福建","广东","贵州","黑龙江","湖南","吉林","江苏","江西","辽宁","青海","上海","四川","浙江"], 5:["广西","海南","新疆","云南"], 6:["西藏"]},
    "陕西": {2:["重庆","甘肃","河南","湖北","内蒙古","宁夏","山西","四川"], 3:["安徽","河北","湖南","青海","山东"], 4:["北京","福建","广东","广西","贵州","江苏","江西","辽宁","上海","天津","云南","浙江"], 5:["海南","黑龙江","吉林","西藏","新疆"], 6:[]},
    "四川": {2:["重庆","甘肃","贵州","青海","陕西","西藏","云南"], 4:["安徽","北京","福建","广东","广西","海南","河北","河南","湖北","湖南","江苏","江西","内蒙古","宁夏","山东","山西","上海","天津","浙江"], 5:["吉林","辽宁","新疆"], 6:["黑龙江"]},
    "天津": {2:["北京","河北","山东"], 3:["安徽","河南","吉林","江苏","辽宁","内蒙古","山西"], 4:["重庆","福建","甘肃","黑龙江","湖北","湖南","江西","宁夏","青海","陕西","上海","四川","浙江"], 5:["广东","广西","贵州","海南","云南"], 6:["西藏","新疆"]},
    "西藏": {2:["青海","四川","新疆","云南"], 5:["重庆","甘肃","贵州","宁夏","陕西"], 6:["安徽","北京","福建","广东","广西","海南","河北","河南","黑龙江","湖北","湖南","吉林","江苏","江西","辽宁","内蒙古","山东","山西","上海","天津","浙江"]},
    "新疆": {2:["甘肃","青海","西藏"], 5:["河北","内蒙古","宁夏","山西","陕西","四川"], 6:["安徽","北京","重庆","福建","广东","广西","贵州","海南","河南","黑龙江","湖北","湖南","吉林","江苏","江西","辽宁","山东","上海","天津","云南","浙江"]},
    "云南": {2:["广西","贵州","四川","西藏"], 3:["重庆"], 4:["甘肃","广东","海南","湖北","湖南","江西","青海","陕西"], 5:["安徽","北京","福建","河北","河南","江苏","内蒙古","宁夏","山东","山西","上海","天津","浙江"], 6:["黑龙江","吉林","辽宁","新疆"]},
    "浙江": {2:["安徽","福建","江苏","江西","上海"], 3:["河南","湖北","湖南","山东"], 4:["北京","重庆","甘肃","广东","广西","贵州","海南","河北","辽宁","内蒙古","宁夏","山西","陕西","四川","天津"], 5:["黑龙江","吉林","青海","云南"], 6:["西藏","新疆"]}
};

const priceTable = {
    1: { low: {f: 5.0, n: 1.0}, mid: {f: 5.0, n: 2.0}, high: {f: 5.0, n: 3.0} },
    2: { low: {f: 6.0, n: 1.5}, mid: {f: 6.0, n: 2.0}, high: {f: 6.0, n: 3.0} },
    3: { low: {f: 7.0, n: 2.0}, mid: {f: 7.0, n: 2.0}, high: {f: 7.0, n: 3.0} },
    4: { low: {f: 8.0, n: 3.0}, mid: {f: 8.0, n: 3.0}, high: {f: 8.0, n: 4.0} },
    5: { low: {f: 9.0, n: 4.0}, mid: {f: 9.0, n: 4.0}, high: {f: 9.0, n: 5.0} },
    6: { low: {f: 10.0, n: 5.0}, mid: {f: 10.0, n: 7.0}, high: {f: 10.0, n: 8.0} }
};

const fromSel = document.getElementById('fromProv'), toSel = document.getElementById('toProv');
provincesOrder.forEach(p => { fromSel.add(new Option(p, p)); toSel.add(new Option(p, p)); });

function runCalc() {
    let finalPostage = 0;
    if (currentMode === 'auto') {
        const f = fromSel.value, t = toSel.value, wReal = parseFloat(document.getElementById('weight').value) || 0;
        const L = parseFloat(document.getElementById('len').value) || 0, W = parseFloat(document.getElementById('width').value) || 0, H = parseFloat(document.getElementById('height').value) || 0;
        if (!f || !t || wReal <= 0) { document.getElementById('result').style.display = 'none'; return; }
        let billWeightG = wReal;
        if (L > 50 || W > 50 || H > 50) { 
            let wVolG = (L * W * H) / 6;
            if (wVolG > wReal) { billWeightG = wVolG; document.getElementById('volWarning').style.display = 'block'; }
            else { document.getElementById('volWarning').style.display = 'none'; }
        } else { document.getElementById('volWarning').style.display = 'none'; }
        const billWeightKg = billWeightG / 1000;
        let zone = 1;
        if (f !== t) { zone = 4; if(fullData[f]) { for (let z in fullData[f]) { if (fullData[f][z].includes(t)) { zone = parseInt(z); break; } } } }
        else { zone = ["新疆","西藏","内蒙古","青海"].includes(f) ? 2 : 1; }
        let pr;
        if (billWeightKg <= 10) pr = priceTable[zone].low;
        else if (billWeightKg <= 20) pr = priceTable[zone].mid;
        else pr = priceTable[zone].high;
        finalPostage = pr.f + Math.max(0, Math.ceil((billWeightG - 1000) / 1000)) * pr.n;
        document.getElementById('resRowBill').style.display = 'flex';
        document.getElementById('resBillWeight').innerText = billWeightKg.toFixed(2) + " kg";
    } else {
        finalPostage = parseFloat(document.getElementById('postageInput').value);
        if (isNaN(finalPostage) || finalPostage <= 0) { document.getElementById('result').style.display = 'none'; return; }
        document.getElementById('resRowBill').style.display = 'none';
        document.getElementById('volWarning').style.display = 'none';
    }
    let minCost = Infinity, b3 = 0, b54 = 0, bFace = 0;
    const l3 = Math.ceil(finalPostage/3)+1, l54 = Math.ceil(finalPostage/5.4)+1;
    for (let s3=0; s3<=l3; s3++) {
        for (let s54=0; s54<=l54; s54++) {
            let face = (s3*30 + s54*54)/10;
            if (face >= finalPostage) {
                let cost = s3*0.55 + s54*0.65;
                if (cost < minCost - 0.0001) { minCost=cost; b3=s3; b54=s54; bFace=face; }
            }
        }
    }
    document.getElementById('resFee').innerText = finalPostage.toFixed(1);
    document.getElementById('stamp3').innerText = b3;
    document.getElementById('stamp54').innerText = b54;
    document.getElementById('totalFace').innerText = bFace.toFixed(1);
    document.getElementById('totalCost').innerText = minCost.toFixed(2);
    document.getElementById('insurance').innerText = Math.max(0, (bFace - finalPostage) * 100).toFixed(0);
    document.getElementById('result').style.display = 'block';
}
</script>
</body>
</html>