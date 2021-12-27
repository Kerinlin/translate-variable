const vscode = require('vscode');
const { showQuickPick, onDidChangeTextEditorSelection, showInputBox, showInformationMessage, activeTextEditor } = vscode.window;
const { registerCommand } = vscode.commands;
const { getConfiguration } = vscode.workspace;

const transTokenArray = ['google', 'baidu']

function activate(context) {
    let text = '';

    onDidChangeTextEditorSelection(({ textEditor, selections: [selection, ] }) => {
        // 获取选中的文字
        text = textEditor.document.getText(selection);
    })

    let disposeToken = registerCommand('translateVariable.translateConfig', async function() {

        //读取配置文件
        let config = getConfiguration();

        //选择谷歌或者百度
        const selectedItem = await showQuickPick(transTokenArray, {
            canPickMany: false
        })

        // console.log('select', selectedItem);
        // 设置服务
        config.update('translateVariable.service', selectedItem, true);

        // 配置百度翻译
        if (selectedItem === 'baidu') {
            const inputAppid = await showInputBox({
                password: false, // 输入内容是否是密码
                ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
                placeHolder: '请输入百度翻译appid', // 在输入框内的提示信息
            })
            const inputKey = await showInputBox({
                password: false, // 输入内容是否是密码
                ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
                placeHolder: '请输入百度翻译Key', // 在输入框内的提示信息
            })
            config.update('translateVariable.baiduAppid', inputAppid, true);
            config.update('translateVariable.baiduKey', inputKey, true);
        }

    });

    let disposeToEn = registerCommand('translateVariable.toEN', function() {
        const _text = text;
        setTimeout(() => {
            _text && translate(_text)
                .then(response => {
                    let res = response.toLowerCase().trim();
                    showInformationMessage(`${_text} 翻译成 ${response}`);
                    vscode.env.clipboard.writeText(res);
                    activeTextEditor.edit((edit) => edit.replace(activeTextEditor.selection, res));
                })
        }, 20);
    });

    let disposeToCN = registerCommand('translateVariable.toCN', function() {
        const _text = text;
        setTimeout(() => {
            _text && translate(_text)
                .then(response => {
                    let res = response.toLowerCase().trim();
                    showInformationMessage(`${_text} 翻译成 ${response}`);
                    vscode.env.clipboard.writeText(res)
                })
        }, 20);
    });

    context.subscriptions.push(disposeToken);
    context.subscriptions.push(disposeToEn);
    context.subscriptions.push(disposeToCN);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}