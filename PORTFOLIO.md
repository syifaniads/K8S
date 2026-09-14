# Portfolio Copy

## Portfolio card

**Kubernetes Autoscaling & Load-Balancing Lab**

Deployed a containerized Node.js/MySQL workload on a small Kubernetes lab and configured service-based traffic distribution, readiness/liveness probes, persistent storage, Metrics Server, and an `autoscaling/v2` Horizontal Pod Autoscaler. The retained HPA scales the application between 2 and 4 replicas around an 80% CPU-utilization target and includes explicit stabilization behavior for scale-up and scale-down. Extended the lab with ingress, pod-identity-based load-balancing verification, monitoring notes, and Ansible automation experiments.

## Short CV bullet

- Built and evaluated a Kubernetes autoscaling lab for a containerized Node.js/MySQL workload using HPA, Metrics Server, Services/Ingress, health probes, and persistent storage; configured bounded CPU-driven scaling from 2–4 replicas with stabilization policies.

## Infrastructure-focused version

- Implemented a multi-node Kubernetes coursework environment with Calico networking, Metrics Server, HPA, service load balancing, NGINX Ingress experimentation, PV/PVC-backed MySQL, and deployment troubleshooting workflows.

## DevOps-focused version

- Practiced Kubernetes workload operations end-to-end: container deployment, service discovery, health checks, persistent storage, metrics-driven autoscaling, ingress routing, monitoring exploration, and automation with Ansible.

## Interview talking points

A useful interview explanation is:

> The goal was not just to run an app in Kubernetes. I wanted to understand how the pieces interact when the workload changes. The app sat behind a Service with multiple replicas, Metrics Server supplied CPU metrics to the HPA, and the HPA changed Deployment replicas within explicit bounds. Readiness checks mattered because newly created pods should not receive traffic before they were ready, while the longer scale-down stabilization window reduced aggressive scale-in. The database was intentionally kept as a separate stateful dependency, which also highlighted that scaling stateless application pods does not automatically solve database capacity.

## Evidence-based details worth mentioning

- `autoscaling/v2` HPA;
- 2 minimum replicas / 4 maximum replicas;
- 80% average CPU target;
- 60-second scale-up stabilization;
- 300-second scale-down stabilization;
- readiness and liveness probes;
- Kubernetes Services and NGINX Ingress experiment;
- MySQL PV/PVC-backed persistence;
- Metrics Server;
- pod/server identity experiment to observe request distribution.

## Details not to claim

Do not claim exact throughput improvements, production traffic, production availability, or production Prometheus/SLO operation unless new evidence is recovered.

## Suggested tags

`Kubernetes` · `HPA` · `Docker` · `Metrics Server` · `Ingress` · `MySQL` · `DevOps` · `Autoscaling` · `Load Balancing` · `Infrastructure`
