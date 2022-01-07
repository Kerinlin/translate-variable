
const config = require('../config/index.js');
const { createHash } = require('crypto');
const qs = require('querystring');
const axios = require("axios");

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

function getInput(text) {
  if (!text) {
    return;
  }
  let input;
  const strLength = text.length;
  if (strLength <= 20) {
    input = text;
  } else {
    input = `${text.substring(0, 10)}${strLength}${text.substring(strLength - 10, strLength)}`;
  }
  return input;
}

async function getYouDaoTransResult(text, opt = {}) {
  const { from, to, appid, secretKey } = opt;
  const input = getInput(text);
  const salt = (new Date).getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const str = `${appid}${input}${salt}${curtime}${secretKey}`;
  const sign = hash(str);
  const params = {
    q: text,
    appKey: appid,
    salt: salt,
    from: from,
    to: to,
    sign: sign,
    signType: "v3",
    curtime: curtime,
  }
  try {
    const res = await axios.post(config.youdaoBaseUrl, qs.stringify(params));
    console.log(`有道翻译结果 ${res.data.translation[0]}`);
    return res.data.translation[0];
  }
  catch (err) {
    console.log(error);
  }
}

module.exports = getYouDaoTransResult
