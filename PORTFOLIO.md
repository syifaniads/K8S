# Portfolio Copy

## Portfolio card

**Kubernetes Autoscaling & Load-Balancing Lab — Group Lead**

Led a three-person FILKOM coursework team deploying a containerized Node.js/MySQL workload on a small Kubernetes lab and configuring service-based traffic distribution, readiness/liveness probes, persistent storage, Metrics Server, and an `autoscaling/v2` Horizontal Pod Autoscaler. The retained HPA scales the application between 2 and 4 replicas around an 80% CPU-utilization target and includes explicit stabilization behavior for scale-up and scale-down. Extended the lab with ingress, pod-identity-based load-balancing verification, monitoring notes, and Ansible automation experiments.

## Team

- **Syifani Adillah Salsabila** — Group Lead / Ketua Kelompok
- Latifa Anggia Fitriana — Team Member
- Jonathan Salim — Team Member

## Short CV bullet

- **Led a three-person team** implementing and documenting a Kubernetes autoscaling lab for a containerized Node.js/MySQL workload using HPA, Metrics Server, Services/Ingress, health probes, and persistent storage; configured bounded CPU-driven scaling from 2–4 replicas with stabilization policies.

## Infrastructure-focused version

- Led a three-person coursework team implementing a multi-node Kubernetes environment with Calico networking, Metrics Server, HPA, service load balancing, NGINX Ingress experimentation, PV/PVC-backed MySQL, and deployment troubleshooting workflows.

## DevOps-focused version

- Coordinated and participated in a three-person Kubernetes lab covering container deployment, service discovery, health checks, persistent storage, metrics-driven autoscaling, ingress routing, monitoring exploration, and Ansible-based automation.

## Interview talking points

A useful interview explanation is:

> I served as the group lead for a three-person Kubernetes coursework team. The goal was not just to run an app in Kubernetes, but to understand how the infrastructure pieces interact when workload changes. The app sat behind a Service with multiple replicas, Metrics Server supplied CPU metrics to the HPA, and the HPA changed Deployment replicas within explicit bounds. Readiness checks mattered because newly created pods should not receive traffic before they were ready, while the longer scale-down stabilization window reduced aggressive scale-in. We also worked with persistent MySQL storage and load-balancing/Ingress experiments. As the lead, I coordinated the group work while still participating in the technical implementation and documentation.

## Evidence-based details worth mentioning

- role: **Group Lead / Ketua Kelompok**;
- three-person team;
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

Do not claim exact throughput improvements, production traffic, production availability, or production Prometheus/SLO operation unless new evidence is recovered. Also do not imply sole authorship of all lecturer-derived or collaborative coursework artifacts.

## Suggested tags

`Kubernetes` · `HPA` · `Docker` · `Metrics Server` · `Ingress` · `MySQL` · `DevOps` · `Autoscaling` · `Load Balancing` · `Infrastructure` · `Team Lead`
