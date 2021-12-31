const vscode = require('vscode');
const { showQuickPick, onDidChangeTextEditorSelection, showInformationMessage, showWarningMessage, activeTextEditor, onDidChangeActiveTextEditor } = vscode.window;
const { registerCommand } = vscode.commands;
const { systemConfig: { SERVICE, BAIDU_APPID, BAIDU_KEY, SERVICE_LIST, IS_COPY, IS_REPLACE, RENAME_METHOD_NAME } } = require('./config/index.js');
const { convertName } = require('./utils/utils.js');
const { getConfiguration, onDidChangeConfiguration } = vscode.workspace;
// const config = getConfiguration();

// const getGoogleTransResult = require('./translate/google.js');

const getBaiduTransResult = require('./translate/baidu.js');


function activate(context) {
    let config = getConfiguration();
    let text = '';
    let active = activeTextEditor;

    // 获取选中的文本
    onDidChangeTextEditorSelection(({ textEditor, selections }) => {
        text = textEditor.document.getText(selections[0]);
    })

    //配置更改检测
    const disposeConfig = onDidChangeConfiguration(() => {
        console.log('配置变更了');
        config = getConfiguration();
    })

    const edit = onDidChangeActiveTextEditor((textEditor) => {
        console.log('activeEditor改变了');
        //更换激活的编辑器对象
        if (textEditor) {
            active = textEditor;
        }
    })

    //配置
    const disposeToken = registerCommand('translateVariable.translateConfig', async() => {

        //选择服务
        const selectedItem = await showQuickPick(SERVICE_LIST, {
            canPickMany: false
        })

        // 设置服务
        config.update(SERVICE, selectedItem, true);

    });

    //中译英
    registerCommand('translateVariable.toEN', async() => {
        const _text = text;

        //读取配置
        const isCopy = config.get(IS_COPY);
        const isReplace = config.get(IS_REPLACE);
        const renameMethodName = config.get(RENAME_METHOD_NAME);
        const service = config.get(SERVICE);
        const baiduAppid = config.get(BAIDU_APPID);
        const baiduKey = config.get(BAIDU_KEY);

        console.log('service in config', service);

        // 百度翻译检测
        if (service === 'baidu' && (!baiduAppid || !baiduKey)) {
            showWarningMessage(`请检查百度翻译appid或者key是否设置正确`)
        }

        // 处理翻译结果
        if (_text) {
            let response, responseText;

            // 百度翻译
            if (service === 'baidu') {
                console.log('baidu');
                response = await getBaiduTransResult(_text, { from: "zh", to: "en", appid: baiduAppid, key: baiduKey });
                responseText = response.dst;
            }

            let result = responseText.toLowerCase().trim();

            // 变量命名方式
            if (renameMethodName !== 'none') {
                result = convertName(result, renameMethodName);
            }

            // 是否复制翻译结果
            if (isCopy) {
                vscode.env.clipboard.writeText(result);
                showInformationMessage(`已复制百度翻译结果${_text} ==> ${result}`)
            }


            //是否替换原文
            if (isReplace) {
                let selectedItem = active.selection;
                active.edit(editBuilder => {
                    editBuilder.replace(selectedItem, result)
                })
            }
        }
    });

    // 划词翻译检测
    const disposeHover = vscode.languages.registerHoverProvider("*", {
        async provideHover(document, position, token) {
            const service = config.get(SERVICE);
            const baiduAppid = config.get(BAIDU_APPID);
            const baiduKey = config.get(BAIDU_KEY);


            let response, responseText;

            // 划中的词
            const selected = document.getText(active.selection);

            if (selected) {
                // 百度翻译
                if (service === 'baidu') {
                    response = await getBaiduTransResult(selected, { from: "auto", to: "zh", appid: baiduAppid, key: baiduKey });
                    responseText = response.dst;
                }
            }

            // 悬浮提示
            return new vscode.Hover(`${responseText}`);
        }
    })

    context.subscriptions.push(disposeToken);
    context.subscriptions.push(edit);
    context.subscriptions.push(disposeConfig);
    context.subscriptions.push(disposeHover);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}