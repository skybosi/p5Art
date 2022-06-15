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

function alter (tip) {
    var alterItem = document.createElement("div");
    alterItem.classList.add("prompt")
    alterItem.style = "width:auto;min-width:30%;max-width: 80%;top:80%;z-index:10000000;font-size:14px;"
    alterItem.innerHTML = `<div style="text-align: center;padding: 6px;">
        <span class="message">${tip}</span>
    </div>`
    document.body.appendChild(alterItem)
    setTimeout(() => {
        alterItem.remove();
    }, 2000);
}