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
const puppeteer = require('puppeteer');
puppeteer.launch({
	ignoreHTTPSErrors: true,
	headless: false,
	slowMo: 250,
	timeout: 0
}).then(async browser => {

	let page = await browser.newPage();
	await page.setJavaScriptEnabled(true);
	await page.goto('http://chongqing.bitauto.com/');
	const searchInput = await page.$('#sug_txtkeyword');
	await searchInput.focus(); //定位到搜索框
	await page.setViewport({
		width: 1920,
		height: 1080
	});
	await page.keyboard.type('DS');
	const searchBtn = await page.$('#sug_submit');
	await searchBtn.click();
	await page.waitFor(2000);
	const ulGet = await page.frames()
	await page.evaluate(() => {
		console.info('ooo', ulGet)
	}, ulGet);
	// await page.waitForSelector('.all-wy-box')
	// const searchTime = await page.$('#time')
	// await searchTime.click()
	// const oneday = await page.$('#time_enter')
	// await oneday.click()
	// await sleep(5000)
	// await page.screenshot({
	// 	path: 'example.png'
	// });

	await browser.close();
});
