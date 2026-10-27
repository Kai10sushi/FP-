import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {annual,chartSvg,model,monthly,monthlySupport,sum,final,milestones,sources,premiumScenes} from '../src/premium-model.ts';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dest=path.join(root,'public/charts');
fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'premiums-lifetime-2026.svg'),chartSvg(1),'utf8');
const result={model,sources,monthlyUnder40:monthly(22),monthly40To59:monthly(40),socialMonthlyUnder40:sum(monthly(22)),socialMonthly40To59:sum(monthly(40)),monthlySupport,annualUnder40:annual(22),annual40To59:annual(40),final,milestones,scenes:premiumScenes};
fs.writeFileSync(path.join(dest,'premiums-model-2026.json'),JSON.stringify(result,null,2)+'\n','utf8');
console.log(JSON.stringify({chart:path.join(dest,'premiums-lifetime-2026.svg'),socialLifetime:final.socialTotal,support:final.supportTotal,payrollTotal:final.payrollTotal,milestones},null,2));

