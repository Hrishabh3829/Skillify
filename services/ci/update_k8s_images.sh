#!/usr/bin/env bash
TAG=${1:-latest}
NAMESPACE=${2:-skillify}
SERVICES=(backend frontend auth-service course-service media-service)

for svc in "${SERVICES[@]}"; do
  echo "Updating ${svc} -> nigachu42/${svc}:${TAG}"
  kubectl -n ${NAMESPACE} set image deployment/${svc} ${svc}=nigachu42/${svc}:${TAG} --record
done
