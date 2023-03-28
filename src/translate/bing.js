const axios = require("axios");
const config = require('../config/index.js');
const cheerio = require("cheerio");
function fetchDOM(url) {
  return axios
    .get(url, {
      withCredentials: false
    })
    .then(({ data }) => data);
}

async function getBingTransResult(text) {
  try {
    let result = {};
    const query = encodeURI(text);
    let url = `${config.bingUrl}?mkt=zh-CN&setLang=zh&form=BDVEHC&ClientVer=BDDTV3.5.1.4320&q=${query}`;
    const res = await fetchDOM(url);
    const $ = cheerio.load(res);
    const resultChDom = $(".client_sen_cn>.client_sen_word");
    const resultEnDom = $(".client_sen_en>.client_sen_word");
    if (resultChDom) {
      result.zh = resultChDom.text();
    }
    if (resultEnDom) {
      result.en = resultEnDom.text();
    }
    console.log('bing翻译结果',result);
    return result;
  } catch (error) {
    console.log(error);
  }
}
module.exports = getBingTransResult;