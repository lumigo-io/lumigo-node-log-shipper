#!/usr/bin/env bash
set -e
npm run prettier:fix
npm run lint:fix
npm run test