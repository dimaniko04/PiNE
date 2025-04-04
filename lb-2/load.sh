#!/bin/bash

# Paths to server and client scripts (edit if needed)
TCP_SERVER="node --env-file=.env tcp-server.js"
UDP_SERVER="node --env-file=.env udp-server.js"
TCP_LOAD_CLIENT="node --env-file=.env tcp-load-client.js"
UDP_LOAD_CLIENT="node --env-file=.env udp-load-client.js"

# Launch servers in new terminals
gnome-terminal -- bash -c "$TCP_SERVER; exec bash"
gnome-terminal -- bash -c "$UDP_SERVER; exec bash"

# Give servers time to start
sleep 2

# Launch clients in new terminals
gnome-terminal -- bash -c "$TCP_LOAD_CLIENT; exec bash"
gnome-terminal -- bash -c "$UDP_LOAD_CLIENT; exec bash"
