#!/usr/bin/env bash
set -euo pipefail
NAMESPACE=${1:-skillify}
SERVICES=(backend frontend auth-service course-service media-service)
for svc in "${SERVICES[@]}"; do
  echo "[ROLLBACK] ${svc}"
  kubectl -n ${NAMESPACE} rollout undo deployment/${svc} || true
  kubectl -n ${NAMESPACE} rollout status deployment/${svc} --timeout=180s || true
 done
