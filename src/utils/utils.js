function convertName(str, type = 'none') {

    // 默认没有设置就返回原字符
    let result = str;
    if (!str) {
        return
    }

    const strArray = str.split(' ');


    if (type === 'hump') {
        const firstLetter = [strArray.shift()];
        const newArray = strArray.map(item => {
            return `${item.substring(0, 1).toUpperCase()}${item.substring(1)}`;
        })
        result = firstLetter.concat(newArray).join('');
    }

    if (type === 'underline') {
        result = strArray.join('_');
    }

    return result;
}



module.exports = {
    convertName
};