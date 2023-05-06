import puppeteer from 'puppeteer';
import moment from 'moment';

const username = 'phancongtaicntt2@gmail.com';
const password = '10051999';
const projectName = 'EdgeProps';
const timeStart = '08:00';
const workingTime = '10';
const timeEnd = '19:00';
const job = 'react';
const status = 'ip';
const note = '';

const login = async (page) => {
  await page.goto('http://reports.pscds.com/login');

  // Set screen size
  await page.setViewport({ width: 1280, height: 1024 });

  await page.waitForSelector('#email')
  // Type into search box
  await page.type('#email', username, { delay: 30 });

  await page.waitForTimeout(500)

  await page.waitForSelector('#password')
  // Type into search box
  await page.type('#password', password, { delay: 30 });

  await page.waitForTimeout(500)

  await page.click('button[name="btn_submit"')

  await page.waitForSelector('.content')

  await page.waitForTimeout(800)

}

const addReport = async (page) => {
  await page.goto('http://reports.pscds.com/reports/add')

  await page.waitForSelector('#project_id')

  const projectValue = await page.evaluate((projectName) => {
    const projectOptionEls = Array.from(document.querySelectorAll("#project_id option"))
    const projectEl = projectOptionEls.find((e) => e.textContent === projectName)
    if (projectEl) {
      return Promise.resolve(projectEl.value)
    }
    return Promise.resolve(false)
  }, projectName)

  await page.select("#project_id", projectValue)

  await page.waitForTimeout(800)

  await page.click("#time_start", { count: 3 })

  await page.waitForTimeout(800)

  await page.type("#time_start", timeStart, { delay: 30 })

  await page.waitForTimeout(800)

  await page.click("#work_time", { count: 3 })

  await page.waitForTimeout(800)

  await page.type("#work_time", workingTime, { delay: 30 })

  await page.waitForTimeout(800)

  await page.click("#time_end", { count: 3 })

  await page.waitForTimeout(800)

  await page.type("#time_end", timeEnd, { delay: 30 })

  await page.waitForTimeout(800)

  await page.type("#job", job, { delay: 30 })

  await page.waitForTimeout(800)

  await page.select("#input-status", status)

  await page.waitForTimeout(800)

  await page.type("#notes", note, { delay: 30 })

  await page.waitForTimeout(800)

  await page.click("#btn_add")

  await page.waitForSelector(".box-body")

  await page.waitForTimeout(800)
}

const viewLastReport = async (page) => {
  await page.goto("http://reports.pscds.com/reports")

  await page.waitForTimeout(2000)

  await page.waitForSelector(".box-body")

  await page.click("#tbody-reports tr .btn-act .view-record")

  await page.waitForSelector("#input_project_id")

  await page.waitForTimeout(1000)

  await page.screenshot({ path: `screenshots/${moment(new Date()).format('DD-MM-YYYY h_mm_ss_a')}.jpeg` })
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      `--window-size=1280,1024`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ],
  });
  const page = await browser.newPage();

  await login(page);

  // await addReport(page)

  await viewLastReport(page)

  await browser.close();
})();