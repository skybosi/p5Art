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