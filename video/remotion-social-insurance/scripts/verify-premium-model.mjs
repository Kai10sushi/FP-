import assert from 'node:assert/strict';
import {annual,monthly,monthlySupport,sum,cumulative,final,premiumScenes,premiumDuration,chartSvg} from '../src/premium-model.ts';
assert.deepEqual(monthly(22),{pension:27450,health:14775,employment:1500,care:0});
assert.equal(monthly(39).care,0);
assert.equal(monthly(40).care,2430);
assert.equal(sum(monthly(22)),43725);
assert.equal(sum(monthly(40)),46155);
assert.equal(monthlySupport,345);
assert.equal(sum(monthly(22))+monthlySupport,44070);
assert.equal(sum(monthly(40))+monthlySupport,46500);
assert.equal(cumulative(22).socialTotal,0);
assert.equal(cumulative(40).amounts.care,0);
assert.equal(cumulative(41).amounts.care,29160);
assert.equal(final.months,456);
assert.equal(final.careMonths,240);
assert.equal(final.amounts.pension,27450*456);
assert.equal(final.amounts.health,14775*456);
assert.equal(final.amounts.employment,1500*456);
assert.equal(final.amounts.care,2430*240);
assert.equal(final.socialTotal,20521800);
assert.equal(final.supportTotal,157320);
assert.equal(final.payrollTotal,20679120);
assert.equal(annual(22).grossSalary,3600000);
assert.equal(annual(22).socialTotal,524700);
assert.equal(annual(40).socialTotal,553860);
assert.equal(annual(22).socialShare,0.14575);
assert.equal(annual(40).socialShare,0.15385);
assert.equal(final.grossSalary,136800000);
assert.equal(final.grossSalary,annual(22).grossSalary*38);
assert.equal((final.socialShare*100).toFixed(1),'15.0');
assert.equal(cumulative(22).socialShare,0);
for(const age of [22,30,40,50,60]){
 const point=cumulative(age);
 assert.equal(point.grossSalary,300000*point.months);
 assert(point.socialTotal<=point.grossSalary);
}
assert(chartSvg(1).includes('1億3,680万円'));
assert(chartSvg(1).includes('同じ期間・同じ目盛り'));
assert(chartSvg(1).includes('差額は手取りではありません'));
assert.equal(final.socialTotal,sum(monthly(22))*216+sum(monthly(40))*240);
for(let age=22;age<60;age++){assert(cumulative(age+1).socialTotal>cumulative(age).socialTotal);}
for(let i=1;i<premiumScenes.length;i++)assert.equal(premiumScenes[i].start,premiumScenes[i-1].start+premiumScenes[i-1].seconds);
assert.equal(premiumDuration,(premiumScenes.at(-1).start+premiumScenes.at(-1).seconds)*30);
assert(!/NaN|Infinity/.test(chartSvg(0)+chartSvg(0.5)+chartSvg(1)));
console.log('PASS: monthly rates, care boundary, 456/240 months, independent lifetime sum, support separation, chart and scene continuity');

