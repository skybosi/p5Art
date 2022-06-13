function render (template, json) {
    var pattern = /\{{(.*?)\}}/g;
    return template.replace(pattern, function (match, key, value) {
        return json[key];
    })
}
