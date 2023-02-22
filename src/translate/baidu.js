const md5 = require("md5");
const axios = require("axios");
const config = require('../config/index.js');
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

// 百度翻译
async function getBaiduTransResult(text = "", opt = {}) {
    const { from, to, appid, key } = opt;
    try {
        const q = text;
        const salt = parseInt(Math.random() * 1000000000);
        let str = `${appid}${q}${salt}${key}`;
        const sign = md5(str);
        const query = encodeURI(q);
        const params = `q=${query}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;
        const url = `${config.baiduBaseUrl}${params}`;
        // console.log(url);
        const res = await axios.get(url);
        console.log('百度翻译结果', res.data.trans_result[0]);
        return res.data.trans_result[0];
    } catch (error) {
        console.log({ error });
    }
}

module.exports = getBaiduTransResult;