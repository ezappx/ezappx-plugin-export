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
      console.log(editor.getConfig());
      var exportConfig = {
        "uuid": "testuuid",
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
          "css": editor.getConfig().canvas.styles,
          "js": editor.getConfig().canvas.scripts
        },
        "callBackApi": "http://localhost/callBackApi"
      }

      console.log(exportConfig);

      $.ajax({
        type: 'POST',
        url: '/mobile/export',
        data: JSON.stringify(exportConfig),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) { alert(data.status); },
        failure: function (errMsg) {
          alert(data.status);
        }
      })

      // $.ajax({
      //   type: 'POST',
      //   url: 'http://localhost:8081/api/v1/android/build-installer',
      //   data: JSON.stringify(exportConfig),
      //   contentType: "application/json; charset=utf-8",
      //   dataType: "json",
      //   success: function (data) { alert(data.status); },
      //   failure: function (errMsg) {
      //     alert(errMsg);
      //   }
      // })
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
