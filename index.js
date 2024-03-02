const express = require('express');
const app = express();
const cors = require('cors')
const { Cluster } = require('puppeteer-cluster');
app.use(cors({
  origin: '*',
}));
bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    puppeteerOptions: {
      headless: false
    },
    debug: true,
  });
  await cluster.task(async ({ page, data: url }) => {
    // console.log(url);
    
    const address = url
    await page.goto(`https://lens.google.com/uploadbyurl?url=${address}&ep=cntpubu&hl=en-US&st=1708596832037&cd=CKG1yQEIlbbJAQijtskBCKmdygEI0qDKAQi0kMsBCJOhywEIhaDNAQji7M0BCMzuzQEItPXNAQjs980BCM_8zQEY9cnNARic-M0BGMr4zQE&re=df&s=4`);
    const textButton = await page.waitForSelector('#ucj-3', { timeout: 5000 });
    await textButton.click()
    await page.waitForSelector('.QeOavc', { timeout: 5000 })
    let element = await page.waitForSelector('[dir="ltr"]')
    const text = await page.evaluate(el => {
      const spanElement = el.querySelector('div.QeOavc > [dir="ltr"]');
      return spanElement.textContent;
    }, element);

    console.log(text);
    return text

  });

  // setup server
  app.get('/', async function (req, res) {
    if (!req.query.url) {
      return res.end('Please specify url like this: ?url=example.com');
    }
    try {
      const screen = await cluster.execute(req.query.url);
      console.log(">>>>>>>>>>>>>", screen);
      res.json({ url: req.query.url, screen: screen});
    } catch (err) {
      res.json({ url: req.query.url, screen: "cant solve", err: err.message });
    }
  });

  app.listen(3000, function () {
    console.log('Screenshot server listening on port 3000.');
  });
})();
