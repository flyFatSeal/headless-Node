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
	fs.writeFileSync('yiche.xlsx', buffer, {
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
		height: 1000
	});
	await page.waitFor(2000)
	await page.goto('http://www.cheyisou.com/wenzhang/DS/1.html?para=o|datetime');
	const allXlsx = []
	//定义爬虫数据结构
	let today = new Date()
	let toDay = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
	const getInfo = {
		Id: null,
		time: toDay,
		Project: '日常Daily',
		Platform: '其他others',
		Original: 'DS',
		Media: '易车号',
		author: null,
		Position: '-',
		title: null,
		href: null,
		Tone: 'Tone',
		type: '媒体舆情',
		Readership: '/',
		Comments: null
	}
	for (let i = 0; i < 3; i++) {
		//获得当前页面所有连接
		const allHref = await page.evaluate(() => {
			let pageArtDiv = document.querySelectorAll('.c-container')
			let hrefAll = []
			let href = []
			for (let i = 0; i < pageArtDiv.length; i++) {
				let h3 = pageArtDiv[i].getElementsByTagName('h3')
				let a = h3[0].getElementsByTagName('a')[0]
				href.push(a.href)
			}
			hrefAll = href
			return hrefAll
		});
		console.log('allHref', allHref)
		// 获得当前页面所有连接
		for (let i = 0; i < allHref.length; i++) {
			await page.goto(allHref[i]);
			await page.waitFor(500)
			const AllInfo = await page.evaluate((getInfo, allHref, i) => {
				let thisInfo = {}
				let getTime
				let Readership
				let author = document.querySelector('.p-n').getElementsByTagName('a')[0].innerText
				let title = document.querySelector('.tit-h1').innerText
				let Comments = document.querySelector('.pl-link').querySelector('em').innerText
				if (author !== '小易') {
					getTime = document.querySelector('#newsVisitCountId').nextElementSibling.innerText
					Reader = document.querySelector('#newsVisitCountId').innerText
					Readership = Reader.replace(/[^0-9]/ig, '')
				} else {
					getTime = document.querySelector('.t-box').getElementsByTagName('span')[0].innerText
				}
				getInfo.title = title
				getInfo.author = author
				getInfo.href = allHref[i]
				getInfo.time = getTime
				getInfo.Comments = Comments
				getInfo.Readership = Readership
				thisInfo = getInfo
				return thisInfo
			}, getInfo, allHref, i)
			let tempArry = transformArray(AllInfo)
			allXlsx.push(tempArry)
		}
		//返回当前页		
		const pageHref = allHref.length
		console.log('pageHref', pageHref)
		await page.evaluate((pageHref) => {
			window.history.go(-pageHref)
		}, pageHref)
		console.log(allXlsx)
		await page.waitFor(500);
		await page.waitForSelector('.pagination')
		const nextPage = await page.$('.next-on');
		await nextPage.click();
		await page.waitFor(500);
	}
	writeXls(allXlsx);
	await browser.close();
});
