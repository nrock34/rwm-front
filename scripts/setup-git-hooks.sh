#!/bin/sh

set -eu

git config core.hooksPath .githooks
git config commit.template .gitmessage.txt

echo "Configured local git hooks path to .githooks"
echo "Configured local commit template to .gitmessage.txt"
