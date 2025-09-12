Skillify CI/CD quickstart
-------------------------

1. Local dev:
   docker-compose -f docker-compose.dev.yml up --build

2. Build & test locally:
   cd services/backend && npm ci && npm test
   cd services/frontend && npm ci && npm run build

3. Jenkins setup:
   - Install Jenkins on a host with docker & kubectl.
   - Install Pipeline, Docker, GitHub, SSH Agent plugins.
   - Add Jenkins credentials:
       * docker-hub-creds    (Username/password)
       * kubeconfig          (Secret file)
   - Create a Multibranch Pipeline or Pipeline job pointing to this repo.
   - Ensure node labeled 'docker' exists with docker & kubectl available.

4. Push images and deploy:
   - Pipeline will build images as nigachu42/<service>:<git-short-sha> and push to Docker Hub.
   - Jenkins will update k8s deployments using the same tag.

5. Rollback:
   kubectl -n skillify rollout undo deployment/backend

6. Notes:
   - Replace placeholders in k8s ingress and .env with real values.
   - Do not commit secret keys; use Jenkins credentials or Kubernetes Secrets.
