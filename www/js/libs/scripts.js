(function () {
    const scripts = [
        "js/libs/ace/1.5.3/ext-emmet.min.js",
        "js/libs/emmet-core/emmet.js",
        "js/libs/ace/1.5.3/ext-language_tools.min.js",
        "js/libs/ace/1.5.3/ext-beautify.min.js",
        "js/libs/ace/1.5.3/snippets/css.js",
        "js/libs/ace/1.5.3/snippets/html.js",
        "js/libs/ace/1.5.3/snippets/snippets.js",
        "js/libs/ace/1.5.3/snippets/javascript.min.js",
        "js/libs/vanilla-picker.min.js",
        "js/i18n/getLanguage.js",
        // utils
        "js/utils/render.js",
        "js/utils/template.js",
        // module
        "js/modules/Base.js",
        "js/modules/EditorManager.js",
        "js/modules/LoadAutoComplete.js",
        "js/modules/PickerView.js",
        "js/modules/TextControl.js",
        "js/modules/ToolsManager.js",
    ]
    const body = document.body;

    function aceScript () {
        return new Promise((resolve, reject) => {

            if (!navigator.onLine) reject("No Internet");

            const jsScript = document.createElement("script");
            jsScript.src = "js/libs/ace/1.5.3/ace.js";
            body.appendChild(jsScript);
            jsScript.onload = function (e) {
                scripts.forEach(script => {
                    const jsScript = document.createElement("script");
                    jsScript.src = script;
                    jsScript.async = true;
                    body.appendChild(jsScript);
                })

                window.onload = () => resolve("Success");
            }
        })
    }
    window.aceLoaded = aceScript;
}())