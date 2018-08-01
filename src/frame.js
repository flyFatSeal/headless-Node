let today = new Date()
console.info(today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate())

const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.google.com/chrome/browser/canary.html');
  dumpFrameTree(page.mainFrame(), '');
  await browser.close();

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    for (let child of frame.childFrames())
      dumpFrameTree(child, indent + '  ');
  }
});



const AllInfo = await page.evaluate((getInfo) => {
  let allinfo = []
  for (let i = 0; i < allHref.length; i++) {
    window.location.href = allHref[i]
    let title = document.querySelector('#activity-name').innerText
    let author = document.querySelector('#js_name').innerText
    getInfo.title = title
    getInfo.author = author
    allinfo.push(getInfo)
    console.info(getInfo)
  }
  return allinfo
}, getInfo, allHref)

let writerStream = await fs.createWriteStream('微信.txt');
await writerStream.write(AllInfo, 'UTF8');
await writerStream.end();
await browser.close();


await page.waitForSelector('.mun')
const nextPage = await page.$('#sogou_next');
await nextPage.click();
await page.waitFor(5000);

[getInfo.time, getInfo.title, 3, 5, 6], [getInfo.time, getInfo.title, 3, 5, 6], [getInfo.time, getInfo.title, 3, 5, 6]
