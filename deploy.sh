#!/bin/sh

git archive --format=tar HEAD > "puggies-src.tar.gz"
cd frontend
PUBLIC_URL=/ yarn build
cp ../LICENSE build/LICENSE.txt
cp ../puggies-src.tar.gz build
cd build
cp index.html 200.html

if [ "$1" = "--full" ]; then
    surge . --domain=pugs.jayden.codes
fi
