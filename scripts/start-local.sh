#!/bin/bash

# Detect local IP address
DETECTED_IP=$(node scripts/get-local-ip.js)

if [ -z "$DETECTED_IP" ]; then
  echo "❌ Failed to detect local IP address"
  exit 1
fi

echo "🔍 Detected local IP: $DETECTED_IP"
echo "🚀 Starting Expo with local backend at http://$DETECTED_IP:5173"

# Export the WEB_URL with detected IP
export WEB_URL="http://$DETECTED_IP:5173"

# Run expo start with any additional arguments passed to the script
expo start "$@"
