(function () {
    const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
    const extList = ["css", "html", "img", "js", "txt", "unknow"];

    function GetId (randomLength) {
        return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
    }

    function getFileSuffix (fileName) {
        var fileType = "unknow"
        const flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1];
        if (suffix != "") {
            suffix = suffix.toLocaleLowerCase();
            if (imglist.includes(suffix)) {
                fileType = "img"
            } else {
                if (extList.includes(suffix)) {
                    fileType = suffix
                }
            }
        }
        return fileType;
    }

    // 新增文件
    var addFileItem = function (parentNode, fileNode, fileName) {
        console.log("inputFileName", fileName)
        var fileType = getFileSuffix(fileName);
        // 新增文件icon
        const fileIconSpan = document.createElement("img");
        var fileIcon = "asserts/fileicon/" + (fileType || "unknow") + ".svg";
        fileIconSpan.classList.add("vscode-icon");
        fileIconSpan.classList.add("FileName-module-icon-SEpzz");
        fileIconSpan.src = fileIcon;
        parentNode.appendChild(fileIconSpan);
        // 新增文件名
        const fileNameSpan = document.createElement("span");
        fileNameSpan.classList.add("FileName-module-name-aJJGC");
        fileNameSpan.dataset["fileNode"] = fileNode;
        fileNameSpan.innerHTML = `${fileName}`;
        parentNode.appendChild(fileNameSpan);

        return { fileIconSpan, fileNameSpan }
    }

    var addFileItemHandler = function (parentNode, fileNode, fileName) {
        var renameEle = document.getElementsByClassName('rename-file-btn-' + fileNode)
        if (renameEle && renameEle[0]) {
            renameEle[0].onclick = (e) => {
                console.log("renameEle", e, e.target.dataset)
                // fileIconSpan.remove();
                // fileNameSpan.remove();
                var inputParentEle = document.getElementById('inputFileNameParent-' + fileNode)
                // 删除子节点
                while (inputParentEle.hasChildNodes()) {
                    inputParentEle.removeChild(inputParentEle.firstChild);
                }
                console.log("inputParentEle", inputParentEle)
                var inputEleNew = document.createElement("input");
                inputEleNew.dataset["fileNode"] = fileNode
                inputEleNew.id = "inputFileName"
                inputEleNew.type = "text"
                inputEleNew.classList.add("FileItem-module-Input-ly4zm")
                inputEleNew.spellcheck = "false"
                inputEleNew.value = fileName
                inputEleNew.focus();
                inputParentEle.appendChild(inputEleNew);
                inputEleNew.addEventListener('change', function (event) {
                    fileName = event.target.value;
                    addFileItem(inputParentEle, fileNode, fileName);
                    inputEleNew.remove()
                });
            }
        }
        var deleteEle = document.getElementsByClassName('delete-file-btn-' + fileNode)
        if (deleteEle && deleteEle[0]) {
            deleteEle[0].onclick = (e) => {
                console.log("deleteEle", e, e.target.dataset)
                var dataset = e.target.dataset;
                var id = dataset["filenode"];
                document.getElementById(id).remove();
            }
        }
    };

    var addFolderItem = function () {
    }

    // file tree
    function loadFileList (fileName, depth) {
        console.log("loadFileList", fileName, depth)
        const fileDiv = document.createElement("div");
        var fileType = getFileSuffix(fileName);
        var fileNode = GetId(8),
            depth = depth || 1, // TODO
            foldIcon = "asserts/unfold.svg",
            fileIcon = "asserts/fileicon/" + (fileType || "unknow") + ".svg",
            renameIcon = "asserts/rename.svg",
            deleteIcon = "asserts/delete.svg";
        fileDiv.classList.add("FileTree");
        fileDiv.classList.add("FileTreeFileItem");
        fileDiv.classList.add("FileTree-module-FileTree-AITTG");
        fileDiv.dataset["cy"] = "filetree";
        fileDiv.id = fileNode;
        fileDiv.innerHTML = `<div>
            <div class="react-contextmenu-wrapper">
                <div class="FileItem-module-FileItem-Hxa_F FileItem-module-Selected-jKfXo FileItem-module-Focused-SlO2Q FileItem-module-IsFile-xrPAy"
                    tabindex="0" data-cy="index.html" style="--itemDepth:${depth};">
                    <button class="Arrow Arrow-module-Arrow-DD4Na FileItem-module-Arrow-jrp2H">
                        <img class="vscode-icon" src="${foldIcon}" /></img>
                    </button>
                    <span class="FileItem-module-Marker-XZqF1"></span>
                    <div class="FileName-module-root-fYtum" draggable="true" id="inputFileNameParent-${fileNode}">
                        <img class="vscode-icon" class="FileName-module-icon-SEpzz" src="${fileIcon}" /></img>
                        <span class="FileName-module-name-aJJGC">${fileName}</span>
                    </div>
                    <span class="FileItem-module-Actions-bb0qc">
                        <button data-fileNode="${fileNode}" class="rename-file-btn-${fileNode} FileItem-module-ActionButton-VaOpF"
                            aria-label="Rename">
                            <img data-fileNode="${fileNode}" class="vscode-icon" src="${renameIcon}" /></img>
                        </button>
                        <button data-fileNode="${fileNode}" class="delete-file-btn-${fileNode} FileItem-module-ActionButton-VaOpF"
                            aria-label="Remove">
                            <img data-fileNode="${fileNode}" class="vscode-icon" src="${deleteIcon}" /></img>
                        </button>
                    </span>
                </div>
            </div>
            <nav role="menu" tabindex="-1" class="react-contextmenu"
                style="position: fixed; opacity: 0; pointer-events: none;">
                <div class="react-contextmenu-item" role="menuitem" tabindex="-1" aria-disabled="false">
                    <span data-fileNode="${fileNode}" class="rename-file-span-${fileNode} react-contextmenu-icon">
                        <img data-fileNode="${fileNode}" class="vscode-icon" src="${renameIcon}" /></img>
                    </span>
                    <span class="react-contextmenu-label">Rename</span>
                </div>
                <div class="react-contextmenu-item" role="menuitem" tabindex="-1" aria-disabled="false">
                    <span data-fileNode="${fileNode}" class="delete-file-span-${fileNode} react-contextmenu-icon">
                        <img data-fileNode="${fileNode}" class="vscode-icon" src="${deleteIcon}" /></img>
                    </span>
                    <span class="react-contextmenu-label">Delete</span>
                </div>
            </nav>
        </div>`

        document.querySelector("#filetree").appendChild(fileDiv)
        // 添加fileitem的操作，比如renname，delete
        addFileItemHandler(null, fileNode, fileName)
        window.onload = ()=> {
            console.log("load oooooooooooooooooookkkkkkkkkkkkkk")
        }
    }

    // file manager
    function addFile (args) {
        console.log("add-file")
        var inputEle = document.getElementById('inputFileName')
        // 如果存在一个正在新建的文件
        if (inputEle) {
            inputEle.focus()
            return
        }
        const fileDiv = document.createElement("div");
        var fileNode = GetId(8),
            depth = depth || 1,  // TODO
            foldIcon = "asserts/unfold.svg",
            renameIcon = "asserts/rename.svg",
            deleteIcon = "asserts/delete.svg";
        fileDiv.classList.add("FileTree");
        fileDiv.classList.add("FileTreeFileItem");
        fileDiv.classList.add("FileTree-module-FileTree-AITTG");
        fileDiv.dataset["cy"] = "filetree";
        fileDiv.id = fileNode;
        fileDiv.innerHTML = `<div>
            <div class="react-contextmenu-wrapper">
                <div class="FileItem-module-FileItem-Hxa_F FileItem-module-Selected-jKfXo FileItem-module-Focused-SlO2Q FileItem-module-IsFile-xrPAy"
                    tabindex="0" data-cy="index.html" style="--itemDepth:${depth};">
                    <button class="Arrow Arrow-module-Arrow-DD4Na FileItem-module-Arrow-jrp2H">
                        <img class="vscode-icon" src="${foldIcon}" /></img>
                    </button>
                    <span class="FileItem-module-Marker-XZqF1"></span>
                    <div class="FileName-module-root-fYtum" draggable="true" id="inputFileNameParent-${fileNode}">
                        <input data-fileNode="${fileNode}" id="inputFileName" type="text"  class="FileItem-module-Input-ly4zm" spellcheck="false" value="">
                    </div>
                    <span class="FileItem-module-Actions-bb0qc">
                        <button data-fileNode="${fileNode}" class="rename-file-btn-${fileNode} FileItem-module-ActionButton-VaOpF"
                            aria-label="Rename">
                            <img data-fileNode="${fileNode}" class="vscode-icon" src="${renameIcon}" /></img>
                        </button>
                        <button data-fileNode="${fileNode}" class="delete-file-btn-${fileNode} FileItem-module-ActionButton-VaOpF"
                            aria-label="Remove">
                            <img data-fileNode="${fileNode}" class="vscode-icon" src="${deleteIcon}" /></img>
                        </button>
                    </span>
                </div>
            </div>
            <nav role="menu" tabindex="-1" class="react-contextmenu"
                style="position: fixed; opacity: 0; pointer-events: none;">
                <div class="react-contextmenu-item" role="menuitem" tabindex="-1" aria-disabled="false">
                    <span data-fileNode="${fileNode}" class="rename-file-span-${fileNode} react-contextmenu-icon">
                        <img data-fileNode="${fileNode}" class="vscode-icon" src="${renameIcon}" /></img>
                    </span>
                    <span class="react-contextmenu-label">Rename</span>
                </div>
                <div class="react-contextmenu-item" role="menuitem" tabindex="-1" aria-disabled="false">
                    <span data-fileNode="${fileNode}" class="delete-file-span-${fileNode} react-contextmenu-icon">
                        <img data-fileNode="${fileNode}" class="vscode-icon" src="${deleteIcon}" /></img>
                    </span>
                    <span class="react-contextmenu-label">Delete</span>
                </div>
            </nav>
        </div>`

        document.querySelector("#filetree").appendChild(fileDiv)
        inputEle = document.getElementById('inputFileName')
        inputEle.focus();
        inputEle.addEventListener('change', function (event) {
            // 添加fileitem的操作图标
            addFileItem(inputEle.parentNode, fileNode, event.target.value);
            // 删除iuput
            inputEle.remove()
            // 添加fileitem的操作，比如renname，delete
            addFileItemHandler(inputEle.parentNode, fileNode, event.target.value);
        });
    }

    function addFolder (args) {
        addFolderItem()
    }

    // 新增文件操作
    document.querySelector("#add-file").onclick = (e) => {
        console.log("add-file", e)
        addFile()
    }
    // 新增目录操作
    document.querySelector("#add-folder").onclick = (e) => {
        console.log("add-folder", e)
        addFolder()
    }

    window.loadFileList = loadFileList;
}())