#!/bin/bash

# we need to delete typeorm because instanceof error https://stackoverflow.com/a/63937850
if [[ -d "node_modules/typeorm" ]]; then
  rm -rf node_modules/typeorm
fi
