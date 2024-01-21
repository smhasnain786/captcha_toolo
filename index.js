const express = require("express");
const { captchaLogic } = require("./captchaLogic");
const cors = require('cors')
const path = require('path');
const app = express();
// app.use('/images', express.static(path.join(__dirname, 'uploads1')));
app.use(cors({
  origin: '*',
}));
const PORT = process.env.PORT || 4000;
console.log(path.join(__dirname, ''));
app.get("/urls/", (req, res) => {
  captchaLogic(res,req.query.url);
});
app.get("/img_name/:add", (req, res) => {
  captchaLogic(res,`https://client2024.brandanalysisindia.com/public/temp/${req.params.add}`);
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});