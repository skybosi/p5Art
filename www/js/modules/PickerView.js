// 拾色器
function PickerView (selectedEditor) {
    const pk = document.querySelector("#picker");
    pk.addEventListener("click", function () {
        const pkParent = document.querySelector("#pickerLayout");
        // 如果存在，删除老的防止无限插入picker
        if (pkParent.children.length > 0) {
            pkParent.children[0].remove();
        }
        var color = "gold";
        var colorObj = selectedEditor.lastSelectColor;
        if (colorObj && colorObj.printHex) {
            color = colorObj.printHex()
        }
        const picker = new Picker({
            parent: pkParent,
            color: color,
            editor: true,
        });
        picker.setColor(color);
        picker.settings.popup = "top";
        picker.destroy();
        picker.show();
        picker.onDone = function (color) {
            selectedEditor.lastSelectColor = color;
            selectedEditor.insert(color.printHex());
        };
    });
}