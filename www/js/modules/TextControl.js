function TextControl (editor, container) {
    var { clipboard } = cordova.plugins;
    const $content = container.querySelector('.ace_scroller');
    var touchStartT = -1;
    var longTouchTimer;
    var position, position2;
    var row = 0, column = 0;
    var clipboardText = "";
    const threshold = 200;
    var contextMenuElement = document.getElementById("clipboard-contextmneu");

    // 弹出菜单
    function contextmenu (x, y) {
        contextMenuElement = document.createElement("div");
        contextMenuElement.id = "clipboard-contextmneu";
        contextMenuElement.classList.add("clipboard-contextmneu");
        contextMenuElement.style = `transform: translate3d(${x}px, ${y}px, 0px) scale(1);flex-direction: column;`;
        contextMenuElement.innerHTML = render(layouts["context-menu"]);
        document.body.appendChild(contextMenuElement);

        // item event
        var copyCtrlElement = document.getElementById("copyCtrl");
        var cutCtrlElement = document.getElementById("cutCtrl");
        var pasteCtrlElement = document.getElementById("pasteCtrl");
        var selectAllCtrlElement = document.getElementById("selectAllCtrl");

        function recover () {
            selectedEditor.selection.anchor.setPosition(row, column);
            selectedEditor.selection.cursor.setPosition(row, column);
            contextMenuElement.remove()
            selectedEditor.focus();
        }

        copyCtrlElement.onclick = (e) => {
            clipboardAction('copy', selectedEditor);
            // var text = editor.getCopyText()
            // clipboardText = text;
            // recover()
        }
        cutCtrlElement.onclick = (e) => {
            clipboardAction('cut', selectedEditor);
            // var text = editor.getCopyText()
            // clipboardText = text;
            // editor.insert("")
            // recover()
        }
        pasteCtrlElement.onclick = (e) => {
            clipboardAction('paste', selectedEditor);
            // if (clipboardText && clipboardText != "") {
            //     editor.insert(clipboardText)
            // }
            // clipboardText = "";
            // recover()
        }
        selectAllCtrlElement.onclick = (e) => {
            clipboardAction('select all', selectedEditor);
            // editor.selection.selectAll();
        }

        function clipboardAction (action, editor) {
            const selectedText = editor.getCopyText();
            switch (action) {
                case 'copy':
                    if (selectedText) {
                        clipboard.copy(selectedText);
                        clipboardText = selectedText;
                        toast(strings['copied to clipboard']);
                    }
                    recover();
                    break;
                case 'cut':
                    if (selectedText) {
                        clipboard.copy(selectedText);
                        clipboardText = selectedText;
                        const ranges = editor.selection.getAllRanges();
                        ranges.map((range) => editor.remove(range));
                        toast(strings['copied to clipboard']);
                    }
                    recover();
                    break;
                case 'paste':
                    if (clipboardText && clipboardText != "") {
                        editor.insert(clipboardText)
                    }
                    recover();
                    break;
                case 'select all':
                    editor.selection.selectAll();
                    break;
            }
        }
    }

    $content.addEventListener('touchstart', touchStart);
    $content.addEventListener('touchmove', touchMove);
    $content.addEventListener('touchend', touchEnd);
    $content.addEventListener('touchcancel', touchEnd);

    $content.addEventListener('mousedown', touchStart);
    $content.addEventListener('mousemove', touchMove);
    $content.addEventListener('mouseup', touchEnd);

    function getPosition () {
        var cursor = editor.selection.cursor;
        row = cursor.row;
        column = cursor.column;
        var anchor = editor.selection.isEmpty()
            ? cursor
            : editor.selection.anchor;
        var { left, top } = editor.renderer.$cursorLayer.getPixelPosition(
            anchor,
            true,
        );
        return { x: left, y: top }
    }

    function mousePosition (ev) {
        var x, y;
        if (ev.touches && ev.touches[0]) {
            var touch = ev.touches[0]; //获取第一个触点
            x = Number(touch.pageX); //页面触点X坐标
            y = Number(touch.pageY); //页面触点Y坐标
        } else {
            if (ev.pageX || ev.pageY) {
                x = ev.pageX;
                y = ev.pageY;
            } else {
                x = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
                y = ev.clientY + document.body.scrollTop - document.body.clientTop;
            }
        }
        return { x, y };
    }

    function touchStart (e) {
        if (contextMenuElement) contextMenuElement.remove();
        // 获取点击位置
        getPosition();
        position = mousePosition(e);
        var t = e.timeStamp;
        var touches = e.touches || [];
        // 避免多指操作
        if (longTouchTimer || touches.length > 1) {
            clearTimeout(longTouchTimer);
            longTouchTimer = null;
            return;
        }
        touchStartT = t;
    }

    function touchMove (e) {
        if (longTouchTimer) {
            clearTimeout(longTouchTimer);
            longTouchTimer = null;
        }
        // 获取点击位置
        getPosition();
        position2 = mousePosition(e);
    }

    function touchEnd (e) {
        var t = e.timeStamp, shake = true;
        if (position && position2 && (Math.abs(position.x - position2.x) > 5 ||
            Math.abs(position.y - position2.y) > 5)) {
            shake = false
        }
        if (t - touchStartT > threshold && shake) {
            e.preventDefault();
            e.button = 0;
            longTouchTimer = setTimeout(handleLongTap, 0);
        } else {
            clearTimeout(longTouchTimer);
            longTouchTimer = null;
            position = null;
            position2 = null;
        }
    }

    function handleLongTap () {
        clearTimeout(longTouchTimer);
        longTouchTimer = null;
        console.log("handleLongTap", position)
        contextmenu(position.x, position.y);
    }
}
