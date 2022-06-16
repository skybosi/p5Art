function EditorManager (selectedEditor) {
    console.log("load previewEvent");
    var forceRender = false;
    var allCode = getCode();

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
        moreCtrlElement.style.display = "none";
        backCtrlElement.style.display = "";
        refreshCtrlElement.style.display = "";
        cutSreenCtrlElement.style.display = "";

        forceRender = false;
    }

    // 返回事件 TODO
    backCtrlElement.onclick = (e) => {
        saveCtrlElement.style.display = "";
        addfileCtrlElement.style.display = "";
        moreCtrlElement.style.display = "";
        backCtrlElement.style.display = "none";
        refreshCtrlElement.style.display = "none";
        cutSreenCtrlElement.style.display = "none";
        changeEditor("editorJs", "sketch.js");
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
                        saveImage(output.contentWindow._curElement.elt, "png")
                            .then(() => {
                                alter("已保存到相册")
                            }).catch(e => {
                                alter("保存相册失败")
                            })
                    },
                    function (err) {
                        console.log("requestAuthorization err", err)
                        alter("保存相册失败")
                    }, // if options not provided, defaults to {read: true}.
                    {
                        read: true,
                        write: true
                    }
                );
                break;
            case "browser":
                output.contentWindow.saveScreen();
                setTimeout(() => { alter("保存成功") }, 300);
                break;
            default:
                console.log("not support", cordova.platformId)
                break;
        }

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
        addFileItem.onclick = (e) => {
            activeFile.classList.remove("active");
            var fileItem = document.createElement("li");
            fileItem.classList.add("tile", "light", "active");
            var fileName = "test.js", fileType = "javascript";
            fileItem.innerHTML = render(layouts["openFile"], {
                "file name": fileName,
                "file type": fileType,
            });
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
            var fileValue = "function save() { save('1.png'); }; window.saveScreen = save;"
            newFrame.write(`<script>${fileValue}<\/script>`);
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
        selectedEditor.session.setValue(fileValue);
        selectedEditor.selection.cursor.setPosition(1);
        removeNotice();
        // 清理undo
        selectedEditor.getSession().getUndoManager().reset();
        selectedEditor.on("focus", updateFocus);
        window.selectedEditor = selectedEditor;
    }
}