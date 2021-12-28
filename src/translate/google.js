const qs = require('querystring');
const got = require('got');
const safeEval = require('safe-eval');
const googleToken = require('google-translate-token');
const languages = require('../utils/languages.js');
const config = require('../config/index.js');

// 获取请求url
async function getRequestUrl(text, opts) {
    let token = await googleToken.get(text);
    const data = {
        client: 'gtx',
        sl: opts.from,
        tl: opts.to,
        hl: opts.to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 7,
        q: text
    };
    data[token.name] = token.value;
    const requestUrl = `${config.googleBaseUrl}?${qs.stringify(data)}`;
    return requestUrl;
}

//处理返回的body
async function handleBody(url, opts) {
    console.log('url', url);
    const result = await got(url);
    let resultObj = {
        text: '',
        from: {
            language: {
                didYouMean: false,
                iso: ''
            },
            text: {
                autoCorrected: false,
                value: '',
                didYouMean: false
            }
        },
        raw: ''
    };

    if (opts.raw) {
        resultObj.raw = result.body;
    }
    const body = safeEval(result.body);

    // console.log('body', body);
    body[0].forEach(function(obj) {
        if (obj[0]) {
            resultObj.text += obj[0];
        }
    });

    if (body[2] === body[8][0][0]) {
        resultObj.from.language.iso = body[2];
    } else {
        resultObj.from.language.didYouMean = true;
        resultObj.from.language.iso = body[8][0][0];
    }

    if (body[7] && body[7][0]) {
        let str = body[7][0];

        str = str.replace(/<b><i>/g, '[');
        str = str.replace(/<\/i><\/b>/g, ']');

        resultObj.from.text.value = str;

        if (body[7][5] === true) {
            resultObj.from.text.autoCorrected = true;
        } else {
            resultObj.from.text.didYouMean = true;
        }
    }
    return resultObj;
}

//翻译
async function translate(text, opts) {
    opts = opts || {};
    opts.from = opts.from || 'auto';
    opts.to = opts.to || 'en';

    opts.from = languages.getCode(opts.from);
    opts.to = languages.getCode(opts.to);

    try {
        const requestUrl = await getRequestUrl(text, opts);
        const result = await handleBody(requestUrl, opts);
        return result;
    } catch (error) {
        console.log(error);
    }
}

// 获取翻译结果
const getGoogleTransResult = async(originText, ops = {}) => {
    const { from, to } = ops;
    try {
        const result = await translate(originText, { from: from || config.defaultFrom, to: to || defaultTo });
        return result;
    } catch (error) {
        console.log(error);
        console.log('翻译失败');
    }
}

module.exports = getGoogleTransResult;