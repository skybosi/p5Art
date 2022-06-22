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

const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
const extList = ['access', 'actionscript', 'ada', 'ai', 'al', 'antlr', 'anyscript', 'apache', 'apex', 'apib', 'apl', 'applescript', 'appveyor', 'arduino', 'asciidoc', 'asp', 'aspx', 'assembly', 'ats', 'audio', 'aurelia', 'autohotkey', 'autoit', 'avro', 'aws', 'azure', 'azurepipelines', 'babel', 'ballerina', 'bat', 'bazaar', 'bazel', 'biml', 'binary', 'bitbucketpipeline', 'bithound', 'blade', 'bolt', 'bower', 'browserslist', 'buckbuild', 'bundler', 'c', 'cabal', 'caddy', 'cake', 'cakephp', 'capacitor', 'cargo', 'cert', 'ceylon', 'cf', 'cfc', 'cfm', 'cheader', 'chef', 'circleci', 'class', 'clojure', 'clojurescript', 'cloudfoundry', 'cmake', 'cobol', 'codacy', 'codeclimate', 'codecov', 'codekit', 'coffeelint', 'coffeescript', 'compass', 'composer', 'conan', 'config', 'confluence', 'coveralls', 'cpp', 'cppheader', 'crowdin', 'crystal', 'csharp', 'csproj', 'css', 'csscomb', 'csslint', 'cssmap', 'cucumber', 'cuda', 'cvs', 'cypress', 'cython', 'dal', 'darcs', 'dartlang', 'db', 'delphi', 'dependencies', 'diff', 'django', 'dlang', 'docker', 'dockertest', 'docpad', 'docz', 'dojo', 'dotjs', 'doxygen', 'drone', 'drools', 'dustjs', 'dylan', 'edge', 'editorconfig', 'eex', 'ejs', 'elastic', 'elasticbeanstalk', 'elixir', 'elm', 'emacs', 'ember', 'ensime', 'eps', 'erb', 'erlang', 'eslint', 'excel', 'falcon', 'favicon', 'fbx', 'file', 'firebase', 'firebasehosting', 'firestore', 'fla', 'flash', 'floobits', 'flow', 'flutter', 'font', 'fortran', 'fossa', 'fossil', 'freemarker', 'fsharp', 'fsproj', 'fusebox', 'galen', 'gamemaker', 'gatsby', 'gcode', 'git', 'gitlab', 'glide', 'glsl', 'go', 'godot', 'gradle', 'graphql', 'graphviz', 'greenkeeper', 'gridsome', 'groovy', 'grunt', 'gulp', 'haml', 'handlebars', 'harbour', 'haskell', 'haxe', 'haxecheckstyle', 'haxedevelop', 'helix', 'helm', 'hjson', 'hlsl', 'homeassistant', 'host', 'html', 'htmlhint', 'http', 'husky', 'icl', 'idris', 'idrisbin', 'idrispkg', 'image', 'imba', 'infopath', 'informix', 'ini', 'ink', 'innosetup', 'io', 'iodine', 'ionic', 'jake', 'janet', 'jar', 'java', 'jbuilder', 'jekyll', 'jenkins', 'jest', 'jinja', 'jpm', 'js', 'jsbeautify', 'jsconfig', 'jshint', 'jsmap', 'json', 'jsonld', 'jsonnet', 'jsp', 'jss', 'julia', 'jupyter', 'karma', 'key', 'kitchenci', 'kite', 'kivy', 'kos', 'kotlin', 'layout', 'lerna', 'less', 'license', 'lime', 'lintstagedrc', 'liquid', 'lisp', 'livescript', 'locale', 'log', 'lolcode', 'lsl', 'lua', 'lync', 'makefile', 'manifest', 'map', 'mariadb', 'markdown', 'markdownlint', 'marko', 'markojs', 'matlab', 'maven', 'maxscript', 'maya', 'mdx', 'mediawiki', 'mercurial', 'meson', 'meteor', 'mjml', 'mlang', 'mocha', 'mojolicious', 'moleculer', 'mongo', 'monotone', 'mson', 'mustache', 'mysql', 'nearly', 'nestjs', 'netlify', 'nginx', 'nim', 'ninja', 'node', 'nodemon', 'npm', 'nsi', 'nsri', 'nsri-integrity', 'nuget', 'nunjucks', 'nuxt', 'nyc', 'objectivec', 'objectivecpp', 'ocaml', 'onenote', 'opencl', 'openHAB', 'org', 'outlook', 'ovpn', 'package', 'paket', 'patch', 'pcl', 'pddl', 'pdf', 'perl', 'pgsql', 'photoshop', 'php', 'phpcsfixer', 'phpunit', 'phraseapp', 'pip', 'plantuml', 'platformio', 'plsql', 'poedit', 'polymer', 'pony', 'postcss', 'postcssconfig', 'powerpoint', 'powershell', 'precommit', 'prettier', 'prisma', 'processinglang', 'procfile', 'progress', 'prolog', 'prometheus', 'protobuf', 'protractor', 'publisher', 'pug', 'puppet', 'purescript', 'pyret', 'python', 'pyup', 'q', 'qbs', 'qlikview', 'qml', 'qmldir', 'qsharp', 'quasar', 'r', 'racket', 'rails', 'rake', 'raml', 'razor', 'reactjs', 'reacttemplate', 'reactts', 'reason', 'red', 'registry', 'rehype', 'remark', 'renovate', 'rest', 'retext', 'riot', 'robotframework', 'robots', 'rollup', 'rproj', 'rspec', 'rubocop', 'ruby', 'rust', 'saltstack', 'san', 'sass', 'sbt', 'scala', 'scilab', 'script', 'scss', 'sdlang', 'sentry', 'sequelize', 'serverless', 'shaderlab', 'shell', 'silverstripe', 'sketch', 'skipper', 'slang', 'slice', 'slim', 'sln', 'smali', 'smarty', 'snapcraft', 'snort', 'snyk', 'solidarity', 'solidity', 'source', 'sqf', 'sql', 'sqlite', 'squirrel', 'sss', 'stata', 'stencil', 'storyboard', 'storybook', 'stylable', 'style', 'stylelint', 'stylus', 'subversion', 'svelte', 'svg', 'swagger', 'swift', 'swig', 'symfony', 'systemverilog', 't4tt', 'tailwind', 'tcl', 'tera', 'terraform', 'test', 'testjs', 'testts', 'tex', 'text', 'textile', 'tfs', 'todo', 'toml', 'tox', 'travis', 'tsconfig', 'tslint', 'tt', 'ttcn', 'twig', 'typescript', 'typescriptdef', 'unibeautify', 'vagrant', 'vala', 'vapi', 'vash', 'vb', 'vba', 'vbhtml', 'vbproj', 'vcxproj', 'velocity', 'verilog', 'vhdl', 'video', 'view', 'vim', 'volt', 'vscode', 'vscode-insiders', 'vsix', 'vsixmanifest', 'vue', 'wallaby', 'wasm', 'watchmanconfig', 'webp', 'webpack', 'wercker', 'wolfram', 'word', 'wpml', 'wurst', 'wxml', 'wxss', 'xcode', 'xfl', 'xib', 'xliff', 'xml', 'xquery', 'xsl', 'yaml', 'yamllint', 'yandex', 'yang', 'yarn', 'yeoman', 'zip']

function getFileSuffix (fileName) {
    var fileType = "file"
    const flieArr = fileName.split('.');
    suffix = flieArr[flieArr.length - 1];
    if (suffix != "") {
        suffix = suffix.toLocaleLowerCase();
        if (imglist.includes(suffix)) {
            fileType = "image"
        } else if (['js', 'javascript'].includes(suffix)) {
            fileType = "javascript"
        } else {
            if (extList.includes(suffix)) {
                fileType = suffix
            }
        }
    }
    return fileType;
}

function deepClone(o) {
    // 判断如果不是引用类型，直接返回数据即可
    if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean' || typeof o === 'undefined') {
        return o
    } else if (Array.isArray(o)) { // 如果是数组，则定义一个新数组，完成复制后返回
        // 注意，这里判断数组不能用typeof，因为typeof Array 返回的是object
        // console.log(typeof [])  // --> object
        var _arr = []
        o.forEach(item => { _arr.push(item) })
        return _arr
    } else if (typeof o === 'object') {
        var _o = {}
        for (let key in o) {
            _o[key] = deepClone(o[key])
        }
        return _o
    }
}