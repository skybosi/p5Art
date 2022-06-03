(async function () {
    try {
        await aceLoaded();
    } catch (e) {
        console.log(e);
    }
    function loadAce () {
        let renderFrame = null;
        function aceMixin (config) {
            const { mode = "html", parent } = config;
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
                theme: "ace/theme/monokai",
                useSoftTabs: false,
            });
            //console.log(editor)
            editor.commands.removeCommand("showSettingsMenu");
            editor.setShowPrintMargin(false);
            return editor;
        }
        const editorHTML = aceMixin({
            parent: "editorHtml",
            mode: "html",
        });

        const editorCSS = aceMixin({
            parent: "editorCSS",
            mode: "css",
        });

        const editorJS = aceMixin({
            parent: "editorJS",
            mode: "javascript",
        });

        loadInitialCode({ editorCSS, editorJS, editorHTML });

        let selectedEditor = editorHTML;
        const pk = document.querySelector("#picker");
        let textarea = selectedEditor.textInput.getElement();

        pk.addEventListener("click", function () {
            const picker = new Picker({
                parent: pk,
                color: selectedEditor.getSelectedText() || "gold",
                editor: true,
            });
            picker.setColor(selectedEditor.getSelectedText());
            picker.settings.popup = "top";
            picker.destroy();
            picker.show();
            picker.onDone = function (color) {
                selectedEditor.insert(color.printHex());
            };
        });
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

        // Evaluate The Focus
        let isFocused = false;
        let isRendered = false;
        const evalFocus = function () {
            if (isFocused) {
                selectedEditor.focus();
            }
        };
        function updateFocus () {
            isFocused = true;
        }

        // Fix the keyboard issue
        const oldHeight = window.innerHeight;
        window.onresize = function () {
            if (this.innerHeight === oldHeight) {
                isFocused = false;
            }
        };

        // Add Event dynamically om the navigation
        function changeEditor (id, forceRender = false) {
            const output = document.querySelector(".output");
            selectedEditor.off("focus", updateFocus);
            switch (id) {
                case "editorCSS":
                    if (output) output.style.visibility = "hidden";
                    selectedEditor = editorCSS;
                    swapChildren(id);
                    break;
                case "editorHtml":
                    if (output) output.style.visibility = "hidden";
                    selectedEditor = editorHTML;
                    swapChildren(id);
                    break;
                case "editorJS":
                    if (output) output.style.visibility = "hidden";
                    selectedEditor = editorJS;
                    swapChildren(id);
                    break;
                case "previewOt":
                    if (output && !forceRender) {
                        output.style.visibility = "";
                    } else {
                        updateDocument();
                    }
                    break;
                default:
                    break
            }
            selectedEditor.on("focus", updateFocus);
        }

        const nav = document.querySelectorAll("nav a");
        nav.forEach((child) => {
            child.addEventListener("click", function (e) {
                // if (this === nav[nav.length - 1]) {
                //     updateDocument(true);
                // }
                if (e && e.dataset && true === e.dataset.forceRender) {
                    child.dataset.forceRender = e.dataset.forceRender;
                }
                document.querySelector(".active").classList.remove("active");
                this.classList.add("active");
                changeEditor(child.dataset.id, child.dataset.forceRender);
                textarea = selectedEditor.textInput.getElement();
            });
        });
        document.querySelector(".preview").onclick = () => {
            const event = document.createEvent("HTMLEvents");
            event.initEvent("click", true, false);
            event.dataset = {
                forceRender: true
            };
            document.querySelector("#ot").dispatchEvent(event);
        }

        const prettier = require("ace/ext/beautify");
        function toolsAction (id) {
            switch (id) {
                case "@":
                    simulateKey({
                        element: textarea,
                        keyCode: 50,
                    });
                    break;
                case "Esc":
                    simulateKey({
                        element: textarea,
                        keyCode: 27,
                    });
                    break;
                case "&":
                    simulateKey({
                        element: textarea,
                        keyCode: 55,
                    });
                    break;
                case "|":
                    simulateKey({
                        element: textarea,
                        keyCode: 220,
                        shiftKey: true
                    });
                    break;
                case "\\":
                    simulateKey({
                        element: textarea,
                        keyCode: 220,
                    });
                    break;
                case "/":
                    simulateKey({
                        element: textarea,
                        keyCode: 111,
                    });
                    break;
                case "&lt;&gt;":
                    simulateKey({
                        element: textarea,
                        keyCode: 188,
                        shiftKey: true,
                    });
                    break;
                case "``":
                    simulateKey({
                        element: textarea,
                        keyCode: 192,
                    });
                    break;
                case "PgUp":
                    simulateKey({
                        element: textarea,
                        keyCode: 33,
                    });
                    break;
                case "~":
                    simulateKey({
                        element: textarea,
                        keyCode: 192,
                        shiftKey: true,
                    });
                    break;
                case "Tab":
                    simulateKey({
                        element: textarea,
                        keyCode: 9,
                    });
                    break;
                case "[]":
                    simulateKey({
                        element: textarea,
                        keyCode: 9,
                    });
                    break;
                case "{}":
                    simulateKey({
                        element: textarea,
                        keyCode: 9,
                    });
                    break;
                case "()":
                    simulateKey({
                        element: textarea,
                        keyCode: 9,
                    });
                    break;
                case "^":
                    simulateKey({
                        element: textarea,
                        keyCode: 9,
                    });
                    break;
                case "PgDown":
                    simulateKey({
                        element: textarea,
                        keyCode: 34,
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
            evalFocus();
        }

        // Process the events of tools
        selectedEditor.on("focus", updateFocus);
        document.querySelectorAll(".tools button").forEach((btn) => {
            if (btn.id === "picker") return;
            btn.addEventListener("click", function () {
                toolsAction(this.id);
            });
        });

        // Preview the code that has written
        function updateDocument (forceRender = false) {
            var output = document.querySelector(".output");
            if (!output) {
                output = document.createElement("iframe");
            } else {
                if (isRendered && !forceRender) {
                    output.style.visibility = ""
                    return
                }
            }
            saveCode({ css: editorCSS, js: editorJS, html: editorHTML });
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
            erudaScript.src = "js/libs/eruda/eruda-2.2.0.js";
            erudaInit.innerHTML = `eruda.init({
                    tool: ["console","elements","network","resources"],
                    defaults: {
                    displaySize: 60
            }});
            eruda.remove("settings")`;
            newFrame.write("<head></head>");
            newFrame.write("<body></body>");
            newFrame.body.appendChild(erudaScript);
            erudaScript.onload = function (e) {
                newFrame.head.appendChild(erudaInit);
                newFrame.head.innerHTML += `<style>${editorCSS.getValue()}</style>`;
                newFrame.write(editorHTML.getValue());
                newFrame.write(`<script>${editorJS.getValue()}<\/script>`);
                frame.close();
                isRendered = true
            };
        }
    }

    // If the ace is not loaded offline message will apper
    if (typeof ace !== "undefined") {
        loadAce();
        setTimeout(function () {
            document.body.removeChild(document.querySelector(".loading-screen"));
            // Abort early if its not a touch screen
            if ("ontouchstart" in window) return;
            // document.querySelector(".modal").style.display = "flex";
        }, 1000);
    } else {
        document.querySelector(".loading-screen h2").innerHTML =
            "You are offline 😪";
    }
})();
