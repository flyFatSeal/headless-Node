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

//window
for (let i = 0; i < allHref.length; i++) {
  await page.waitFor(2000)
  const AllInfo = await page.evaluate(async (getInfo, allHref, i) => {
    window.location.href = `${allHref[i]}`
    window.onload = function () {
      let thisInfo = {}
      let getTime
      let author = document.querySelector('.p-n').getElementsByTagName('a')[0].innerText
      if (author !== '小易') {
        getTime = document.querySelector('#newsVisitCountId').nextElementSibling.innerText
      } else {
        getTime = document.querySelector('.t-box').getElementsByTagName('span')[0].innerText
      }
      let title = document.querySelector('.tit-h1').innerText
      getInfo.title = title
      getInfo.author = author
      getInfo.href = allHref[i]
      getInfo.time = getTime
      thisInfo = getInfo
      return thisInfo
    }

  }, getInfo, allHref, i)
  let tempArry = transformArray(AllInfo)
  allXlsx.push(tempArry)
  // let writeInfo = '\r\n' + AllInfo.time + ',' + AllInfo.title + ',' + AllInfo.author + ',' + AllInfo.href + '\r\n'
  // fs.appendFile('微信.txt', writeInfo, function (err) {
  // 	if (err) {
  // 		console.info(err);
  // 	}
  // })
}
//返回当前页		
const pageHref = allHref.length
console.log('pageHref', pageHref)
await page.evaluate((pageHref) => {
  window.history.go(-pageHref)
}, pageHref)
console.log(allXlsx)
await browser.close();



//juagde
if (author !== '小易') {
  getTime = document.querySelector('#newsVisitCountId').nextElementSibling.innerText
} else {
  getTime = document.querySelector('.t-box').getElementsByTagName('span')[0].innerText
}


// 获得当前页面所有连接
for (let i = 0; i < allHref.length; i++) {
  await page.goto(allHref[i]);
  await page.waitFor(2000)
  const AllInfo = await page.evaluate((getInfo, allHref, i) => {
    let thisInfo = {}
    let getTime
    let author = document.querySelector('.p-n').getElementsByTagName('a')[0].innerText
    if (author !== '小易') {
      getTime = document.querySelector('#newsVisitCountId').nextElementSibling.innerText
    } else {
      getTime = document.querySelector('.t-box').getElementsByTagName('span')[0].innerText
    }
    let title = document.querySelector('.tit-h1').innerText
    getInfo.title = title
    getInfo.author = author
    getInfo.href = allHref[i]
    getInfo.time = getTime
    thisInfo = getInfo
    return thisInfo
  }, getInfo, allHref, i)
  let tempArry = transformArray(AllInfo)
  allXlsx.push(tempArry)
  // let writeInfo = '\r\n' + AllInfo.time + ',' + AllInfo.title + ',' + AllInfo.author + ',' + AllInfo.href + '\r\n'
  // fs.appendFile('微信.txt', writeInfo, function (err) {
  // 	if (err) {
  // 		console.info(err);
  // 	}
  // })
}
//返回当前页		
const pageHref = allHref.length
console.log('pageHref', pageHref)
await page.evaluate((pageHref) => {
  window.history.go(-pageHref)
}, pageHref)
console.log(allXlsx)
await browser.close();
