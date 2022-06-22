(async function () {
    try {
        await aceLoaded();
    } catch (e) {
        console.error(e);
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
            // console.log(editor)
            LoadAutoComplete();
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
        // selectedEditor.session.setValue(getCodeValue(defaultFile), 1);
        // 清理undo
        // selectedEditor.getSession().getUndoManager().reset();
        // selectedEditor.fileName = defaultFile;
        // selectedEditor.fileType = "javascript";
        window.selectedEditor = selectedEditor;

        // ace.config.loadModule("ace/snippets/snippets", function () {
        //     const snippetManager = ace.require("ace/snippets").snippetManager;
        //     document.body.onclick = function () {
        //         ace.config.loadModule("ace/snippets/javascript", function (m) {
        //             if (m) {
        //                 m.snippets.push(...snippets);
        //                 snippetManager.register(m.snippets, m.scope);
        //             }
        //         });
        //         document.body.onclick = null;
        //     };
        // });

        // 拾色器
        PickerView(selectedEditor);

        // 编辑器
        EditorManager(selectedEditor);

        // 工具栏
        ToolsManager(selectedEditor);

        // 文本控制器
        TextControl(selectedEditor, selectedEditor.container);
    }

    // If the ace is not loaded offline message will apper
    if (typeof ace !== "undefined") {
        loadAce();
    } else {
        document.querySelector(".loading-screen h2").innerHTML =
            "You are offline 😪";
    }
})();
