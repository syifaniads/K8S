# Prometheus / Grafana Monitoring Exploration

This document records a monitoring extension explored around the Kubernetes autoscaling lab.

For the evidence-oriented summary, see [OBSERVABILITY.md](./OBSERVABILITY.md).

> Presence of setup notes is not treated as proof that a persistent production monitoring stack was operated.

## Metrics Server first

The HPA exercise depends on Kubernetes resource metrics. Verify Metrics Server before adding a larger monitoring stack:

```bash
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods -A
```

## Prometheus and Grafana with Helm

A disposable lab can install `kube-prometheus-stack`:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

kubectl create namespace monitoring
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false
```

Do not put Grafana passwords directly in a public command or repository. Supply credentials through a secret-management mechanism appropriate to the environment.

Verify components:

```bash
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

## Useful infrastructure signals

For the `login-app` workload, useful signals include:

- pod CPU usage;
- pod memory usage;
- desired/current HPA replicas;
- pod readiness and restart count;
- network receive/transmit rate;
- request throughput and latency if application metrics are instrumented.

Example PromQL ideas:

```promql
sum(rate(container_cpu_usage_seconds_total{namespace="default",pod=~"login-app.*"}[5m])) by (pod)
```

```promql
sum(container_memory_working_set_bytes{namespace="default",pod=~"login-app.*"}) by (pod)
```

```promql
sum(rate(container_network_receive_bytes_total{namespace="default",pod=~"login-app.*"}[5m])) by (pod)
```

## Application instrumentation idea

The historical notes explored adding Prometheus middleware to the Node.js workload and exposing `/metrics`. That is an extension idea, not a verified production feature of the retained application.

A ServiceMonitor could then be used to let Prometheus discover the application endpoint.

## Autoscaling verification

While generating controlled traffic in a disposable lab:

```bash
kubectl get hpa -w
kubectl get pods -w
kubectl top pods
```

The retained HPA itself is documented in [AUTOSCALING.md](./AUTOSCALING.md).

## Custom metrics

The earlier coursework notes also explored Prometheus Adapter and network-based custom metrics. Those ideas are useful for understanding that CPU is not the only possible scaling signal.

However, the current repository does not retain enough runtime evidence to claim a completed custom-metrics HPA deployment. The verified autoscaling artifact remains the CPU-based `login-app-hpa.yaml`.

## Production follow-up

A mature observability setup would add:

- durable dashboards;
- alert rules;
- request/error/latency metrics;
- traces;
- SLOs and burn-rate alerts;
- monitoring for HPA saturation;
- database metrics;
- ownership/runbook links.

These are recommendations, not historical implementation claims.
