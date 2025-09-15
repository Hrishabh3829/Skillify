#!/usr/bin/env bash
set -euo pipefail
# Basic placeholder health checks; replace with actual endpoints
NAMESPACE=${1:-skillify}
ENDPOINTS=("https://skillify-green.vercel.app" "https://skillify-backend-bf3o.onrender.com/api/v1/user/profile")
for url in "${ENDPOINTS[@]}"; do
  echo "[HEALTH] GET ${url}"
  code=$(curl -s -o /dev/null -w "%{http_code}" "${url}")
  echo "[HEALTH] ${url} -> ${code}"
 done
