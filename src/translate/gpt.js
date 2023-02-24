const { convertName } = require('../utils/utils.js');
const { Configuration, OpenAIApi } = require("openai");

async function translate(text) {
  const configuration = new Configuration({
    apiKey: '',
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `请将以下中文句子翻译成英文，每个单词之间用一个空格分隔，且所有单词的总长度不超过20个字符，所有单词都需转换为小写：
    中文：${text}。
    英文：`,
    temperature: 0.3,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  const formatText = response.data.choices[0].text.replace(/[^\w\s]/gi, '').replace(/\n/g, "");
  console.log(convertName(formatText,'hump'));
  console.log(convertName(formatText, 'hump').length);
  // console.log(response.data.choices[0].text);
}
translate('测试');