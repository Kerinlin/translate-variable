const config = {
    baiduBaseUrl: 'http://api.fanyi.baidu.com/api/trans/vip/translate?',
    youdaoBaseUrl: 'https://openapi.youdao.com/api',
    lingvaUrl: 'https://lingva.ml/api/v1',
    bingUrl: 'https://cn.bing.com/dict/clientsearch',
    defaultFrom: 'en',
    defaultTo: 'zh-cn',
    systemConfig: {
        SERVICE: 'translateVariable.service',
        BAIDU_APPID: 'translateVariable.baiduAppid',
        BAIDU_KEY: 'translateVariable.baiduKey',
        YOUDAO_APPID: 'translateVariable.youdaoID',
        YOUDAO_KEY: 'translateVariable.youdaoKey',
        IS_REPLACE: 'translateVariable.isReplace',
        IS_COPY: 'translateVariable.isCopy',
        RENAME_METHOD_NAME: 'translateVariable.renameMethodName',
        SERVICE_LIST: ['baidu','lingva','youdao','google','bing','openai'],
        TRANS_HOVER: 'translateVariable.isTransHover',
        OPENAI_TOKEN: 'translateVariable.openaiToken'
    },

}

module.exports = config