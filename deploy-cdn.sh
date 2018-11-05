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

echo "deploy dist/ezappx-plugin-export.min.js to cdn"
scp dist/ezappx-plugin-export.min.js ing@www.ezappx.com:~/cdn/js
echo "done"