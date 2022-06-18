function EditorManager (selectedEditor) {
    console.log("load previewEvent");
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
        saveCtrlElement.style.display = "";
        addfileCtrlElement.style.display = "";
        // moreCtrlElement.style.display = "";
        backCtrlElement.style.display = "none";
        refreshCtrlElement.style.display = "none";
        cutSreenCtrlElement.style.display = "none";
        changeEditor(selectedEditor.fileName);
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

        var inputEle = addFileItem.getElementsByTagName("input")[0];
        inputEle.focus();
        addFileItem.querySelectorAll("button").forEach((child) => {
            child.addEventListener("click", function (e) {
                switch (child.id) {
                    case "addfileCancel":
                        addFileItem.remove();
                        break
                    case "addfileSubmit":
                        var filename = inputEle.value;
                        if (!filename || filename == "") {
                            addFileItem.getElementsByClassName("error-msg")[0].innerText = strings["required"];
                            break
                        }
                        var fileType = getFileSuffix(filename) || 'file';
                        addFileLayout(filename, fileType);
                        saveCode(filename, fileType, "");
                        // 新增暂存的文件
                        allCodeTmp[filename] = {
                            "type": fileType,
                            "value": "",
                        }
                        allCode = getCode();
                        setTimeout(() => {
                            fileList.scrollLeft += 200;
                            addFileItem.remove();
                            changeEditor(filename)
                        }, 150)
                        break
                }
            });
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
            child.addEventListener("click", function (e) {
                console.log(e, e.target.innerHTML);
            });
        });
    }

    // 文件内容变更
    selectedEditor.getSession().on("change", (e) => {
        isChanged = checkChanged(lastValue, selectedEditor.getValue())
    })

    // 文件保存
    saveCtrlElement.onclick = (e) => {
        var saveCtrl = e.target;
        var curValue = selectedEditor.getValue();
        saveCtrl.dataset["type"] = selectedEditor.fileType;
        saveCtrl.dataset["file"] = selectedEditor.fileName;
        saveCode(selectedEditor.fileName, selectedEditor.fileType, curValue);
        allCode = getCode();
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

    // 获取文件项事件
    function registFileList (fileList) {
        var fileListNav = fileList.querySelectorAll(".open-file-list li");
        fileListNav.forEach((child) => {
            child.addEventListener("click", function (e) {
                activeFile.classList.remove("active");
                this.classList.add("active");
                var fileSpan = child.getElementsByClassName("text")[0];
                changeEditor(fileSpan.innerText);
            });
            // child.getElementsByClassName("cancel")[0].addEventListener("click", (e) => {
            //     child.remove();
            // })
        });
    }

    // 添加文件项的到dome
    function addFileLayout (fileName, fileType) {
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
            var fileType = getFileSuffix(filename) || 'file';
            addFileLayout(filename, fileType);
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

    // 切换tab的文件
    function changeEditor (fileName, id) {
        const output = document.querySelector(".output");
        selectedEditor.off("focus", updateFocus);
        if (output) output.style.visibility = "hidden";

        var file = allCodeTmp[fileName]
        var oldfile = allCode[fileName];
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
        selectedEditor.session.setValue(fileValue);
        selectedEditor.selection.cursor.setPosition(1);
        // 检测是否变化
        isChanged = checkChanged(fileValue, oldfile.value);
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