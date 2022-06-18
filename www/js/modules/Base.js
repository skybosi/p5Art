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