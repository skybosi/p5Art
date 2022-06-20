function EditorManager (selectedEditor) {
    console.log("load previewEvent");
    const prettier = require("ace/ext/beautify");

    var forceRender = false;
    var allCode = getCode(), //最新的被保存的
        allCodeTmp = deepClone(allCode), //暂存没有被保存的
        lastValue = selectedEditor.getValue(),
        isChanged = false;
    selectedEditor.container.oncontextmenu = function (e) {
        e = e || window.event;
        e.preventDefault();
        console.log("oncontextmenu")
        return false;
    }

    // 按钮dom
    var beautifyCtrlElement = document.getElementById("beautifyCtrl");
    var saveCtrlElement = document.getElementById("saveCtrl");
    var backCtrlElement = document.getElementById("backCtrl");
    var previewCtrlElement = document.getElementById("previewCtrl");
    var refreshCtrlElement = document.getElementById("refreshCtrl");
    var cutSreenCtrlElement = document.getElementById("cutSreenCtrl");
    var addfileCtrlElement = document.getElementById("addFileCtrl");
    var moreCtrlElement = document.getElementById("moreCtrl");
    var activeFile = document.querySelector(".active");
    selectedEditor.target = activeFile;

    // 文件列表
    const fileList = document.getElementById("fileList");
    if (fileList.children.length == 0) {
        loadFileList(allCode)
    } else {
        registFileList(fileList)
    }

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
        beautifyCtrlElement.style.display = "none";
        saveCtrlElement.style.display = "none";
        addfileCtrlElement.style.display = "none";
        // moreCtrlElement.style.display = "none";
        backCtrlElement.style.display = "";
        refreshCtrlElement.style.display = "";
        cutSreenCtrlElement.style.display = "";

        forceRender = false;
    }

    // 返回事件 TODO
    backCtrlElement.onclick = (e) => {
        beautifyCtrlElement.style.display = "";
        saveCtrlElement.style.display = "";
        addfileCtrlElement.style.display = "";
        // moreCtrlElement.style.display = "";
        backCtrlElement.style.display = "none";
        refreshCtrlElement.style.display = "none";
        cutSreenCtrlElement.style.display = "none";
        // 隐藏preview
        selectedEditor.off("focus", updateFocus);
        const output = document.querySelector(".output");
        if (output) output.style.visibility = "hidden";
    }

    cutSreenCtrlElement.onclick = (e) => {
        var output = document.querySelector(".output");
        console.log("cordova:", cordova)
        console.log("cordova platformId:", cordova.platformId)
        switch (cordova.platformId) {
            case "android":
                cordova.plugins.photoLibrary.requestAuthorization(
                    function (e) {
                        // User gave us permission to his library, retry reading it!
                        console.log("requestAuthorization ok", e)
                        saveImage(output.contentWindow._curElement.elt, "png").then(() => {
                            toast("已保存到相册")
                        }).catch(e => {
                            console.log("saveImage error:", e)
                            toast("保存相册失败")
                        })
                    },
                    function (err) {
                        console.log("requestAuthorization err", err)
                        toast("保存相册失败")
                    }, // if options not provided, defaults to {read: true}.
                    {
                        read: true,
                        write: true
                    }
                );
                break;
            case "browser":
                download(output.contentWindow._curElement.canvas.toDataURL(), `p5-${dateFormat("YYYY-mm-dd-HH-MM", new Date())}.jpg`)
                break;
            default:
                console.log("not support", cordova.platformId)
                break;
        }
    }

    // 刷新事件
    refreshCtrlElement.onclick = (e) => {
        e.target.style.display = "";
        updateDocument(true);
    }

    // 新增文件
    addfileCtrlElement.onclick = (e) => {
        var addFileItem = document.createElement("div");
        addFileItem.id = "addfileLayout"
        addFileItem.innerHTML = render(layouts["addFileLayout"]);
        document.body.appendChild(addFileItem);

        // 透明modal
        var modalItem = document.createElement("div")
        modalItem.style = "position: fixed;left: 0;top: 0;width: 100%;height: 100%;opacity: 0.5;background: #000;"
        document.body.appendChild(modalItem);

        modalItem.addEventListener("click", (e) => {
            addFileItem.remove();
            modalItem.remove();
        })

        var inputEle = addFileItem.getElementsByTagName("input")[0];
        inputEle.focus();
        addFileItem.querySelectorAll("button").forEach((child) => {
            child.onclick = (e) => {
                switch (child.id) {
                    case "addfileCancel":
                        addFileItem.remove();
                        modalItem.remove();
                        break
                    case "addfileSubmit":
                        var filename = inputEle.value.trim(), file = {}, isExist = false;
                        if (!filename || filename == "") {
                            addFileItem.getElementsByClassName("error-msg")[0].innerText = strings["required"];
                            break
                        } else if (allCode[filename]) {
                            isExist = true;
                            if (allCode[filename].hidden != 1) {
                                addFileItem.getElementsByClassName("error-msg")[0].innerText = strings["file exists"];
                                break
                            }
                            file = {
                                "type": allCode[filename].type,
                                "value": allCode[filename].value,
                            }
                        } else {
                            var fileType = getFileSuffix(filename) || 'file';
                            file = {
                                "type": fileType,
                                "value": "",
                            }
                        }
                        addFileLayout(filename, file.type, file.value);
                        allCode = saveCode(filename, file.type, file.value);
                        // 新增暂存的文件
                        allCodeTmp[filename] = file;
                        // 移动位置
                        setTimeout(() => {
                            fileList.scrollLeft += 200;
                            addFileItem.remove();
                            modalItem.remove();
                            changeEditor(filename)
                            if (isExist) {
                                alert(strings["remember opened files"])
                            }
                        }, 150)
                        break
                }
            };
        });
    }

    // 更多设置
    moreCtrlElement.onclick = (e) => {
        var moreItem = document.createElement("ul");
        moreItem.id = "moreLayout";
        moreItem.classList.add("context-menu", "scroll");
        moreItem.style = "inset: 6px 6px auto auto; transform-origin: right top;";
        moreItem.innerHTML = render(layouts["more"]);
        moreItem.onclick = (e) => {
            moreItem.remove()
        }
        document.body.appendChild(moreItem);
        moreItem.querySelectorAll("li").forEach((child) => {
            child.onclick = (e) => {
                console.log(e, e.target.innerHTML);
            };
        });
    }

    // 文件内容变更
    selectedEditor.getSession().on("change", (e) => {
        isChanged = checkChanged(lastValue, selectedEditor.getValue())
    })

    // 格式化代码
    beautifyCtrlElement.onclick = (e) => {
        prettier.beautify(selectedEditor.getSession());
    }

    // 文件保存
    saveCtrlElement.onclick = (e) => {
        var saveCtrl = e.target;
        var curValue = selectedEditor.getValue();
        saveCtrl.dataset["type"] = selectedEditor.fileType;
        saveCtrl.dataset["file"] = selectedEditor.fileName;
        allCode = saveCode(selectedEditor.fileName, selectedEditor.fileType, curValue);
        removeNotice();
        forceRender = true;
    }

    //js监听键盘ctrl+s快捷键保存
    selectedEditor.container.addEventListener('keydown', function (e) {
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            saveCtrlElement.click()
            return false;
        }
    });

    // 注册文件项事件
    function registFileList (fileList) {
        var fileListNav = fileList.querySelectorAll(".open-file-list li");
        fileListNav.forEach((child) => {
            child.onclick = (e) => {
                if (!activeFile.isEqualNode(e.currentTarget)) {
                    activeFile.classList.remove("active");
                    e.currentTarget.classList.add("active");
                    selectedEditor.target = e.currentTarget;
                }
                var fileName = child.getElementsByClassName("file-name")[0].innerText;
                changeEditor(fileName);
            };

            child.getElementsByClassName("cancel")[0].onclick = (e) => {
                dialog("文件管理", {
                    content: strings["delete"],
                    cb: (e) => {
                        var dialogBody = e.baseNode;
                        var errMsg = dialogBody.getElementsByClassName("error-msg")[0].innerText
                        if (isChanged) {
                            if (errMsg == "") {
                                dialogBody.getElementsByClassName("error-msg")[0].innerText = strings["ok"] + strings["delete"] + "?";
                                return false
                            } else { // 再次确认删除
                                console.log(strings["ok"] + strings["delete"] + "?");
                            }
                        }
                        removeCode(selectedEditor.fileName);
                        removeFileLayout(child, fileList)
                    }
                }, {
                    content: strings["close file"],
                    cb: (e) => {
                        var dialogBody = e.baseNode;
                        var errMsg = dialogBody.getElementsByClassName("error-msg")[0].innerText
                        if (isChanged) {
                            if (errMsg == "") {
                                dialogBody.getElementsByClassName("error-msg")[0].innerText = strings["unsaved file"];
                                return false
                            } else { // 再次确认关闭
                                console.log(strings["unsaved file"])
                            }
                        }
                        hiddenCode(selectedEditor.fileName);
                        removeFileLayout(child, fileList)
                    }
                })
                // 阻止冒泡
                e.stopPropagation();
            }
        });
    }

    function removeFileLayout (child) {
        try {
            var newFileItem, fileName = "";
            var parentElement = child.parentElement;
            // 处理fileItem的dom删除
            if (parentElement.children.length > 1) {
                if (child.isEqualNode(parentElement.firstElementChild)) { // 第一个
                    newFileItem = child.nextElementSibling
                } else if (child.isEqualNode(parentElement.lastElementChild)) { // 最后一个
                    newFileItem = child.previousSibling
                } else { // 中间的，往后取
                    newFileItem = child.nextElementSibling
                }
                newFileItem.classList.add("active")
                selectedEditor.target = newFileItem;
                fileName = newFileItem.getElementsByClassName("file-name")[0].innerText;
            }
            updateSelectEditor(fileName)
        } catch (error) {
            console.log(error)
        }
        child.remove()
    }

    // 添加文件项的到dome
    function addFileLayout (fileName, fileType, fileValue) {
        if (activeFile && activeFile.classList) {
            activeFile.classList.remove("active");
        }
        var fileItem = document.createElement("li");
        fileItem.classList.add("tile", "light", "active");
        fileItem.innerHTML = render(layouts["openFile"], {
            "file name": fileName,
            "file type": fileType,
        });
        activeFile = fileItem;
        fileList.appendChild(fileItem);
        selectedEditor.target = activeFile;

        updateSelectEditor(fileName, fileType, fileValue);
        registFileList(fileList);
    }

    // 加载所有文件的列表
    function loadFileList (allFile) {
        var list = Object.keys(allFile), newList = [];
        for (let i = 0; i < list.length; i++) {
            const filename = list[i];
            if (filename.indexOf('html') > 0) {
                newList.unshift(filename)
            } else if (filename.indexOf('css') > 0) {
                newList.push(filename)
            } else if (filename.indexOf('js') > 0) {
                newList.push(filename)
            } else {
                newList.push(filename)
            }

        }
        for (let i = 0; i < newList.length; i++) {
            const filename = newList[i];
            if (allFile[filename] && allFile[filename].hidden != 1) {
                var fileType = getFileSuffix(filename) || 'file',
                    fileValue = allCode[filename].value;
                addFileLayout(filename, fileType, fileValue);
            }
        }
    }

    // 检测文件是否变更
    function checkChanged (val, newVal) {
        allCodeTmp[selectedEditor.fileName] = {
            "type": selectedEditor.fileType,
            "value": newVal,
        }
        if (val !== newVal) {
            isChanged = true;
            addNotice();
        } else {
            isChanged = false;
            removeNotice();
        }
        return isChanged;
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

    // 渲染canvas
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
                if (!fileValue || typeof fileValue !== "string" || fileValue == "") {
                    continue;
                }
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
        var tilteText = document.getElementById("title-text")
        tilteText.dataset["subtext"] = type || "";
        tilteText.innerHTML = fileName;
        saveCtrlElement.dataset["file"] = fileName;
    }

    // 更新SelectEditor
    function updateSelectEditor (fileName, fileType, fileValue) {
        if (!fileName || fileName == "") {
            fileName = ""
            fileType = null
            fileValue = ""
        } else {
            // 补充代码
            if (!fileType || fileType == "") {
                fileType = getFileSuffix(fileName) || "file"
                var file = allCode[fileName];
                if (!file || !file.value) {
                    console.log("updateSelectEditor error!", fileName)
                    return
                }
                fileValue = file.value;
            }
        }
        // update view
        updateTitle(fileType, fileName);
        // update selectedEditor
        if (fileType && fileType != "") {
            selectedEditor.session.setMode(`ace/mode/${fileType}`)
        }
        lastValue = fileValue;
        selectedEditor.fileName = fileName;
        selectedEditor.fileType = fileType;
        selectedEditor.session.setValue(fileValue);
        selectedEditor.selection.cursor.setPosition(1);
    }

    // 切换tab的文件
    function changeEditor (fileName) {
        selectedEditor.off("focus", updateFocus);
        const output = document.querySelector(".output");
        if (output) output.style.visibility = "hidden";

        // 获取暂存代码文件
        var file = allCodeTmp[fileName]
        // 获取最近的已保存的文件
        var oldfile = allCode[fileName];

        // 更新SelectEditor
        updateSelectEditor(fileName, file.type, file.value)

        // 检测是否变化
        isChanged = checkChanged(file.value, oldfile.value);
        if (isChanged) {
            console.log("hhhhhhhhhhhhhhhhhhhhhhh")
        }
        lastValue = oldfile.value;
        // 清理undo
        selectedEditor.getSession().getUndoManager().reset();
        selectedEditor.on("focus", updateFocus);
        window.selectedEditor = selectedEditor;
    }

    // 下载文件
    function download (dataURL, filename) {
        var blob = _dataURLToBlob(dataURL);
        saveFile(blob, filename);
        function _dataURLToBlob (dataURL) {
            var parts = dataURL.split(';base64,');
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);
            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {
                type: contentType
            });
        }
    }

    // 保存文件
    function saveFile (data, filename) {
        var url = window.URL.createObjectURL(data);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // 保存图片到相册
    function saveImage (canvas, extension, encoderOptions) {
        return new Promise((resolve, reject) => {
            let mimeType;
            if (!extension) {
                extension = 'png';
                mimeType = 'image/png';
            } else {
                switch (extension.toLowerCase()) {
                    case 'png':
                        mimeType = 'image/png';
                        break;
                    case 'jpeg': case 'jpg':
                        mimeType = 'image/jpeg';
                        break;
                    default:
                        mimeType = 'image/png';
                        break;
                }
            }
            // file or remote URL. url can also be dataURL, but giving it a file path is much faster
            var url = canvas.toDataURL(mimeType, encoderOptions);
            var album = 'p5Art';
            cordova.plugins.photoLibrary.saveImage(url, album,
                (libraryItem) => {
                    console.log("saveImage", libraryItem)
                    resolve("ok");
                },
                (err) => {
                    console.log("saveImage err", err)
                    reject(err)
                }
            );
        });
    }

    function dateFormat (fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
}