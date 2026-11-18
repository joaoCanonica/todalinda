import lighthouse from '../node_modules/.pnpm/lighthouse@13.6.0_ajv@8.20.0/node_modules/lighthouse/core/index.js';
import * as cl from '../node_modules/.pnpm/chrome-launcher@1.2.3/node_modules/chrome-launcher/dist/index.js';
const chrome = await cl.launch({
  chromePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',
  chromeFlags: ['--headless=new', '--no-sandbox'],
});
const r = await lighthouse(`http://127.0.0.1:4350${process.argv[2]}`, {
  port: chrome.port,
  output: 'json',
  logLevel: 'error',
  onlyCategories: ['performance'],
  throttlingMethod: 'devtools',
});
const a = r.lhr.audits;
console.log('LCP', a['largest-contentful-paint'].numericValue);
for (const i of a['network-requests'].details.items.filter((i) => i.networkRequestTime < 3000))
  console.log(
    Math.round(i.networkRequestTime),
    Math.round(i.networkEndTime),
    i.resourceType,
    Math.round(i.transferSize / 1024) + 'KB',
    i.priority,
    i.url.replace('http://127.0.0.1:4350', ''),
  );
await chrome.kill();
