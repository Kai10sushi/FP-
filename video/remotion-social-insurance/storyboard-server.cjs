const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const scenes = require('./src/storyboard.json');
const files = scenes.map(scene => scene.file);
const html = `<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>社会保険｜全10画面のデザイン案</title><style>
*{box-sizing:border-box}body{margin:0;background:#173c42;color:#f5f3ec;font-family:"Yu Gothic",Meiryo,sans-serif}
main{max-width:1440px;margin:auto;padding:25px 24px}header{display:flex;align-items:center;gap:20px;justify-content:space-between}
h1{font-size:22px;margin:0}p{line-height:1.7;color:#c6d6cf;font-size:14px}nav{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}
button{font:inherit;padding:12px 20px;border:1px solid #6c9891;border-radius:9px;background:transparent;color:white;cursor:pointer}
button[aria-pressed=true]{background:#d7e9a0;color:#173c42;border-color:#d7e9a0}button:focus-visible,a:focus-visible{outline:3px solid #efc173}
img{width:100%;height:auto;display:block;border-radius:12px;background:#f5f3ec}#caption{font-size:16px;margin-top:16px}
a{color:#d7e9a0}footer{display:flex;gap:20px;align-items:center;justify-content:space-between}
@media(max-width:650px){main{padding:15px 10px}h1{font-size:18px}header{display:block}button{padding:10px}footer{display:block}}
</style><main><header><h1>社会保険の全体像 — 全10画面</h1><span>VISUAL STORYBOARD / v2</span></header>
<p>静止画の確認用です。8秒ごとの自動送りができますが、本編の尺ではありません。音声・アニメーション・MP4は未制作。</p>
<nav aria-label="場面の選択">${scenes.map((s,i)=>'<button data-scene="'+i+'" aria-pressed="'+(i===0)+'">'+String(i+1).padStart(2,'0')+' '+s.label+'</button>').join('')}</nav>
<nav aria-label="再生操作"><button id="prev">前へ</button><button id="play">自動送り</button><button id="next">次へ</button><span id="count" aria-live="polite"></span></nav>
<img id="scene" src="/01-payslip.svg" alt="給与明細の社会保険料を強調し、会社員の疑問につなげた画面">
<footer><p id="caption"></p><a id="full" href="/01-payslip.svg" target="_blank" rel="noopener">画像を大きく開く ↗</a></footer>
<p>確認ポイント：絵だけでも関係がわかるか ／ 文字の大きさ ／ 詰め込みすぎていないか</p>
</main><script>
const files=${JSON.stringify(files)};
const captions=${JSON.stringify(scenes.map(s=>s.caption))};
const alts=captions;
const buttons=[...document.querySelectorAll('[data-scene]')];
let current=0;
function show(i){current=i;buttons.forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));document.getElementById('scene').src='/'+files[i];document.getElementById('scene').alt=alts[i];document.getElementById('caption').textContent=captions[i];document.getElementById('full').href='/'+files[i];document.getElementById('count').textContent=(i+1)+' / '+files.length}
buttons.forEach((b,i)=>b.onclick=()=>show(i));
let timer=null;
function stop(){clearInterval(timer);timer=null;document.getElementById('play').textContent='自動送り'}
function move(d){stop();show((current+d+files.length)%files.length)}
buttons.forEach((b,i)=>b.onclick=()=>{stop();show(i)});
document.getElementById('prev').onclick=()=>move(-1);
document.getElementById('next').onclick=()=>move(1);
document.getElementById('play').onclick=()=>{if(timer){stop();return}if(current===files.length-1)show(0);document.getElementById('play').textContent='停止';timer=setInterval(()=>{if(current===files.length-1){stop();return}show(current+1)},8000)};
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
show(0);
</script></html>`;
const server=http.createServer((req,res)=>{
  const file = req.url.slice(1);
  res.setHeader('Cache-Control','no-store');
  if(req.url==='/' || req.url==='/index.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html)}
  if(!files.includes(file)){res.writeHead(404);return res.end('Not found')}
  fs.readFile(path.join(__dirname,'public','storyboard',file),(err,data)=>{
    if(err){res.writeHead(500);return res.end('Unable to load design')}
    res.writeHead(200,{'Content-Type':'image/svg+xml; charset=utf-8'});res.end(data);
  });
});
server.listen(3101,'127.0.0.1',()=>console.log('Storyboard: http://127.0.0.1:3101/'));
