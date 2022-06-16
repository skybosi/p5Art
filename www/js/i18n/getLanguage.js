var strings = {}

navigator.globalization.getPreferredLanguage(
    (language) => {
        // This will display your device language
        var l = "zh_cn";
        if (language && language.value) {
            l = language.value.toLowerCase().replace("-", "_");
        }
        strings = languages[`${l}`];
        console.log('language --', l, language, strings);
    },
    null
);
