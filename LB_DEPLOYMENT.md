# Legacy Load-Balancing Walkthrough

This file is retained as coursework evidence for the load-balancing exercise. The original version closely followed lecturer-provided tutorial material and contained duplicated sections and environment-specific examples.

For the recruiter-facing explanation, see [LOAD_BALANCING.md](./LOAD_BALANCING.md).

## Retained lab flow

### 1. Run multiple replicas

The workload deployment runs more than one `login-app` pod so Kubernetes Service traffic can be distributed across healthy replicas.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: login-app
spec:
  replicas: 2
```

The concrete retained manifest is:

`k8s-login-app/k8s/web-deployment-lb.yaml`

### 2. Expose pod identity

The project contains `k8s-login-app/app/server-patch.js`, which exposes pod/node identity for a simple verification experiment. Repeated requests can therefore show which replica served a request.

### 3. Health probes

The workload uses `/health` for readiness and liveness checks.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000

readinessProbe:
  httpGet:
    path: /health
    port: 3000
```

Readiness is particularly relevant to traffic distribution because only Ready endpoints should receive normal Service traffic.

### 4. Service

The project retains Kubernetes Service manifests for exposing the application. A Service provides a stable endpoint while pods can be replaced or scaled independently.

Relevant files:

- `k8s-login-app/k8s/web-service.yaml`
- `k8s-login-app/k8s/web-service-lb.yaml`

### 5. Ingress experiment

The repository also contains:

`k8s-login-app/k8s/login-app-ingress.yaml`

This represents an NGINX Ingress experiment layered above the Service. It should not be interpreted as evidence of a production cloud load balancer.

## Verification

```bash
kubectl get pods -l app=login-app -o wide
kubectl get svc
kubectl get ingress
kubectl get endpoints
```

If the server-identity endpoint is enabled, send repeated requests to the application and observe the pod identity returned.

## Relationship to autoscaling

Load balancing and autoscaling solve different problems:

- the HPA decides **how many replicas** the Deployment should have;
- the Service / Ingress path determines **how requests reach available replicas**;
- readiness determines **which replicas are eligible for traffic**.

See [AUTOSCALING.md](./AUTOSCALING.md).

## Attribution

The May 2026 coursework explicitly instructed students to follow lecturer-provided material, including the upstream `Widhi-yahya/kubernetes_installation_docker` load-balancing tutorial.

Accordingly, this document is presented as a cleaned record of the lab workflow—not as a claim of original authorship of the generic Kubernetes tutorial.
