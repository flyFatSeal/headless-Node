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
	await page.goto('http://weixin.sogou.com/');
	const searchInput = await page.$('#query');
	await searchInput.focus(); //定位到搜索框
	await page.setViewport({
		width: 1920,
		height: 2000
	});
	await page.keyboard.type('DS');
	const searchBtn = await page.$('.swz');
	await searchBtn.click();

	//for #pagebar_container
	await page.waitForSelector('.news-list');
	const searchTool = await page.$('#tool_show')
	await searchTool.click()
	await page.waitForSelector('.all-wy-box')
	const searchTime = await page.$('#time')
	await searchTime.click()
	const oneday = await page.$('#time_enter')
	await oneday.click()
	//循环获取页面数量
	const allXlsx = []
	//定义爬虫数据结构
	let today = new Date()
	let toDay = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
	const getInfo = {
		Id: null,
		time: toDay,
		Project: '日常Daily',
		Platform: '微信wechat',
		Original: 'DS',
		Media: '微信',
		author: null,
		Position: '-',
		title: null,
		href: null,
		Tone: 'Tone',
		type: '媒体舆情'
	}
	for (let i = 0; i < 9; i++) {
		await page.waitForSelector('.mun')
		await page.waitFor(5000);
		const pageArtUl = await page.$('.news-list')
		let pageArtLi
		await page.evaluate(e => {
			const pageArtLiGet = e.getElementsByTagName('li')
			pageArtLi = pageArtLiGet
		}, pageArtUl);
		//获得当前页面所有连接
		const allHref = await page.evaluate(() => {
			let hrefAll = []
			let href = []
			for (let i = 0; i < pageArtLi.length; i++) {
				let h3 = pageArtLi[i].getElementsByTagName('h3')
				let a = h3[0].getElementsByTagName('a')[0]
				href.push(a.href)
			}
			hrefAll = href
			return hrefAll
		}, pageArtLi);
		//获得当前页面所有信息
		for (let i = 0; i < allHref.length; i++) {
			await page.goto(allHref[i]);
			const AllInfo = await page.evaluate((getInfo, allHref, i) => {
				let thisInfo = {}
				let titleBool = document.querySelector('#activity-name')
				let share = document.querySelector('.share_notice')
				if (share || !titleBool) {
					return
				}
				let title = document.querySelector('#activity-name').innerText
				let author = document.querySelector('#js_name').innerText
				getInfo.title = title
				getInfo.author = author
				getInfo.href = allHref[i]
				thisInfo = getInfo
				return thisInfo
			}, getInfo, allHref, i)
			let tempArry = transformArray(AllInfo)
			allXlsx.push(tempArry)
		}
		//返回当前页
		console.log(allXlsx)
		const pageHref = allHref.length
		console.log('pageHref', pageHref)
		await page.evaluate((pageHref) => {
			window.history.go(-pageHref)
		}, pageHref)
		await page.waitFor(4000);
		await page.waitForSelector('.mun')
		const nextPage = await page.$('#sogou_next');
		await nextPage.click();
		await page.waitFor(5000);
	}
	writeXls(allXlsx);
	await browser.close();
});
