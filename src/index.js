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
      let defaults = {
        preHtmlBody: '<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./css/style.css">',
        preHtml: '</head><body>',
        postHtml: '</body><html>',
        preCss: '<link href="',
        postCss: '" rel="stylesheet">',
        preJs: '<script src="',
        postJs: '"></script>'
      };

      var username = opts.username
      var projectName = opts.projectName
      var mobileOS = editor.getDevice()
      var htmlContent = defaults.preHtmlBody
      var uploadApi = '/export/upload/projectFile'
      var buildApi = '/export/sendBuildRequest'
      var binaryFiles = [] // binary data id

      // create html file
      $.each(editor.getConfig().canvas.styles, function (n, value) {
        htmlContent = htmlContent + defaults.preCss + value + defaults.postCss
      })
      $.each(editor.getConfig().canvas.scripts, function (n, value) {
        htmlContent = htmlContent + defaults.preJs + value + defaults.postJs
      })
      htmlContent = htmlContent + defaults.preHtml + editor.getHtml() + defaults.postHtml
      var htmlFile = {
        'username': username,
        'projectName': projectName,
        'mobileOS': mobileOS,
        'filePath': './index.html',
        'content': htmlContent
      }
      $.ajax({
        type: 'POST',
        url: uploadApi,
        data: JSON.stringify(htmlFile),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (res) {
          // alert(JSON.stringify(res.status))
          console.log(res)
          if (res.fileId != '') {
            binaryFiles.push(res.fileId)
          }
        },
        failure: function (errMsg) {
          alert(data.status);
        }
      })

      // create css file
      var cssContent = editor.getCss()
      var cssFile = {
        'username': username,
        'projectName': projectName,
        'mobileOS': mobileOS,
        'filePath': './css/style.css',
        'content': cssContent
      }
      $.ajax({
        type: 'POST',
        url: uploadApi,
        data: JSON.stringify(cssFile),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (res) {
          console.log(res)
          if (res.fileId != '') {
            binaryFiles.push(res.fileId)
          }
        },
        failure: function (errMsg) {
          alert(data.status);
        }
      })

      // send build app reqeust
      var now = new Date($.now())
      var mobileAppProject = {
        'username': username,
        'projectName': projectName,
        'createdAt': now,
        'updatedAt': now,
        'mobileOS': mobileOS,
        'binaryFiles': binaryFiles,
        'cordovaPlugins': [],
      }

      console.log(mobileAppProject)
      console.log(JSON.stringify(mobileAppProject))

      $.ajax({
        type: 'POST',
        url: buildApi,
        data: JSON.stringify(mobileAppProject),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (res) {
          alert(res.status)
        },
        failure: function (errMsg) {
          alert(data.status);
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
