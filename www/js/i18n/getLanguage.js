var strings = {}

navigator.globalization.getPreferredLanguage(
    (language) => {
        // This will display your device language
        var lang = "zh_cn";
        if (language && language.value) {
            lang = language.value.toLowerCase().replace("-", "_");
        }
        if (strings.uselang && languages[strings.uselang]) {
            lang = strings.uselang;
            strings = languages[strings.uselang];
            strings.uselang = lang;
        } else {
            strings = languages[`${lang}`];
            strings.uselang = lang;
        }
        console.log('language --', lang, language, strings);
    },
    null
);
