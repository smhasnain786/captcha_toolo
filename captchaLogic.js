const puppeteer = require("puppeteer");
const fs = require('fs');
const { log } = require("console");
require("dotenv").config();
let b1 = false
let b2 = false
let b3 = false
const captchaLogic = async (res, url) => {
  console.log(url);
  const address=url
  
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
      '--disable-gpu',
      '--remote-debugging-port=9222'
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://www.google.com.my/imghp');
    console.log('Google Image Search page loaded');
    const button = await page.waitForSelector('div.dRYYxd > div.nDcEnd');
    console.log(button);
    await button.click();
    console.log('Button clicked1');
    await button.click();
    await button.click();
    await button.click();
    console.log('Button clicked2');
    console.log(url);
    await page.$eval('.cB9M7',( el , address )=> el.value = address , address);
    setTimeout(async () => {
      const submit = await page.waitForSelector('div.Qwbd3');
      console.log('----------->', submit);
      await submit.click();
    }, 3000)
    await page.waitForNavigation();
    const textButton = await page.waitForSelector('#ucj-3');
    console.log('<---------,', textButton);
    await textButton.click()
    await page.waitForSelector('.QeOavc')
    let element = await page.waitForSelector('[dir="ltr"]')
   
    const text = await page.evaluate(el => {
      const spanElement = el.querySelector('div.QeOavc > [dir="ltr"]');
      b2 = true
      return spanElement.textContent;
    }, element);
    
    console.log(text);

    setTimeout(async () => {
  
      if (text.length > 4) {
        browser.close();
        res.send({ captcha: text })
      } else {
        browser.close();
        res.send({URL: url,  captcha: "captcha is unreadable" })
      }
    }, 5000)


  } catch (e) {
    console.error(e);
    browser.close();

    // scrapeLogic(res)
    res.send(`Something went wrong while running: ${e}`);
  } finally {
    // await browser.close();
  }
};

module.exports = { captchaLogic };