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

function toast (tip) {
    var toastItem = document.createElement("div");
    toastItem.classList.add("prompt")
    toastItem.style = "width:auto;min-width:30%;max-width: 80%;top:80%;z-index:10000000;font-size:14px;"
    toastItem.innerHTML = `<div style="text-align: center;padding: 6px;">
        <span class="message">${tip}</span>
    </div>`
    document.body.appendChild(toastItem)
    setTimeout(() => {
        toastItem.remove();
    }, 2000);
}

function dialog (title, left, right) {
    var btnStyle = "border-radius:3px;margin-left: 3px;margin-right: 3px",
        warnStyle = "border-color: #f56c6c;background-color: #f56c6c"
    // 对话框
    var dialogItem = document.createElement("div");
    dialogItem.classList.add("prompt")
    dialogItem.innerHTML = `<span class="icon cancel" style="position: absolute;right: 0px;top: 0px;" action=""></span>
        <span class="message scroll" style="min-height: auto;font-size: 18px;text-align: center;font-weight: bold;">${title}</span>
        <span class="error-msg"> </span>
        <div class="button-container">
            <button action="left" style="font-size: 16px;${warnStyle};${btnStyle}">${left.content}</button>
            <button action="right" style="font-size: 16px;${btnStyle}">${right.content}</button>
        </div>`;
    document.body.appendChild(dialogItem);

    // 透明modal
    var modalItem = document.createElement("div")
    modalItem.style = "position: fixed;left: 0;top: 0;width: 100%;height: 100%;opacity: 0.5;background: #000;"
    document.body.appendChild(modalItem);
    modalItem.addEventListener("click", (e) => {
        detroy();
    })
    dialogItem.getElementsByClassName("icon cancel")[0].addEventListener("click", (e) => {
        detroy();
    })

    dialogItem.querySelectorAll("button").forEach((child) => {
        child.addEventListener("click", function (e) {
            var status = true;
            switch (child.getAttribute("action")) {
                case 'left':
                    if (left.cb && typeof left.cb == "function") {
                        status = left.cb({ body: child, baseNode: dialogItem })
                    }
                    break
                case 'right':
                    if (right.cb && typeof right.cb == "function") {
                        status = right.cb({ body: child, baseNode: dialogItem })
                    }
                    break
                default:
                    break
            }
            if (status || status == undefined) detroy();
        })
    })

    function detroy () {
        dialogItem.remove()
        modalItem.remove()
    }
}