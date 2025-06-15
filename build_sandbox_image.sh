#!/bin/bash

# Build the minimal Docker image for code execution
docker build -t ai-interviewer-sandbox:latest -f Dockerfile.sandbox .

echo "Built minimal Docker image for code execution" 