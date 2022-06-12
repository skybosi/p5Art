// Evaluate The Focus
let isFocused = false;
const evalFocus = function (selectedEditor) {
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
}

export {
    evalFocus,
    updateFocus
}