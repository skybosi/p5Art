import { updateFocus } from "./focus.js"

function EditorManager (editor) {
    console.log("load previewEvent")
    const allCode = getCode();
    console.log(allCode);
    const nav = document.querySelectorAll(".open-file-list li");
    nav.forEach((child) => {
        child.addEventListener("click", function (e) {
            document.querySelector(".active").classList.remove("active");
            this.classList.add("active");
            var fileSpan = child.getElementsByClassName("text")[0];
            changeEditor(child.dataset.id, fileSpan.innerText);
        });
    });
    document.getElementById("preview").onclick = () => {
        // 启动渲染页面
        const output = document.querySelector(".output");
        var forceRender = true
        // 根据文本变更与否，判断是否强制刷新 TODO
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
        document.getElementById("back").style.display = ""
    }

    document.getElementById("back").onclick = () => {
        changeEditor("editorJs", "sketch.js");
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

    // Add Event dynamically om the navigation
    function changeEditor (id, fileName) {
        const output = document.querySelector(".output");
        selectedEditor.off("focus", updateFocus);
        var file = allCode[fileName];
        const fileValue = file.value;
        const mode = file.type;
        if (output) output.style.visibility = "hidden";
        selectedEditor.session.setMode(`ace/mode/${mode}`)
        selectedEditor.setValue(fileValue);
        // swapChildren(id);
        selectedEditor.on("focus", updateFocus);
        window.selectedEditor = selectedEditor;
    }
}

export default EditorManager