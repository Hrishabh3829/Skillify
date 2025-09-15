#!/usr/bin/env bash
set -euo pipefail
NAMESPACE=${1:-skillify}
TAG=${2:?Tag required}
DOCKER_USER=${3:?Docker user}
SERVICES=(backend frontend auth-service course-service media-service)

for svc in "${SERVICES[@]}"; do
  echo "[CANARY] Deploying ${svc} canary image ${DOCKER_USER}/${svc}:${TAG}"
  # Assumes a canary deployment ${svc}-canary exists routing small traffic via service selector/ingress
  kubectl -n ${NAMESPACE} set image deployment/${svc}-canary ${svc}=${DOCKER_USER}/${svc}:${TAG} --record || true
  kubectl -n ${NAMESPACE} rollout status deployment/${svc}-canary --timeout=120s || true
  echo "[CANARY] Monitor metrics before promoting... (hook your Prometheus/Grafana checks here)"
  # Placeholder: add SLO check here; exit non-zero to abort
  sleep 5
  echo "[CANARY] Promoting ${svc} to stable"
  kubectl -n ${NAMESPACE} set image deployment/${svc} ${svc}=${DOCKER_USER}/${svc}:${TAG} --record || true
  kubectl -n ${NAMESPACE} rollout status deployment/${svc} --timeout=180s || true
 done
