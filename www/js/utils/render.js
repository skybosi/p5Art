function render (template, json) {
    if (!json || Object.keys(json).length <= 0) {
        json = strings
    } else {
        Object.assign(json, strings)
    }
    var pattern = /\{{(.*?)\}}/g;
    return template.replace(pattern, function (match, key, value) {
        return json[key];
    })
}
