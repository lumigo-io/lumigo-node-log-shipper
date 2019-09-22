#!/usr/bin/env bash
set -e
npm test
npm run lint
npm run lint-staged