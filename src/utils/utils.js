function toHump(str) {
    if (!str) {
        return
    }
    const strArray = str.split(' ');
    const firstLetter = [strArray.shift()];
    const newArray = strArray.map(item => {
        return `${item.substring(0,1).toUpperCase()}${item.substring(1)}`;
    })
    const result = firstLetter.concat(newArray).join('');
    return result;
}

module.exports = {
    toHump
};