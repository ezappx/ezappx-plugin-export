import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('ezapp-plugin-export', (editor, opts = {}) => {
  let c = opts || {};
  let config = editor.getConfig();
  let pfx = config.stylePrefix;
  let btnExp = document.createElement("BUTTON");
  let commandName = 'ezapp-export';

  btnExp.innerHTML = '导出';
  btnExp.className = pfx + 'btn-prim';

  // Add command
  editor.Commands.add(commandName, {
    run() {
      console.log(editor.getDevice())
      console.log(editor.getHtml());
      console.log(editor.getCss());
      var exportConfig = {
        "uuid": "test uuid",
        "mobileOS": editor.getDevice(),
        "customHTMLFiles": [
          {
            "filename": "index.html",
            "content": editor.getHtml()
          }
        ],
        "customCSSFiles": [
          {
            "filename": "css.css",
            "content": editor.getCss()
          }
        ],
        "dependentFiles":
        {
          "css": ["weui.min.css"],
          "js": ["jquery-3.3.1.min.js"]
        },
        "callBackApi": "http://localhost/callBackApi"
      }

      $.ajax({
        type: 'POST',
        url: '/mobile/build',
        data: JSON.stringify(exportConfig),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) { alert(data); },
        failure: function (errMsg) {
          alert(errMsg);
        }
      })
    }
  });

  // Add button inside export dialog
  editor.on('run:export-template', () => {
    editor.Modal.getContentEl().appendChild(btnExp);
    btnExp.onclick = () => {
      editor.runCommand(commandName);
    };
  });

});
