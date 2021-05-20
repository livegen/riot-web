#!/bin/bash

set -e

if [ -n "$DIST_VERSION" ]; then
    version=$DIST_VERSION
else
    version=`git describe --dirty --tags || echo unknown`
fi

yarn clean
yarn build

# include the sample config in the tarball. Arguably this should be done by
# `yarn build`, but it's just too painful.
cp config.json webapp/
cp config.json webapp/config.livegen.net.json

mkdir -p webapp/.well-known/matrix
echo '{"m.server":"hs.livegen.net"}' > webapp/.well-known/matrix/server

# if $version looks like semver with leading v, strip it before writing to file
if [[ ${version} =~ ^v[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+(-.+)?$ ]]; then
    echo ${version:1} > webapp/version
else
    echo ${version} > webapp/version
fi
