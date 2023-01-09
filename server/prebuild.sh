#!/bin/bash
client="../client/dist/client"
clientDestination="client"

if [[ -d $clientDestination ]]; then
  rm -rf $clientDestination
fi

mkdir -p $clientDestination

if [[ -d $client ]]; then
  cp -R "$client/." $clientDestination
fi

