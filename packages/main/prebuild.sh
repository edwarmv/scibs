#!/bin/bash
client="../client/dist/renderer"
destination="static"
if [[ -d $client ]]; then
  if [[ -d $destination ]]; then
    rm -rf $destination
  fi
  cp -R $client $destination
fi
