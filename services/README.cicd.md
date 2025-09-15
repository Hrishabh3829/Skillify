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
   - Create a Pipeline job pointing to this repo or a Multibranch Pipeline.
   - Ensure node labeled 'docker' exists with docker & kubectl available.
   - Required Jenkins parameters (preconfigured in Jenkinsfile):
      * DEPLOY_STRATEGY: rolling | canary | blue-green
      * NAMESPACE: k8s namespace (default skillify)
      * RUN_TESTS: boolean to run unit tests
      * PUSH_LATEST: also push :latest tags
      * BRANCH: git branch to build

4. Push images and deploy:
   - Pipeline builds images as nigachu42/<service>:<git-short-sha> and pushes to Docker Hub.
   - Deploy stage supports strategies:
       - rolling: kubectl set image on deployments
       - canary: updates <service>-canary first, waits, then promotes to stable
       - blue-green: updates inactive deployment (<service>-blue/green) and flips Service selector

5. Rollback:
   - Automated on pipeline failure for rolling/canary via services/ci/rollback.sh
   - Manual:
       kubectl -n skillify rollout undo deployment/backend

6. Notes:
   - Replace placeholders in k8s ingress and .env with real values.
   - Do not commit secret keys; use Jenkins credentials or Kubernetes Secrets.
   - For canary and blue-green, you need the corresponding deployments/services pre-created in k8s.
   - Docker Hub user configured: nigachu42; update Jenkinsfile DOCKER_USER if needed.
