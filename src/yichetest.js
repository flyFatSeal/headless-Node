var xlsx = require('node-xlsx');

function sleep(delay) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				resolve(1)
			} catch (e) {
				reject(0)
			}
		}, delay)
	})
}

function writeXls(datas) {
	var buffer = xlsx.build([{
		name: 'sheet1',
		data: datas
	}]);
	fs.writeFileSync('test1.xlsx', buffer, {
		'flag': 'w'
	})
}

function transformArray(obj) {
	var arr = [];
	for (var item in obj) {
		arr.push(obj[item]);
	}
	return arr;
}

const puppeteer = require('puppeteer');
const fs = require('fs');
puppeteer.launch({
	ignoreHTTPSErrors: true,
	headless: false,
	slowMo: 250,
	timeout: 0
}).then(async browser => {
	let page = await browser.newPage();
	await page.setJavaScriptEnabled(true);
	await page.goto('http://www.cheyisou.com/wenzhang/ds/');
	await page.setViewport({
		width: 1920,
		height: 2000
	});
	await page.waitFor(2000)
	await page.goto('http://www.cheyisou.com/wenzhang/DS/1.html?para=o|datetime');
	const pageArtH3 = await page.$$('.c-container')
	console.info('pageArtH3', pageArtH3.length)
	// 获得当前页面所有连接
	console.info('allHref', allHref.length)
	await browser.close();
});
