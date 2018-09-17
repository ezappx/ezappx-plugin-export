import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('ezapp-plugin-export', (editor, opts = {}) => {
  let config = editor.getConfig();
  let pfx = config.stylePrefix;
  let btnExp = document.createElement("BUTTON");
  let commandName = 'ezapp-export';

  btnExp.innerHTML = '导出应用安装包';
  btnExp.className = pfx + 'btn-prim';

  // Add command
  editor.Commands.add(commandName, {
    run() {
      var tipHtml = `<div class="modal fade" id="loading" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="loading-title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div class="progress">
                          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100"
                            aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                        </div>
                      </div>
                      <!-- <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                          </div> -->
                    </div>
                  </div>
                </div>`
      console.log(opts)
      $("#" + opts.tipDivId).html(tipHtml);
      $("#loading").modal();
      console.log("show waiting dialog");

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
      var uploadApi = opts.uploadApi
      var exportApi = opts.exportApi
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
        beforeSend: function () {
          $('#loading-title').text("导出HTML资源···")
        },
        success: function (res) {
          // alert(JSON.stringify(res.status))
          console.log(res)
          if (res.fileId != '') {
            binaryFiles.push(res.fileId)
          }
        },
        failure: function (errMsg) {
          $('#loading-title').text(data.status)
        },
        error: function (xhr, ajaxOptions, thrownError) {
          if (xhr.status == 404) {
            $('#loading-title').text(thrownError)
          }
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
        beforeSend: function () {
          $('#loading-title').text("导出CSS资源···")
        },
        success: function (res) {
          console.log(res)
          if (res.fileId != '') {
            binaryFiles.push(res.fileId)
          }
        },
        failure: function (errMsg) {
          $('#loading-title').text(data.status)
        },
        error: function (xhr, ajaxOptions, thrownError) {
          if (xhr.status == 404) {
            $('#loading-title').text(thrownError)
          }
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
        url: exportApi,
        data: JSON.stringify(mobileAppProject),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
          $('#loading-title').text("编译打包应用···")
        },
        success: function (res) {
          console.log(res)
          if (res.downloadUrl == null || res.downloadUrl == '' || res.downloadUrl.endsWith("null")) {
            $('#loading-title').text("编译应用失败");
          } else {
            window.location.href = res.downloadUrl
            $('#loading-title').text(res.status)
          }
        },
        failure: function (errMsg) {
          $('#loading-title').text(data.status)
        },
        error: function (xhr, ajaxOptions, thrownError) {
          if (xhr.status == 404) {
            $('#loading-title').text(thrownError)
          }
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
