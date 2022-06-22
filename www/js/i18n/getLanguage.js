var strings = {}

var language = navigator.language.toLowerCase()
var country = language.split("-")[0] || "en"

var lang = "en-us";
if (language && language != "") {
    if (language in langList) {
        lang = language;
    } else if (langListMap[language] || langListMap[country]) {
        switch (language) {
            case "zh": case "zh-cn":
                lang = "zh-cn"
                break;
            case "zh-tw": case "zh-hk":
                lang = "zh-hant"
                break;
            case "en": case "en-us":
                lang = "en-us"
                break;
            default:
                lang = langListMap[language] || langListMap[country]
                break;
        }
    } else {
        lang = "en-us"
    }
}

if (strings.uselang && languages[strings.uselang]) {
    lang = strings.uselang;
    strings = languages[strings.uselang];
    strings.uselang = lang;
} else {
    strings = languages[`${lang}`] || languages["en-us"];
    strings.uselang = lang;
}
console.log("language:", lang, language, strings);
