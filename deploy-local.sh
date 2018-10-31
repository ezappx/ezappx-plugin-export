#!/usr/bin/env bash

echo "compile ezappx-plugin-export..."
npm run build
echo "copy dist/ezappx-plugin-export.min.js to /E/JavaProjects/Ezappx/EzappxDesigner/src/main/resources/static/js"
cp dist/ezappx-plugin-export.min.js /E/JavaProjects/Ezappx/EzappxDesigner/src/main/resources/static/js
echo "done"