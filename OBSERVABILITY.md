# Metrics and Observability

## Metrics Server

Metrics Server is the most important observability component for the autoscaling exercise because the HPA needs resource metrics.

The repository retains `metrics-server.yaml` and documentation for validating the metrics API.

Useful checks:

```bash
kubectl top nodes
kubectl top pods -A
kubectl get hpa
kubectl describe hpa login-app-hpa
```

## Prometheus and Grafana

`Prometheus-Grafana.md` contains an extended monitoring setup using `kube-prometheus-stack`, Prometheus queries, Grafana dashboards, and optional custom metrics ideas.

This material is useful as evidence of monitoring exploration, but the repository does **not** retain enough runtime evidence to claim that a long-running production Prometheus/Grafana stack was operated.

The portfolio therefore distinguishes:

| Area | Evidence level |
|---|---|
| Metrics Server configuration | retained manifest / direct lab artifact |
| HPA consuming resource metrics | retained HPA configuration |
| `kubectl top` / HPA troubleshooting workflow | retained documentation |
| Prometheus/Grafana setup | monitoring exploration / setup notes |
| persistent dashboards, alerts, SLOs | not verified |

## Operational signals that matter

For this workload, useful signals include:

- pod CPU usage;
- pod memory usage;
- desired vs current HPA replicas;
- pod readiness;
- restart count;
- request rate and latency;
- MySQL availability;
- HPA saturation at maximum replicas.

## Production extension

A stronger production setup would connect infrastructure metrics to application-level telemetry and alerts. Examples include:

- OpenTelemetry traces;
- HTTP request duration histograms;
- error-rate metrics;
- database connection-pool metrics;
- alerting when HPA remains at max replicas;
- alerting on pods failing readiness or restarting repeatedly.

These are recommended extensions rather than claims about the historical coursework environment.
