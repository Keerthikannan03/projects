#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Keerthikannan03/vue-projects.git main:gh-pages-todolist

cd -
