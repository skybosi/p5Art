function PickerView (selectedEditor) {
    const pk = document.querySelector("#picker");
    pk.addEventListener("click", function () {
        const pkParent = document.querySelector("#pickerLayout");
        // 如果存在，删除老的防止无限插入picker
        if (pkParent.children.length > 0) {
            pkParent.children[0].remove();
        }
        const picker = new Picker({
            parent: pkParent,
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
}

export default PickerView