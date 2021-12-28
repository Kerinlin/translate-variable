const config = {
    googleBaseUrl: 'https://translate.google.cn/translate_a/single',
    defaultFrom: 'en',
    defaultTo: 'zh-cn',
    systemConfig: {
        SERVICE: 'translateVariable.service',
        BAIDU_APPID: 'translateVariable.baiduAppid',
        BAIDU_KEY: 'translateVariable.baiduKey',
        IS_REPLACE: 'translateVariable.isReplace',
        IS_COPY: 'translateVariable.isCopy',
        IS_HUMP: 'translateVariable.isHump',
        SERVICE_LIST: ['google', 'baidu']
    },

}

module.exports = config