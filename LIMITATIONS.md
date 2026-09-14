# Limitations and Non-Claims

This repository is a coursework lab, not a production Kubernetes platform.

## Evidence limitations

The repository retains manifests and documentation, but it does not retain a complete experimental dataset or all original submission PDFs. Therefore it should not be used to claim exact performance numbers that are not present in the source.

In particular, the current portfolio does not claim:

- a measured requests-per-second improvement from HPA;
- a specific autoscaling reaction time measured under controlled load;
- quantified p95/p99 latency improvement;
- production traffic exposure;
- multi-zone or multi-region availability;
- production-grade MySQL replication/failover;
- a persistent Prometheus/Grafana monitoring environment;
- Terraform implementation in this repository;
- original authorship of lecturer-provided tutorial material.

## Lab topology limitations

The retained setup is a small educational cluster. Local storage and manually distributed Docker images are useful for learning, but they do not model a modern production platform directly.

## Application limitations

The bundled login/upload app exists primarily to generate a realistic stateful workload for the Kubernetes exercises. It should not be evaluated as a polished production application.

## Autoscaling limitations

The HPA uses CPU utilization. CPU is a valid lab signal, but production services may need other demand indicators such as request concurrency, queue depth, custom application metrics, or latency objectives.

The HPA also scales application replicas only. It does not solve database bottlenecks, node-capacity shortages, or external dependency saturation.

## Monitoring limitations

Prometheus/Grafana setup notes are present, but setup documentation alone is not evidence of sustained production monitoring, alerting, dashboards, or SLO operations.

## Why these limitations are public

The purpose of this repository is to show engineering understanding and evidence discipline. A senior reviewer should be able to distinguish what was implemented, what was explored, and what would be required to take the lab toward production.
