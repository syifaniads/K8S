# Source Evidence and Provenance

This file maps portfolio claims to retained repository artifacts.

## Core autoscaling evidence

### HPA

`k8s-login-app/k8s/login-app-hpa.yaml`

Supports the following claims:

- Kubernetes `autoscaling/v2` was used;
- target workload: `Deployment/login-app`;
- `minReplicas: 2`;
- `maxReplicas: 4`;
- CPU utilization target: 80%;
- scale-up stabilization: 60 seconds;
- scale-down stabilization: 300 seconds;
- explicit scale-down policies are present.

### Metrics Server

`metrics-server.yaml`

Supports the claim that resource-metric infrastructure required by the HPA was retained as part of the lab.

## Workload evidence

### Node.js application

`k8s-login-app/app/server.js`

Supports claims that the lab workload includes:

- Express;
- MySQL connectivity;
- `/health` endpoint;
- login / registration workflow;
- protected upload workflow.

This is a teaching workload rather than a production authentication reference implementation.

### Containerization

`k8s-login-app/app/Dockerfile`

Supports the containerized-workload claim.

## Kubernetes workload evidence

Relevant manifests include:

- `k8s-login-app/k8s/web-deployment.yaml`
- `k8s-login-app/k8s/web-deployment-lb.yaml`
- `k8s-login-app/k8s/web-service.yaml`
- `k8s-login-app/k8s/web-service-lb.yaml`
- `k8s-login-app/k8s/login-app-ingress.yaml`

These support claims around Deployment replicas, service routing, ingress experimentation, health probes, and environment injection.

## Persistence evidence

Relevant files:

- `k8s-login-app/k8s/mysql-deployment.yaml`
- `k8s-login-app/k8s/mysql-service.yaml`
- `k8s-login-app/k8s/mysql-pv.yaml`
- `k8s-login-app/k8s/mysql-pvc.yaml`
- `k8s-login-app/k8s/mysql-secret.yaml`
- `pv/`

These support the claim that the lab included MySQL plus Kubernetes storage primitives.

## Load-balancing evidence

`LB_DEPLOYMENT.md` and the retained load-balancing manifests document the experiment around multiple replicas, service distribution, server identity, health checks, and ingress.

Because the assignment followed lecturer-provided tutorial material, generic guide text should not be interpreted as original authorship.

## Monitoring evidence

`Prometheus-Grafana.md` records monitoring setup and custom-metrics exploration.

Evidence standard:

- configuration/setup notes: verified as retained documentation;
- long-running Prometheus/Grafana operation: not verified;
- formal SLO/alerting implementation: not verified.

## Ansible evidence

`DEPLOYMEN_ANSIBLE.md` records an Ansible deployment-automation experiment around the Kubernetes workload.

It is treated as an extension / automation experiment, not as proof that Ansible was a required part of the original autoscaling assignment.

## Lecturer / course reference

The user-provided assignment explicitly referenced:

`https://github.com/Widhi-yahya/kubernetes_installation_docker/blob/master/LB_DEPLOYMENT.md`

This is important provenance because it establishes that parts of the workflow were tutorial-driven coursework.

## Related course progression

The user also provided assignment briefs for:

- Autoscaling K8S — 7 May 2026;
- IaC / Terraform — 14 May 2026;
- CI/CD process automation — 28 May 2026.

The separate repository `syifaniads/AutomationServices` preserves evidence for the later Jenkins/Docker/AWS coursework.

## Non-claims

This repository does not claim:

- ownership of lecturer tutorial material;
- production Kubernetes operation;
- measured RPS/latency improvement from autoscaling;
- production-grade MySQL high availability;
- verified Terraform implementation;
- verified Prometheus alerting/SLO operation;
- that every command in historical documentation was executed exactly as written.
