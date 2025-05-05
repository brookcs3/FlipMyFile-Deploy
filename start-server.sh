#!/bin/bash

# Change to the dist directory
cd "$(dirname "$0")/dist"

# Start Python's HTTP server on port 8000
echo "Starting HTTP server on port 8000..."
python3 -m http.server 8000 &

# Save the process ID so we can stop it later
echo $! > server.pid

echo "Server started! Access your application at http://localhost:8000"
echo "To stop the server, run: kill $(cat server.pid)"