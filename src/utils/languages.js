const langs = {
    'auto': 'Automatic',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'en': 'English',
};

const getCode = desiredLang => {
    if (!desiredLang) {
        return false;
    }
    desiredLang = desiredLang.toLowerCase();

    if (langs[desiredLang]) {
        return desiredLang;
    }

    const keys = Object.keys(langs).filter(function(key) {
        if (typeof langs[key] !== 'string') {
            return false;
        }

        return langs[key].toLowerCase() === desiredLang;
    });

    return keys[0] || false;
}


function isSupported(desiredLang) {
    return Boolean(getCode(desiredLang));
}

module.exports = langs;
module.exports.isSupported = isSupported;
module.exports.getCode = getCode;