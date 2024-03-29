#!/bin/bash

needBuild=false;

while getopts 'b' opt;
do
    case ${opt} in
        b) # build project
        needBuild=true;;
        ?)
            echo "Usage: `basename $0` [options]"
            exit 1
    esac
done

if $needBuild
then
    echo "compile ezappx-plugin-export..."
    npm run build
fi

echo "copy dist/ezappx-plugin-export.min.js to /E/JavaProjects/Ezappx/EzappxDesigner/src/main/resources/static/js"
cp dist/ezappx-plugin-export.min.js /E/JavaProjects/Ezappx/EzappxDesigner/src/main/resources/static/js
echo "done"