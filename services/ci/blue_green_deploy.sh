#!/usr/bin/env bash
set -euo pipefail
NAMESPACE=${1:-skillify}
TAG=${2:?Tag required}
DOCKER_USER=${3:?Docker user}
SERVICES=(backend frontend auth-service course-service media-service)

for svc in "${SERVICES[@]}"; do
  echo "[BLUE-GREEN] Preparing GREEN deployment for ${svc} with ${DOCKER_USER}/${svc}:${TAG}"
  # Assumes deployments ${svc}-blue and ${svc}-green managed by a Service ${svc}
  # Switch target by flipping Service selector
  TARGET=$(kubectl -n ${NAMESPACE} get svc ${svc} -o jsonpath='{.spec.selector.version}' 2>/dev/null || echo "blue")
  if [[ "${TARGET}" == "blue" ]]; then
    ACTIVE="blue"; INACTIVE="green"
  else
    ACTIVE="green"; INACTIVE="blue"
  fi
  echo "Active=${ACTIVE}, Inactive=${INACTIVE}"
  kubectl -n ${NAMESPACE} set image deployment/${svc}-${INACTIVE} ${svc}=${DOCKER_USER}/${svc}:${TAG} --record || true
  kubectl -n ${NAMESPACE} rollout status deployment/${svc}-${INACTIVE} --timeout=180s || true
  echo "[BLUE-GREEN] Switching service ${svc} to ${INACTIVE}"
  kubectl -n ${NAMESPACE} patch svc ${svc} -p "{\"spec\":{\"selector\":{\"app\":\"${svc}\",\"version\":\"${INACTIVE}\"}}}"
  echo "[BLUE-GREEN] Success for ${svc}"
 done
