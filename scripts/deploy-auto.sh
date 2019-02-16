#!/bin/bash

set -e

dev=""
version=`git describe --dirty --tags || echo unknown`

npm run clean
npm run build$dev

cp config.json webapp/

if [[ ${version} =~ ^v[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+(-.+)?$ ]]; then
    echo ${version:1} > webapp/version
else
    echo ${version} > webapp/version
fi
