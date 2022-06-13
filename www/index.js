(async function () {
    try {
        await aceLoaded();
    } catch (e) {
        console.log(e);
    }
    // Evaluate The Focus
    let isFocused = false;

    function evalFocus (selectedEditor) {
        if (isFocused) {
            selectedEditor.focus();
        }
    }

    function updateFocus () {
        isFocused = true;
    }

    function ToolsManager (selectedEditor) {
        const prettier = require("ace/ext/beautify");
        let textarea = selectedEditor.textInput.getElement();
        let altKey = false, shiftKey = false, ctrlKey = false;
        function toolsAction (id) {
            switch (id) {
                case "@": case "&": case "|":
                case "\\": case "/":
                case "``": case "~": case "()":
                case "{}": case "[]": case "^":
                    selectedEditor.insert(id)
                    break;
                case "ltgt":
                    selectedEditor.insert("<>")
                    break;
                case "PgUp":
                    simulateKey({
                        element: textarea,
                        keyCode: 33,
                    });
                    break;
                case "tab":
                    simulateKey({
                        element: textarea,
                        keyCode: 9,
                    });
                    break;
                case "shift":
                    shiftKey = true;
                    simulateKey({
                        element: textarea,
                        keyCode: 16,
                        shiftKey: shiftKey,
                    });
                    break;
                case "ctrl":
                    ctrlKey = true;
                    simulateKey({
                        element: textarea,
                        keyCode: 17,
                        ctrlKey: ctrlKey,
                    });
                    break;
                case "alt":
                    altKey = true
                    simulateKey({
                        element: textarea,
                        keyCode: 224,
                        ctrlKey: altKey,
                    });
                    break;
                case "PgDown":
                    simulateKey({
                        element: textarea,
                        keyCode: 34,
                    });
                    break;
                case "Esc":
                    simulateKey({
                        element: textarea,
                        keyCode: 27,
                    });
                    break;
                case "undo":
                    selectedEditor.undo();
                    break;
                case "redo":
                    selectedEditor.redo();
                    break;
                case "copyLinesUp":
                    selectedEditor.copyLinesUp();
                    break;
                case "copyLinesDown":
                    selectedEditor.copyLinesDown();
                    break;
                case "moveDown":
                    selectedEditor.moveLinesDown();
                    break;
                case "moveUp":
                    selectedEditor.moveLinesUp();
                    break;
                case "beautify":
                    prettier.beautify(selectedEditor.getSession());
                    break;
                case "search":
                    simulateKey({
                        element: textarea,
                        keyCode: 72,
                        ctrlKey: true,
                    });
                    break;
                case "menu":
                    simulateKey({
                        element: textarea,
                        keyCode: 112,
                    });
                    break;
                case "arrowUp":
                    simulateKey({
                        element: textarea,
                        keyCode: 38,
                    });
                    break;
                case "arrowDown":
                    simulateKey({
                        element: textarea,
                        keyCode: 40,
                    });
                    break;
                case "arrowLeft":
                    simulateKey({
                        element: textarea,
                        keyCode: 37,
                    });
                    break;
                case "arrowRight":
                    simulateKey({
                        keyCode: 39,
                        element: textarea,
                    });
                    break;
                case "selectWord":
                    simulateKey({
                        element: textarea,
                        keyCode: 39,
                        ctrlKey: true,
                        altKey: true,
                    });
                    break;
            }
            evalFocus(selectedEditor);
        }
        // Process the events of tools
        selectedEditor.on("focus", updateFocus);
        document.querySelectorAll(".quick-tools button").forEach((btn) => {
            if (btn.id === "picker") return;
            btn.addEventListener("click", function () {
                toolsAction(this.id);
            });
        });
    }

    function EditorManager (selectedEditor) {
        console.log("load previewEvent");
        var forceRender = false;
        var allCode = getCode();

        // 按钮dom
        var saveCtrlElement = document.getElementById("saveCtrl");
        var backCtrlElement = document.getElementById("backCtrl");
        var previewCtrlElement = document.getElementById("previewCtrl");
        var refreshCtrlElement = document.getElementById("refreshCtrl");
        var addfileCtrlElement = document.getElementById("addFileCtrl");
        var moreCtrlElement = document.getElementById("moreCtrl");
        var activeFile = document.querySelector(".active");
        selectedEditor.target = activeFile;

        // 文件列表
        const fileList = document.getElementById("fileList");
        const fileListNav = document.querySelectorAll(".open-file-list li");
        fileListNav.forEach((child) => {
            child.addEventListener("click", function (e) {
                activeFile.classList.remove("active");
                this.classList.add("active");
                var fileSpan = child.getElementsByClassName("text")[0];
                changeEditor(child.dataset.id, fileSpan.innerText);
            });
        });

        // 启动渲染页面
        previewCtrlElement.onclick = () => {
            const output = document.querySelector(".output");
            if (forceRender) {
                if (output) output.remove();
                updateDocument(forceRender);
            } else {
                if (output) {
                    output.style.visibility = "";
                } else {
                    updateDocument(forceRender);
                }
            }
            // 显示返回页面
            saveCtrlElement.style.display = "none";
            addfileCtrlElement.style.display = "none";
            backCtrlElement.style.display = "";
            refreshCtrlElement.style.display = "";
            forceRender = false;
        }

        // 返回事件 TODO
        backCtrlElement.onclick = (e) => {
            saveCtrlElement.style.display = "";
            addfileCtrlElement.style.display = "";
            backCtrlElement.style.display = "none";
            refreshCtrlElement.style.display = "none";
            changeEditor("editorJs", "sketch.js");
        }

        // 刷新事件
        refreshCtrlElement.onclick = (e) => {
            e.target.style.display = "";
            updateDocument(true);
        }

        // 新增文件
        addfileCtrlElement.onclick = (e) => {
            var placehodler = "请输入文件", cancel = "取消", submit = "确定";
            var addFileItem = document.createElement("div");
            addFileItem.id = "addfileLayout"
            addFileItem.innerHTML = render(layouts["addFileLayout"], { placehodler, cancel, submit });
            addFileItem.onclick = (e) => {
                activeFile.classList.remove("active");
                var fileItem = document.createElement("li");
                fileItem.classList.add("tile", "light", "active");
                var fileName = "test.js", fileType = "javascript";
                fileItem.innerHTML = render(layouts["openFile"], { fileName, fileType });
                activeFile = fileItem;
                fileList.appendChild(fileItem);
                setTimeout(() => {
                    fileList.scrollLeft += 200;
                    addFileItem.remove();
                }, 150)
            }
            document.body.appendChild(addFileItem);
        }

        // 更多设置
        moreCtrlElement.onclick = (e) => {
            var openRecent = "打开最近", settings = "设置", help = "帮助", exit = "退出"
            var moreItem = document.createElement("ul");
            moreItem.id = "moreLayout";
            moreItem.classList.add("context-menu", "scroll");
            moreItem.style = "inset: 6px 6px auto auto; transform-origin: right top;";
            moreItem.innerHTML = render(layouts["more"], { openRecent, settings, help, exit });
            moreItem.onclick = (e) => {
                moreItem.remove()
            }
            document.body.appendChild(moreItem);
        }

        // 文件内容变更
        selectedEditor.on("change", (e) => {
            addNotice();
        })

        // 文件保存
        saveCtrlElement.onclick = (e) => {
            var saveCtrl = e.target;
            saveCtrl.dataset["type"] = selectedEditor.fileType;
            saveCtrl.dataset["file"] = selectedEditor.fileName;
            saveCode(selectedEditor.fileName, selectedEditor.fileType, selectedEditor.getValue());
            allCode = getCode();
            removeNotice();
            forceRender = true;
        }

        // 删除变更提示点
        function removeNotice () {
            saveCtrl.classList.remove("notice");;
            selectedEditor.target.classList.remove("notice");
        }

        // 添加变更提示点
        function addNotice () {
            selectedEditor.target.classList.add("notice");
            saveCtrlElement.classList.add("notice");
        }

        // Preview the code that has written
        function updateDocument (forceRender = false) {
            var output = document.querySelector(".output");
            if (!output) {
                output = document.createElement("iframe");
            } else {
                if (!forceRender) {
                    output.style.visibility = ""
                    return
                }
            }
            // saveCode({ css: editorCSS, js: editorJS, html: editorHTML });
            document.body.appendChild(output);
            output.className = "output";
            output.frameBorder = 0;
            const frame = output.contentDocument;
            console.log(output);
            const newFrame = frame.open();
            const erudaScript = document.createElement("script");
            const erudaInit = document.createElement("script");
            erudaScript.defer = !0;
            erudaInit.defer = !0;
            erudaScript.src = "js/libs/eruda/eruda-2.4.1.js";
            erudaInit.innerHTML = `eruda.init({
                tool: ["console","elements","network","resources", "sources", "info"],
                defaults: {
                displaySize: 60
        }});`
            newFrame.write("<head></head>");
            newFrame.write("<body></body>");
            newFrame.body.appendChild(erudaScript);
            erudaScript.onload = function (e) {
                newFrame.head.appendChild(erudaInit);
                for (const fileName in allCode) {
                    const element = allCode[fileName];
                    if (!element.type) continue;
                    const fileType = element.type.toLowerCase();
                    const fileValue = element.value
                    switch (fileType) {
                        case "css":
                            newFrame.head.innerHTML += `<style>${fileValue}</style>`;
                            break;
                        case "html":
                            newFrame.write(fileValue);
                            break;
                        case "js": case "javascript":
                            newFrame.write(`<script>${fileValue}<\/script>`);
                            break;
                        default:
                            console.log("error file type!");
                            break;
                    }
                }
                frame.close();
            };
        }

        // 更新文件标题
        function updateTitle (type, fileName) {
            var tilteText = document.getElementById("tilte-text")
            tilteText.dataset["subtext"] = type || "";
            tilteText.innerHTML = fileName;
            saveCtrlElement.dataset["file"] = fileName;
        }

        // Add Event dynamically om the navigation
        function changeEditor (id, fileName) {
            const output = document.querySelector(".output");
            selectedEditor.off("focus", updateFocus);
            if (output) output.style.visibility = "hidden";

            var file = allCode[fileName];
            // update view
            var fileValue = file.value, fileType = file.type;
            selectedEditor.fileName = fileName;
            selectedEditor.fileType = fileType;
            updateTitle(fileType, fileName);

            // active file view
            activeFile = document.querySelector(".active")
            selectedEditor.target = activeFile;

            // update selectedEditor
            selectedEditor.session.setMode(`ace/mode/${fileType}`)
            selectedEditor.setValue(fileValue);
            selectedEditor.selection.cursor.setPosition(1);
            removeNotice();
            selectedEditor.on("focus", updateFocus);
            window.selectedEditor = selectedEditor;
        }
    }

    // 拾色器
    function PickerView (selectedEditor) {
        const pk = document.querySelector("#picker");
        pk.addEventListener("click", function () {
            const pkParent = document.querySelector("#pickerLayout");
            // 如果存在，删除老的防止无限插入picker
            if (pkParent.children.length > 0) {
                pkParent.children[0].remove();
            }
            var color = "gold";
            var colorObj = selectedEditor.lastSelectColor;
            if (colorObj && colorObj.printHex) {
                color = colorObj.printHex()
            }
            const picker = new Picker({
                parent: pkParent,
                color: color,
                editor: true,
            });
            picker.setColor(color);
            picker.settings.popup = "top";
            picker.destroy();
            picker.show();
            picker.onDone = function (color) {
                selectedEditor.lastSelectColor = color;
                selectedEditor.insert(color.printHex());
            };
        });
    }

    // 构造自动补全集合
    function loadAutoComplete () {
        const acOBJ = p5_autocomplete;
        // propose trimmed list/script to https://github.com/processing/p5.js/issues/3666
        let acList = [];
        let curFunction = '';

        // cycle through auto complete list
        acOBJ.code.forEach(function (ac) {
            // if method/function
            if (ac.t == 'm') {
                // add once without params for easy adding
                if (ac.n != curFunction) {
                    acList.push({ 'cap': ac.n + '()', 'snip': ac.n + '()' });
                    curFunction = ac.n;
                }

                // add w/ params using tab feature
                let acParamsTab = []
                for (let i = 0; i < ac.p.length; i++) {
                    acParamsTab.push('${' + (i + 1) + ':' + ac.p[i] + '}');
                }
                let acParamsListTab = ac.n + '(' + acParamsTab.join(', ') + ')';
                let acParamsList = ac.n + '(' + ac.p.join(', ') + ')';
                acList.push({ 'cap': acParamsList, 'snip': acParamsListTab });
            } else {
                // add constants/misc
                acList.push({ 'cap': ac.n, 'snip': ac.n });
            }
        });

        // create custom completer
        var completer = {
            getCompletions: function (editor, session, pos, prefix, callback) {
                var text = editor.getValue(); if (prefix.length === 0) { callback(null, []); return }
                var completions = [];
                for (let wl of acList) {
                    completions.push({ caption: wl.cap, snippet: wl.snip, meta: 'p5', score: 1 });
                }
                callback(null, completions);
            }
        }

        // add list to auto completer
        const langTools = require('ace/ext/language_tools');
        langTools.addCompleter(completer);
    }

    function loadAce () {
        function aceMixin (config) {
            const { mode = "javascript", parent } = config;
            const editor = ace.edit(parent);
            const em = require("ace/ext/emmet");
            editor.session.setMode(`ace/mode/${mode}`);
            editor.session.setTabSize(2);
            editor.setOptions({
                fontSize: "0.7rem",
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                enableEmmet: true,
                wrap: true,
                theme: "ace/theme/monokai",
                useSoftTabs: false,
            });
            console.log(editor)
            loadAutoComplete();
            editor.commands.removeCommand("showSettingsMenu");
            editor.setShowPrintMargin(false);
            return editor;
        }
        const selectedEditor = aceMixin({ mode: "javascript", parent: "editor-container", });

        // 初始代码
        loadInitialCode();

        // Fix the keyboard issue
        let defaultFile = "sketch.js"
        const oldHeight = window.innerHeight;
        window.onresize = function () {
            if (this.innerHeight === oldHeight) {
                isFocused = false;
            }
        }
        selectedEditor.setValue(getCodeValue(defaultFile), 1);
        selectedEditor.fileName = defaultFile;
        selectedEditor.fileType = "javascript";
        window.selectedEditor = selectedEditor;

        ace.config.loadModule("ace/snippets/snippets", function () {
            const snippetManager = ace.require("ace/snippets").snippetManager;
            document.body.onclick = function () {
                ace.config.loadModule("ace/snippets/javascript", function (m) {
                    if (m) {
                        m.snippets.push(...snippets);
                        snippetManager.register(m.snippets, m.scope);
                    }
                });
                document.body.onclick = null;
            };
        });

        // 拾色器
        PickerView(selectedEditor);

        // 编辑器
        EditorManager(selectedEditor);

        // 工具栏
        ToolsManager(selectedEditor);
    }

    // If the ace is not loaded offline message will apper
    if (typeof ace !== "undefined") {
        loadAce();
    } else {
        document.querySelector(".loading-screen h2").innerHTML =
            "You are offline 😪";
    }
})();
