#!/usr/bin/env bash
set -e

npm i
npm run build
npm run semantic-release