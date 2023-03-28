const { Configuration, OpenAIApi } = require("openai");

// type: translate hover
async function getAiTranslate(type, text, key) {
  let result;
  const configuration = new Configuration({
    apiKey: key,
  });
  const openai = new OpenAIApi(configuration);

  // 翻译中文变量
  if (type == 'translate') {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `请将 "${text}" 翻译成简短的英文变量，每个词语之间用一个空格分隔，所有单词都需转换为小写，不要解释，直接给出翻译后的结果`
      }]
    });
    result = response.data.choices[0].message.content.replace(/[^\w\s]/gi, '').replace(/\n/g, "");
  }

  // 划词翻译
  if (type == 'hover') {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `下面我让你来充当翻译家，你的目标是把任何语言翻译成中文，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式。请翻译下面这句话："${text}"`
      }]
    });
    result = response.data.choices[0].message.content;
  }

  return result
}
module.exports = getAiTranslate