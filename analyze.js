const fs = require('fs');
const path = require('path');

const imgPath = 'C:/Users/Skurikapu/.gemini/antigravity/brain/2dc7f961-bca1-4cc7-950f-665c465fac19/.user_uploaded/media_1793984751429_63a7e4dc.png';

try {
  const stat = fs.statSync(imgPath);
  const buf = fs.readFileSync(imgPath);
  // Just dump basic header
  fs.writeFileSync('c:/Users/Skurikapu/Desktop/esmiringhoy/web/analyze_out.txt', 'Size: ' + stat.size + ' bytes. Header: ' + buf.slice(0, 16).toString('hex'));
} catch (err) {
  fs.writeFileSync('c:/Users/Skurikapu/Desktop/esmiringhoy/web/analyze_out.txt', 'Err: ' + err.message);
}

