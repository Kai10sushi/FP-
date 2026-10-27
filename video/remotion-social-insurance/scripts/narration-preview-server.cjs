const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const webpack = require('webpack');
const root = path.resolve(__dirname,'..');
const port = Number(process.env.PREMIUM_PREVIEW_PORT || 3102);
const dest = path.join(root,'.cache/narration-preview');
const html = '<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>音声付き導入｜制度の翻訳室</title><style>body{margin:0;background:#173c42;color:#f5f3ec;font-family:"Yu Gothic",Meiryo,sans-serif}p{line-height:1.7;color:#d7e2df}button:focus-visible{outline:3px solid #efc173}</style><div id="root"></div><script src="/preview.js"></script></html>';
webpack({mode:'development',devtool:false,entry:path.join(root,'src/narration-preview.tsx'),output:{path:dest,filename:'preview.js'},resolve:{extensions:['.tsx','.ts','.js']},module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:path.join(__dirname,'tsx-preview-loader.cjs')}]},optimization:{minimize:false},plugins:[new webpack.DefinePlugin({'process.env.NODE_ENV':JSON.stringify('development')})]},(err,stats)=>{
  if(err || stats.hasErrors()){console.error(err || stats.toString({all:false,errors:true}));process.exitCode=1;return;}
  const files = {
    ...Object.fromEntries(['intro','purpose','fields','risk','coverage'].map(key=>['/audio/'+key+'-clean-v1.wav',[path.join(root,'public/audio/'+key+'-clean-v1.wav'),'audio/wav']])),
    '/charts/premiums-lifetime-2026.svg':[path.join(root,'public/charts/premiums-lifetime-2026.svg'),'image/svg+xml; charset=utf-8'],
    '/charts/premiums-model-2026.json':[path.join(root,'public/charts/premiums-model-2026.json'),'application/json; charset=utf-8'],
    '/preview.js':[path.join(dest,'preview.js'),'text/javascript; charset=utf-8'],
    '/audio/intro-recording17-v1.m4a':[path.join(root,'public/audio/intro-recording17-v1.m4a'),'audio/mp4'],
    '/audio/purpose-recording18-v1.m4a':[path.join(root,'public/audio/purpose-recording18-v1.m4a'),'audio/mp4'],
    '/audio/fields-recording19-v1.m4a':[path.join(root,'public/audio/fields-recording19-v1.m4a'),'audio/mp4'],
    '/audio/fields-recording19-v2.m4a':[path.join(root,'public/audio/fields-recording19-v2.m4a'),'audio/mp4'],
    '/audio/risk-benefit-v1.m4a':[path.join(root,'public/audio/risk-benefit-v1.m4a'),'audio/mp4'],
    '/audio/coverage-benefit-v1.m4a':[path.join(root,'public/audio/coverage-benefit-v1.m4a'),'audio/mp4'],
  };
  http.createServer((req,res)=>{
    const url = new URL(req.url,'http://127.0.0.1').pathname;
    res.setHeader('Cache-Control','no-store');
    if(url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html);}
    const file = files[url];
    if(!file){res.writeHead(404);return res.end('Not found');}
    const size = fs.statSync(file[0]).size;
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){
      const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),size-1):size-1;
      if(start>=size || end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}
      res.writeHead(206,{'Content-Type':file[1],'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
      fs.createReadStream(file[0],{start,end}).pipe(res);
    }else{res.writeHead(200,{'Content-Type':file[1],'Content-Length':size,'Accept-Ranges':'bytes'});fs.createReadStream(file[0]).pipe(res);}
  }).listen(port,'127.0.0.1',()=>console.log('Video preview: http://127.0.0.1:'+port+'/'));
});
