const vscode = require('vscode');
const { showQuickPick, onDidChangeTextEditorSelection, showInputBox, showInformationMessage, activeTextEditor } = vscode.window;
const { registerCommand } = vscode.commands;
const { systemConfig: { SERVICE, BAIDU_APPID, BAIDU_KEY, SERVICE_LIST, IS_COPY, IS_REPLACE, IS_HUMP } } = require('./config/index.js');
const toHump = require('./utils/utils.js');
const { getConfiguration } = vscode.workspace;
const config = getConfiguration();

const getGoogleTransResult = require('./translate/google.js');

function activate(context) {
    let text = '';

    //读取配置
    const isCopy = config.get(IS_COPY);
    const isReplace = config.get(IS_REPLACE);
    const isHump = config.get(IS_HUMP);

    onDidChangeTextEditorSelection(({ textEditor, selections: [selection, ] }) => {
        text = textEditor.document.getText(selection);
    })

    let disposeToken = registerCommand('translateVariable.translateConfig', async() => {

        //选择谷歌或者百度
        const selectedItem = await showQuickPick(SERVICE_LIST, {
            canPickMany: false
        })

        // 设置服务
        config.update(SERVICE, selectedItem, true);

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

            //更新百度翻译配置
            config.update(BAIDU_APPID, inputAppid, true);
            config.update(BAIDU_KEY, inputKey, true);
        }

    });

    let disposeToEn = registerCommand('translateVariable.toEN', async() => {
        const _text = text;
        if (_text) {
            const response = await getGoogleTransResult(_text, { from: 'zh-cn', to: 'en' });
            let responseText = response.text;

            let result = responseText.toLowerCase().trim();
            showInformationMessage(`${_text} 翻译成 ${result}`);

            // 将多个字符串的转换为驼峰命名
            if (isHump) {
                result = toHump(result);
            }

            // 是否复制翻译结果
            if (isCopy) {
                vscode.env.clipboard.writeText(result);
            }
            // 是否替换原文
            if (isReplace) {
                activeTextEditor.edit((edit) => edit.replace(activeTextEditor.selection, result));
            }
        }
    });

    let disposeToCN = registerCommand('translateVariable.toCN', async() => {
        const _text = text;
        if (_text) {
            const response = await getGoogleTransResult(_text, { from: 'en', to: 'zh-cn' });
            let responseText = response.text;
            let result = responseText.toLowerCase().trim();
            showInformationMessage(`${_text} 翻译成 ${result}`);

            // 是否复制翻译结果
            if (isCopy) {
                vscode.env.clipboard.writeText(result);
            }
            // 是否替换原文
            if (isReplace) {
                activeTextEditor.edit((edit) => edit.replace(activeTextEditor.selection, result));
            }
        }
    });

    context.subscriptions.push(disposeToken);
    context.subscriptions.push(disposeToEn);
    context.subscriptions.push(disposeToCN);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}