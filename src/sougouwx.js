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

function patch(re, s) {
	try {
		re = eval('/' + re + '/ig')
		return s.match(re).length;
	} catch (e) {
		return false
	}
}

function writeXls(datas) {
	var buffer = xlsx.build([{
		name: 'sheet1',
		data: datas
	}]);
	fs.writeFileSync('fif.xlsx', buffer, {
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
	await page.evaluate(() => {
		window.location.href = 'http://weixin.sogou.com/weixin?type=2&ie=utf8&query=ds&tsn=5&ft=2018-08-01&et=2018-08-02&interation=&wxid=&usip='
	})
	// const oneday = await page.$('#time_enter')
	// await oneday.click()
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
	for (let i = 0; i < 10; i++) {
		await page.waitForSelector('.mun')
		await page.waitFor(500);
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
			const time = await page.$('#publish_time')
			await time.click();
			const AllInfo = await page.evaluate((getInfo, allHref, i) => {
				function patch(re, s) {
					try {
						re = eval('/' + re + '/ig')
						return s.match(re).length;
					} catch (e) {
						return false
					}
				}
				let img = document.querySelector('.share_media')
				if (img) {
					return
				}
				let content = document.querySelector('#page-content').innerText
				let Filter = patch('车', content)
				let thisInfo = {}
				let titleBool = document.querySelector('#activity-name')
				let share = document.querySelector('.share_notice')
				if (share || !titleBool || !(Filter)) {
					return
				}
				let getTime = document.querySelector('#publish_time').innerText
				let title = document.querySelector('#activity-name').innerText
				let author = document.querySelector('#js_name').innerText
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
		console.log(allXlsx)
		const pageHref = allHref.length
		console.log('pageHref', pageHref)
		await page.evaluate((pageHref) => {
			window.history.go(-pageHref)
		}, pageHref)
		await page.waitFor(1000);
		if (i < 9) {
			await page.waitForSelector('.mun')
			const nextPage = await page.$('#sogou_next');
			await nextPage.click();
			await page.waitFor(1000);
		}
	}
	writeXls(allXlsx);
	await browser.close();
});
