const axios = require("axios");
const config = require('../config/index.js');
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

// lingva翻译
async function getLingvaResult(text = "", opt = {}) {
    const { from, to } = opt;
    try {
        const query = encodeURI(text);
        const url = `${config.lingvaUrl}/${from}/${to}/${query}`;
        // console.log(url);
        const res = await axios.get(url);
        console.log('lingva翻译结果', res.data.translation);
        const result = res.data && res.data.translation;
        return result;
    } catch (error) {
        console.log({ error });
    }
}

module.exports = getLingvaResult;