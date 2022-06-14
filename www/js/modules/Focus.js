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