# Deployment Guide

This document keeps the original lab deployment flow but removes environment-specific IP addresses, usernames, and credentials.

> This is an educational Kubernetes lab, not a production deployment recipe.

## 1. Prerequisites

- a working Kubernetes control plane and at least one worker node;
- `kubectl` configured for the cluster;
- Docker available where the image is built/loaded;
- Metrics Server if the HPA exercise will be used;
- Calico or another functioning CNI;
- local storage prepared if using the retained PV/PVC manifests.

## 2. Configure lab secrets

Before applying the manifests, edit:

`k8s-login-app/k8s/mysql-secret.yaml`

Replace all `REPLACE_ME` values with disposable lab secrets. Never commit real credentials.

## 3. Build the workload image

```bash
cd k8s-login-app/app
docker build -t login-app:latest .
docker save login-app:latest > login-app.tar
```

The retained workload uses `imagePullPolicy: Never`, so every node that may schedule the application needs access to the local image.

Example transfer pattern:

```bash
scp login-app.tar <user>@<worker-node>:/tmp/login-app.tar
ssh <user>@<worker-node> 'docker load < /tmp/login-app.tar'
```

For a modern shared environment, a registry is preferable to manual image distribution.

## 4. Prepare local storage

The retained MySQL configuration uses lab-oriented local storage. Prepare the configured host path on the appropriate node before applying the PV.

Example:

```bash
sudo mkdir -p /mnt/data
```

Avoid world-writable permissions in real environments; use the minimum permissions required by the storage design.

## 5. Deploy MySQL

```bash
kubectl apply -f k8s-login-app/k8s/mysql-secret.yaml
kubectl apply -f k8s-login-app/k8s/mysql-pv.yaml
kubectl apply -f k8s-login-app/k8s/mysql-pvc.yaml
kubectl apply -f k8s-login-app/k8s/mysql-service.yaml
kubectl apply -f k8s-login-app/k8s/mysql-deployment.yaml

kubectl get pods -l app=mysql
kubectl wait --for=condition=ready pod -l app=mysql --timeout=180s
```

## 6. Deploy the web workload

```bash
kubectl apply -f k8s-login-app/k8s/web-deployment.yaml
kubectl apply -f k8s-login-app/k8s/web-service.yaml

kubectl get pods -l app=login-app
kubectl get svc
```

For the load-balancing variant:

```bash
kubectl apply -f k8s-login-app/k8s/web-deployment-lb.yaml
kubectl apply -f k8s-login-app/k8s/web-service-lb.yaml
```

## 7. Apply Metrics Server and HPA

```bash
kubectl apply -f metrics-server.yaml
kubectl apply -f k8s-login-app/k8s/login-app-hpa.yaml

kubectl top pods
kubectl get hpa
kubectl describe hpa login-app-hpa
```

See [AUTOSCALING.md](./AUTOSCALING.md) for the retained HPA policy.

## 8. Verify workload health

```bash
kubectl get deployment login-app
kubectl get pods -l app=login-app -o wide
kubectl describe deployment login-app
kubectl logs -l app=login-app --tail=100
```

The deployment uses `/health` for readiness and liveness checks.

## 9. Verify service distribution

```bash
kubectl get svc
kubectl get endpoints
kubectl get pods -l app=login-app -o wide
```

If using the server-identity experiment, send repeated requests to the service endpoint and compare which pod handles each request.

See [LOAD_BALANCING.md](./LOAD_BALANCING.md).

## 10. Troubleshooting

### DNS / service discovery

```bash
kubectl exec -it $(kubectl get pods -l app=login-app -o name | head -1) -- nslookup mysql
```

### MySQL connectivity

```bash
kubectl logs -l app=mysql
kubectl exec -it $(kubectl get pods -l app=login-app -o name | head -1) -- sh -c 'nc -zv mysql 3306'
```

### Metrics

```bash
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods
kubectl describe hpa login-app-hpa
```

### CNI

```bash
kubectl get pods -A
kubectl get nodes -o wide
```

If a CNI-specific change is required, use the actual cluster documentation rather than copying historical IP-specific commands from old lab notes.

## 11. Cleanup

```bash
kubectl delete hpa login-app-hpa --ignore-not-found
kubectl delete deployment login-app mysql --ignore-not-found
kubectl delete service login-app mysql --ignore-not-found
kubectl delete pvc mysql-pvc --ignore-not-found
kubectl delete pv mysql-pv --ignore-not-found
kubectl delete secret mysql-secret --ignore-not-found
```

## Security note

Earlier coursework versions of this file contained private lab IP addresses and demo credentials. They have been removed from the current branch. Historical values must be treated as compromised and never reused.
