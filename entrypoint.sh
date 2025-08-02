#!/bin/bash
set -e

ollama serve &> ./ollama.log &  # Start Ollama server in the background
npm run start &> ./start.log & # Start the Node.js application in the background
bash # Keep the container running
