#!/bin/bash
set -e

echo your argumnets are: "$@"
if [ "$#" -ne 4 ]; then
echo "please provide the correct arguments 1:umHost 2:umPort 3:apiHost 4:apiPort"
exit
else


sed -i "/umHost/s~http[s].*~$1\";~g" /usr/src/app/src/client/js/redux/actions/wsconfig.js
sed -i  "/umPort/s/[0-9]\{4\}/$2/g" /usr/src/app/src/client/js/redux/actions/wsconfig.js
sed -i  "/apiHost/s~http[s].*~$3\";~g" /usr/src/app/src/client/js/redux/actions/wsconfig.js
sed -i  "/apiPort/s/[0-9]\{4\}/$4/g" /usr/src/app/src/client/js/redux/actions/wsconfig.js

yarn start

# echo "=====updated wsconfig.js========= "
# cat /usr/src/app/src/client/js/redux/actions/wsconfig.js

fi