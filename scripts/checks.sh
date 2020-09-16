#!/usr/bin/env bash
set -e
npm run ts
npm run prettier:check
npm run lint:fix
npm run test