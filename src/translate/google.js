const translate = require('@vitalets/google-translate-api');
async function getGoogleTransResult(text, opt) {
  const { from, to } = opt;
  try {
    const result = await translate(text, { from: from, to: to });
    // console.log("[ 谷歌翻译 ]", result);
    return result.text;
  } catch (error) {
    console.log(error);
  }
}

module.exports = getGoogleTransResult