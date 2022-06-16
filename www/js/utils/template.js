const layouts = {
    "addFileLayout": `<div class="prompt">
        <span class="message scroll">{{enter file name}}</span>
        <input class="input" placeholder="" type="text">
        <span class="error-msg"> </span>
        <div class="button-container">
            <button action="" id="addfileCancel">{{cancel}}</button>
            <button action="" id="addfileSubmit">{{ok}}</button>
        </div>
    </div>`,
    // 添加文件
    "openFile": `<i class="file file_type_{{file type}}" style="padding-right: 5px;"></i>
<span class="text">{{file name}}</span>
<span class="icon cancel" action=""></span>`,
    // 搜索框
    "search": `<div class='button-container' id='search_row1'>
    <input id='searchInput' type='text' placeholder='{{search}}' />
    <button action='prev' class='icon arrow_back'></button>
    <button action='next' class='icon arrow_forward'></button>
    <button action='search-settings' class='icon settings'></button>
  </div>
  <div class='button-container' id='search_row2'>
    <input id='replaceInput' type='text' placeholder='{{replace}}' />
    <button action='replace' class='icon replace'></button>
    <button action='replace-all' class='icon replace_all'></button>
    <div class='search-status'>
      <span id='current-pos'>0</span>
      <span>of</span>
      <span id='total-result'>0</span>
    </div>
  </div>`,
    "context-menu": `<span id="copyCtrl" action='copy'>{{copy}}</span>
    <span id="cutCtrl" action='cut'>{{cut}}</span>
    <span id="pasteCtrl" action='paste'>{{paste}}</span>
    <span id="selectAllCtrl" action='select all'>{{select all}}</span>`,
    // 更多设置
    "more": `<li action="recent">
    <span class="text">{{open recent}}</span>
    <span class="icon historyrestore"></span>
  </li>
  <hr>
  <li action="open" value="settings">
    <span class="text">{{settings}}</span>
    <span class="icon settings"></span>
  </li>
  <li action="open" value="help">
    <span class="text">{{help}}</span>
    <span class="icon help"></span>
  </li>
  <hr>
  <li action="exit">
    <span class="text">{{exit}}</span>
    <span class="icon logout"></span>
  </li>`
}